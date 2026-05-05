const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Comments = require('../models/commentModel');
const Notifications = require('../models/notifyModel');
const Video = require('../models/videoModel');
const sendMail = require('./sendMail');
const Report = require('../models/reportModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const userCtrl = {
  assignCategoriesToModerator: async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedCategories } = req.body;

      console.log('📝 Asignando categorías a:', id);

      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }

      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }

      user.assignedCategories = assignedCategories || [];
      await user.save();

      res.json({ success: true, message: "Catégories assignées", user });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getModeratorCategories: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findById(id).select('assignedCategories role canApproveAllCategories');
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }

      if (user.role !== 'moderator') {
        return res.status(400).json({
          success: false,
          message: "Cet utilisateur n'est pas un modérateur"
        });
      }

      res.json({
        success: true,
        canApproveAll: user.canApproveAllCategories,
        categories: user.assignedCategories
      });
    } catch (err) {
      console.error('❌ Error getModeratorCategories:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  checkModeratorPermission: async (req, res) => {
    try {
      const { userId, categorySlug, subCategorySlug } = req.params;

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }

      let canModerate = false;

      if (user.role === 'admin') {
        canModerate = true;
      } else if (user.role === 'moderator') {
        if (user.canApproveAllCategories) {
          canModerate = true;
        } else if (user.assignedCategories && user.assignedCategories.length > 0) {
          canModerate = user.assignedCategories.some(cat =>
            cat.slug === categorySlug ||
            (subCategorySlug && cat.subCategories && cat.subCategories.includes(subCategorySlug))
          );
        }
      }

      res.json({
        success: true,
        canModerate,
        role: user.role,
        permissionLevel: user.permissionLevel
      });
    } catch (err) {
      console.error('❌ Error checkModeratorPermission:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  contactForActivation: async (req, res) => {
    try {
      const { message, lang } = req.body;
      const user = req.user;

      if (!message || !message.trim()) {
        return res.status(400).json({ msg: 'El mensaje es obligatorio.' });
      }

      const subject = `Solicitud de activación de cuenta - ${user.username}`;
      const customMessage = `
        El usuario ${user.username} ha solicitado la activación de su cuenta.

        ID: ${user._id}
        Correo: ${user.email}

        Mensaje del usuario:
        ${message}
      `;

      const adminEmail = "artealger2020argelia@gmail.com";
      await sendMail(adminEmail, '#', lang || 'es', 'informativo', subject, customMessage);

      return res.json({ msg: '✅ Mensaje enviado correctamente al administrador.' });
    } catch (err) {
      console.error('❌ Error al procesar solicitud de activación:', err);
      return res.status(500).json({ msg: 'Error interno del servidor.' });
    }
  },

  contactMailSupport: async (req, res) => {
    try {
      const { title, message, lang } = req.body;
      const user = req.user;

      if (!user) {
        return res.status(401).json({ msg: 'Usuario no autenticado.' });
      }

      if (!title || !message) {
        return res.status(400).json({ msg: 'Faltan el título o el mensaje.' });
      }

      const subject = `[Contacto] ${title} - ${user.username}`;
      const fullMessage = `
Mensaje del usuario:
--------------------
Nombre: ${user.username}
Email: ${user.email}
ID: ${user._id}

Mensaje:
--------
${message}
      `;

      await sendMail('artealger2020argelia@gmail.com', '#', lang || 'es', 'informativo', subject, fullMessage);

      return res.json({ success: true, msg: 'Mensaje enviado correctamente.' });
    } catch (err) {
      console.error('❌ Error al enviar el mensaje de contacto:', err);
      return res.status(500).json({ msg: 'Error interno al enviar el mensaje.' });
    }
  },

  contactBlockedSupport: async (req, res) => {
    try {
      const { message, lang } = req.body;
      const user = req.user;

      if (!message) {
        return res.status(400).json({ msg: 'El mensaje es obligatorio.' });
      }

      const subject = `🛑 Solicitud de revisión de bloqueo - ${user.username}`;
      const fullMessage = `
Usuario: ${user.username}
ID: ${user._id}
Email: ${user.email}
Mensaje: ${message}
Fecha de solicitud: ${new Date().toLocaleString(lang || 'es')}
      `;

      await sendMail('artealger2020argelia@gmail.com', '#', lang || 'es', 'informativo', subject, fullMessage);

      return res.json({ msg: '✅ Solicitud de desbloqueo enviada correctamente.' });
    } catch (err) {
      console.error('❌ Error en contactBlockedSupport:', err);
      return res.status(500).json({ msg: 'Error al enviar la solicitud.' });
    }
  },

  validateUserActivity: async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    if (!user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (!user.isVerified && accountAge > threeDays) {
      await Users.findByIdAndDelete(user._id);
      return res.status(403).json({
        msg: 'Tu cuenta ha sido eliminada por no verificarla a tiempo. Regístrate de nuevo si deseas acceder.',
      });
    }

    next();
  },

  toggleActiveStatus: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

      user.isActive = !user.isActive;
      await user.save();

      res.json({ msg: "Estado actualizado", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAdmins: async (req, res) => {
    try {
      const admins = await Users.find({ role: 'admin' })
        .select('username avatar online _id');
      res.json({ users: admins });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  searchUser: async (req, res) => {
    try {
      const users = await Users.find({ username: { $regex: req.query.username } })
        .limit(10).select("username avatar");
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select('-password')
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });
      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
   
  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website } = req.body;
      if (!fullname) return res.status(400).json({ msg: "Please add your full name." });

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        avatar, fullname, mobile, address, story, website
      });

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  follow: async (req, res) => {
    try {
      const user = await Users.find({_id: req.params.id, followers: req.user._id});
      if(user.length > 0) return res.status(500).json({msg: "You followed this user."});

      const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
        $push: {followers: req.user._id}
      }, {new: true}).populate("followers following", "-password");

      await Users.findOneAndUpdate({_id: req.user._id}, {
        $push: {following: req.params.id}
      }, {new: true});

      res.json({newUser});
    } catch (err) {
      return res.status(500).json({msg: err.message});
    }
  },

  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
        $pull: {followers: req.user._id}
      }, {new: true}).populate("followers following", "-password");

      await Users.findOneAndUpdate({_id: req.user._id}, {
        $pull: {following: req.params.id}
      }, {new: true});

      res.json({newUser});
    } catch (err) {
      return res.status(500).json({msg: err.message});
    }
  },

  deleteUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Acceso denegado. Se requieren privilegios de administrador' });
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, msg: 'ID de usuario no válido' });
      }

      const userToDelete = await Users.findById(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
      }

      if (userToDelete._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, msg: 'No puedes eliminarte a ti mismo' });
      }

      const userVideos = await Video.find({ user: req.params.id });

      await Video.deleteMany({ user: req.params.id });

      await Comments.deleteMany({ videoId: { $in: userVideos.map(v => v._id) } });

      await Report.deleteMany({
        $or: [
          { userId: req.params.id },
          { reportedBy: req.params.id }
        ]
      });

      await Comments.deleteMany({ user: req.params.id });

      await Notifications.deleteMany({
        $or: [
          { sender: req.params.id },
          { recipient: req.params.id }
        ]
      });

      await Users.updateMany(
        {
          $or: [
            { followers: req.params.id },
            { following: req.params.id },
            { savedVideos: { $in: userVideos.map(v => v._id) } }
          ]
        },
        {
          $pull: {
            followers: req.params.id,
            following: req.params.id,
            savedVideos: { $in: userVideos.map(v => v._id) }
          }
        }
      );

      await Video.updateMany(
        { likes: req.params.id },
        { $pull: { likes: req.params.id } }
      );

      await userToDelete.deleteOne();

      res.json({
        success: true,
        msg: 'Usuario y todo su contenido relacionado eliminados permanentemente',
        deletedAt: new Date()
      });
    } catch (err) {
      console.error('Error en eliminación completa:', err);
      res.status(500).json({ success: false, msg: 'Error al eliminar usuario', error: err.message });
    }
  },

  getUsersAction: async (req, res) => {
    try {
      const filter = req.query.filter;

      const query = Users.find()
        .select('-password')
        .populate('followers', 'username avatar')
        .populate('following', 'username avatar')
        .lean();

      const features = new APIfeatures(query, req.query).paginating();
      const users = await features.query.sort('-createdAt');

      const usersWithDetails = await Promise.all(
        users.map(async (user) => {
          try {
            const videos = await Video.find({ user: user._id, pendiente: false, isActive: true });

            const totalLikesReceived = videos.reduce((acc, video) => {
              return acc + (video.likes ? video.likes.length : 0);
            }, 0);

            const totalCommentsReceived = videos.reduce((acc, video) => {
              return acc + (video.comments ? video.comments.length : 0);
            }, 0);

            const reportsReceived = await Report.countDocuments({ userId: user._id });
            const likesGiven = await Video.countDocuments({ likes: user._id });
            const commentsMade = await Comments.countDocuments({ user: user._id });

            let blockInfoData = null;
            if (user.isBlocked && user.blockDetails && user.blockDetails.reason) {
              blockInfoData = {
                motivo: user.blockDetails.reason || 'Sin especificar',
                content: user.blockDetails.description,
                fechaLimite: user.blockDetails.blockExpiryDate,
                esBloqueado: user.isBlocked,
                bloqueadoEn: user.blockDetails.blockDate,
                bloqueadoPor: user.blockDetails.blockedBy || null
              };
            }

            return {
              ...user,
              isBlocked: user.isBlocked || false,
              blockInfo: blockInfoData,
              blockDetails: user.blockDetails,
              videoCount: videos.length,
              totalLikesReceived,
              totalCommentsReceived,
              totalFollowers: user.followers.length || 0,
              totalFollowing: user.following.length || 0,
              totalReportsReceived: reportsReceived,
              likesGiven,
              commentsMade,
              videos: videos || []
            };
          } catch (userError) {
            console.error('Error procesando usuario:', userError);
            return {
              ...user,
              isBlocked: user.isBlocked || false,
              videoCount: 0,
              totalLikesReceived: 0,
              totalCommentsReceived: 0,
              totalFollowers: 0,
              totalFollowing: 0,
              totalReportsReceived: 0,
              likesGiven: 0,
              commentsMade: 0,
              blockInfo: null,
              videos: []
            };
          }
        })
      );

      switch (filter) {
        case 'mostLikes':
          usersWithDetails.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
          break;
        case 'mostComments':
          usersWithDetails.sort((a, b) => b.totalCommentsReceived - a.totalCommentsReceived);
          break;
        case 'mostFollowers':
          usersWithDetails.sort((a, b) => b.totalFollowers - a.totalFollowers);
          break;
        case 'mostVideos':
          usersWithDetails.sort((a, b) => b.videoCount - a.videoCount);
          break;
        case 'mostReports':
          usersWithDetails.sort((a, b) => b.totalReportsReceived - a.totalReportsReceived);
          break;
        case 'lastLogin':
          usersWithDetails.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
          break;
        case 'latestRegistered':
          usersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      res.json({
        msg: 'Success!',
        result: usersWithDetails.length,
        users: usersWithDetails,
      });
    } catch (err) {
      console.error('ERROR en getUsersAction:', err);
      return res.status(500).json({ msg: err.message, users: [] });
    }
  },

  getInactiveUsers: async (req, res) => {
    try {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const inactiveCandidates = await Users.find({
        isVerified: true,
        createdAt: { $lt: oneMonthAgo }
      }).select('_id username email createdAt');

      const trulyInactive = [];

      for (const user of inactiveCandidates) {
        const hasVideos = await Video.exists({ user: user._id });
        const hasComments = await Comments.exists({ user: user._id });

        if (!hasVideos && !hasComments) {
          trulyInactive.push(user);
        }
      }

      res.json({ inactiveUsers: trulyInactive });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  blockUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason, description, blockExpiryDate } = req.body;
      const adminId = req.user._id;

      if (!reason) {
        return res.status(400).json({ message: 'Le motif du blocage est requis' });
      }

      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      if (!user.blockHistory) {
        user.blockHistory = [];
      }

      user.blockHistory.push({
        reason,
        description,
        blockDate: new Date(),
        blockExpiryDate: blockExpiryDate || null,
        blockedBy: adminId
      });

      user.isBlocked = true;
      user.isActive = false;
      user.blockDetails = {
        reason,
        description,
        blockDate: new Date(),
        blockExpiryDate: blockExpiryDate || null,
        blockedBy: adminId
      };

      await user.save();

      res.json({
        success: true,
        message: 'Utilisateur bloqué avec succès',
        user: {
          _id: user._id,
          isBlocked: user.isBlocked,
          isActive: user.isActive,
          blockDetails: user.blockDetails
        }
      });
    } catch (error) {
      console.error('Error blockUser:', error);
      res.status(500).json({ message: error.message || 'Erreur lors du blocage' });
    }
  },

  unblockUser: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.user._id;

      const user = await Users.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      if (user.blockHistory && user.blockHistory.length > 0) {
        const lastBlock = user.blockHistory[user.blockHistory.length - 1];
        if (!lastBlock.unblockDate) {
          lastBlock.unblockDate = new Date();
          lastBlock.unblockedBy = adminId;
        }
      }

      user.isBlocked = false;
      user.isActive = true;
      user.blockDetails = {
        reason: null,
        description: null,
        blockDate: null,
        blockExpiryDate: null,
        blockedBy: null
      };

      await user.save();

      res.json({
        success: true,
        message: 'Utilisateur débloqué avec succès',
        user: {
          _id: user._id,
          isBlocked: user.isBlocked,
          isActive: user.isActive
        }
      });
    } catch (error) {
      console.error('Error unblockUser:', error);
      res.status(500).json({ message: error.message || 'Erreur lors du déblocage' });
    }
  },

  activateUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findByIdAndUpdate(
        id,
        { isActive: true },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        message: 'Utilisateur activé avec succès',
        user: {
          _id: user._id,
          isActive: user.isActive,
          isBlocked: user.isBlocked
        }
      });
    } catch (error) {
      console.error('Error activateUser:', error);
      res.status(500).json({ message: error.message || 'Erreur lors de l\'activation' });
    }
  },

  deactivateUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await Users.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        success: true,
        message: 'Utilisateur désactivé avec succès',
        user: {
          _id: user._id,
          isActive: user.isActive,
          isBlocked: user.isBlocked
        }
      });
    } catch (error) {
      console.error('Error deactivateUser:', error);
      res.status(500).json({ message: error.message || 'Erreur lors de la désactivation' });
    }
  },

  activatePro: async (req, res) => {
    try {
      const { userId } = req.params;
      const { proExpiryDate } = req.body;

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé. Seul un administrateur peut activer le compte Pro.'
        });
      }

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      user.isPro = true;
      user.proExpiryDate = proExpiryDate || null;
      await user.save();

      res.json({
        success: true,
        message: 'Compte Pro activé avec succès',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isPro: user.isPro,
          proExpiryDate: user.proExpiryDate
        }
      });
    } catch (error) {
      console.error('Error activatePro:', error);
      res.status(500).json({ success: false, message: error.message || 'Erreur lors de l\'activation du compte Pro' });
    }
  },

  deactivatePro: async (req, res) => {
    try {
      const { userId } = req.params;

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Accès non autorisé. Seul un administrateur peut désactiver le compte Pro.'
        });
      }

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      user.isPro = false;
      user.proExpiryDate = null;
      await user.save();

      res.json({
        success: true,
        message: 'Compte Pro désactivé avec succès',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isPro: user.isPro,
          proExpiryDate: user.proExpiryDate
        }
      });
    } catch (error) {
      console.error('Error deactivatePro:', error);
      res.status(500).json({ success: false, message: error.message || 'Erreur lors de la désactivation du compte Pro' });
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;
      
      const user = await Users.findById(userId)
        .select('-password')
        .populate('followers', '_id')
        .populate('following', '_id');
      
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      
      const followers = user.followers || [];
      const following = user.following || [];
      
      let isFollowing = false;
      if (currentUserId && currentUserId.toString() !== userId) {
        isFollowing = Array.isArray(followers) && followers.some(f => f && f._id && f._id.toString() === currentUserId.toString());
      }
      
      const videoStats = await Video.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false, isActive: true } },
        {
          $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            totalLikes: { $sum: { $size: '$likes' } },
            totalViews: { $sum: '$views' },
            totalComments: { $sum: { $size: '$comments' } },
            totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } }
          }
        }
      ]);
      
      res.json({
        success: true,
        profile: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio || '',
          fullname: user.fullname || user.username,
          isPro: user.isPro || false,
          role: user.role,
          followersCount: followers.length || 0,
          followingCount: following.length || 0,
          profileViewsCount: user.profileViewsCount || 0,
          isFollowing,
          videoStats: videoStats[0] || {
            totalVideos: 0,
            totalLikes: 0,
            totalViews: 0,
            totalComments: 0,
            totalShares: 0
          }
        }
      });
    } catch (err) {
      console.error('Error getUserProfile:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getFollowers: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await Users.findById(userId)
        .populate('followers', 'username avatar fullname bio isPro role');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const followersList = user.followers || [];
      const currentUserId = req.user._id;
      let currentUserFollowing = [];
      
      if (currentUserId) {
        const currentUser = await Users.findById(currentUserId).select('following');
        currentUserFollowing = (currentUser.following || []).map(id => id.toString());
      }

      const followersWithStatus = followersList.map(follower => {
        const followerObj = follower.toObject ? follower.toObject() : follower;
        followerObj.isFollowing = currentUserFollowing.includes(followerObj._id.toString());
        return followerObj;
      });

      res.json({
        success: true,
        users: followersWithStatus,
        count: followersWithStatus.length
      });
    } catch (err) {
      console.error('Error getFollowers:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await Users.findById(userId)
        .populate('following', 'username avatar fullname bio isPro role');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const followingList = user.following || [];
      const currentUserId = req.user._id;
      let currentUserFollowing = [];
      
      if (currentUserId) {
        const currentUser = await Users.findById(currentUserId).select('following');
        currentUserFollowing = (currentUser.following || []).map(id => id.toString());
      }

      const followingWithStatus = followingList.map(follow => {
        const followObj = follow.toObject ? follow.toObject() : follow;
        followObj.isFollowing = currentUserFollowing.includes(followObj._id.toString());
        return followObj;
      });

      res.json({
        success: true,
        users: followingWithStatus,
        count: followingWithStatus.length
      });
    } catch (err) {
      console.error('Error getFollowing:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getProfileViews: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;
      const currentUserRole = req.user.role;

      if (currentUserId.toString() !== userId && currentUserRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No autorizado para ver las vistas del perfil'
        });
      }

      const user = await Users.findById(userId)
        .populate('profileViews.user', 'username avatar fullname bio isPro role');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const profileViewsList = user.profileViews || [];

      const views = profileViewsList
        .filter(view => view && view.user)
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
        .map(view => ({
          ...view.user.toObject(),
          viewedAt: view.viewedAt
        }));

      res.json({
        success: true,
        views,
        count: views.length
      });
    } catch (err) {
      console.error('Error getProfileViews:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  registerProfileView: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;

      if (currentUserId.toString() === userId) {
        return res.status(200).json({ success: true, message: 'No se registra vista propia' });
      }

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      const existingView = user.profileViews.find(
        view => view.user.toString() === currentUserId.toString() && 
                new Date(view.viewedAt) > oneDayAgo
      );

      if (!existingView) {
        user.profileViews = user.profileViews || [];
        user.profileViews.push({
          user: currentUserId,
          viewedAt: new Date()
        });
        
        user.profileViewsCount = (user.profileViewsCount || 0) + 1;
        
        if (user.profileViews.length > 100) {
          user.profileViews = user.profileViews.slice(-100);
        }
        
        await user.save();
        console.log(`✅ Vista registrada: ${currentUserId} vio el perfil de ${userId}`);
      }

      res.json({ success: true, count: user.profileViewsCount });
    } catch (err) {
      console.error('❌ Error registerProfileView:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getProfileStats: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;

      const user = await Users.findById(userId)
        .select('profileViewsCount followers following');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const weeklyViews = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const count = (user.profileViews || []).filter(view => 
          new Date(view.viewedAt) >= day && new Date(view.viewedAt) < nextDay
        ).length || 0;
        
        weeklyViews.push({
          date: day.toLocaleDateString('fr-FR', { weekday: 'short' }),
          count
        });
      }

      res.json({
        success: true,
        stats: {
          totalViews: user.profileViewsCount || 0,
          weeklyViews,
          followersCount: user.followers.length || 0,
          followingCount: user.following.length || 0
        }
      });
    } catch (err) {
      console.error('❌ Error getProfileStats:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  saveVideo: async (req, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user._id;

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const isSaved = user.savedVideos && user.savedVideos.includes(videoId);

      if (isSaved) {
        await Users.findByIdAndUpdate(userId, {
          $pull: { savedVideos: videoId }
        });
        return res.json({ success: true, saved: false, message: 'Video eliminado de guardados' });
      } else {
        await Users.findByIdAndUpdate(userId, {
          $push: { savedVideos: videoId }
        });
        return res.json({ success: true, saved: true, message: 'Video guardado correctamente' });
      }
    } catch (err) {
      console.error('❌ Error saveVideo:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getSavedVideos: async (req, res) => {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 12 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const user = await Users.findById(userId).populate({
        path: 'savedVideos',
        populate: {
          path: 'user',
          select: 'username avatar fullname'
        },
        options: {
          skip: skip,
          limit: parseInt(limit),
          sort: { createdAt: -1 }
        }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const total = await Users.findById(userId).select('savedVideos');
      const totalSaved = total.savedVideos.length || 0;

      res.json({
        success: true,
        videos: user.savedVideos || [],
        total: totalSaved,
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: skip + (user.savedVideos.length || 0) < totalSaved
      });
    } catch (err) {
      console.error('❌ Error getSavedVideos:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  checkSavedVideo: async (req, res) => {
    try {
      const { videoId } = req.params;
      const userId = req.user._id;

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const isSaved = user.savedVideos && user.savedVideos.includes(videoId);
      res.json({ success: true, saved: isSaved });
    } catch (err) {
      console.error('❌ Error checkSavedVideo:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = userCtrl;