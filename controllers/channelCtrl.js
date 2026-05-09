const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// ============================================
// 🆕 CREAR CANAL (solo para usuarios que no tengan canal o para crear adicional)
// ============================================
const createChannel = async (req, res) => {
  try {
    const { name, activity, description, avatar, cover, phone, email, website, wilaya, commune } = req.body;
    const userId = req.user._id;

    // Verificar si el usuario ya tiene un canal con el mismo nombre
    const existingChannel = await Channel.findOne({ owner: userId, name });
    if (existingChannel) {
      return res.status(400).json({ success: false, message: 'Ya tienes un canal con ese nombre' });
    }

    const channel = new Channel({
      name,
      activity,
      description: description || '',
      avatar: avatar || req.user.avatar,
      cover: cover || '',
      phone: phone || '',
      email: email || '',
      website: website || '',
      wilaya: wilaya || '',
      commune: commune || '',
      owner: userId,
      followers: [],
      followersCount: 0
    });

    await channel.save();

    // Opcional: agregar el canal a la lista de canales del usuario (si tienes un array en User)
    await User.findByIdAndUpdate(userId, { $push: { channels: channel._id } });

    res.status(201).json({ success: true, channel });
  } catch (error) {
    console.error('❌ Error createChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📋 OBTENER CANAL POR ID
// ============================================
const getChannelById = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId)
      .populate('owner', 'username avatar fullname')
      .lean();

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    // Obtener videos recientes
    const videos = await Video.find({ channel: channelId, pendiente: false, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('category', 'name slug')
      .lean();

    // Estadísticas (con protección para cuando no hay videos)
    const stats = await Video.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(channelId), pendiente: false, isActive: true } },
      { $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } }
      }}
    ]);

    const statsData = stats.length > 0 ? stats[0] : { totalVideos: 0, totalViews: 0, totalLikes: 0 };

    res.json({
      success: true,
      channel: {
        ...channel,
        totalVideos: statsData.totalVideos,
        totalViews: statsData.totalViews,
        totalLikes: statsData.totalLikes,
        recentVideos: videos
      }
    });
  } catch (error) {
    console.error('❌ Error getChannelById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getChannelProfile = async (req, res) => {
  try {
    const { channelId } = req.params;
    const currentUserId = req.user ? req.user._id : null;

    const channel = await Channel.findById(channelId)
      .populate('owner', 'username avatar fullname')
      .lean();

    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    // Verificar si el usuario actual sigue este canal
    let isFollowing = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select('followingChannels');
      if (currentUser && currentUser.followingChannels) {
        isFollowing = currentUser.followingChannels.some(id => id.toString() === channelId);
      }
    }

    // Estadísticas de videos del canal
    const stats = await Video.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(channelId), pendiente: false, isActive: true } },
      { $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalLikes: { $sum: { $size: '$likes' } },
        totalViews: { $sum: '$views' },
        totalComments: { $sum: { $size: '$comments' } }
      }}
    ]);

    const profileData = {
      _id: channel._id,
      name: channel.name,
      description: channel.description,
      avatar: channel.avatar,
      cover: channel.cover,
      wilaya: channel.wilaya,
      commune: channel.commune,
      isVerified: channel.isVerified,
      followersCount: channel.followersCount || 0,
      totalVideos: stats[0].totalVideos || 0,
      totalViews: stats[0].totalViews || 0,
      totalLikes: stats[0].totalLikes || 0,
      owner: {
        _id: channel.owner._id,
        username: channel.owner.username,
        avatar: channel.owner.avatar,
        fullname: channel.owner.fullname
      },
      isFollowing
    };

    // Si el usuario actual es el dueño, incluir datos privados
    if (currentUserId && channel.owner._id.toString() === currentUserId.toString()) {
      profileData.email = channel.email;
      profileData.phone = channel.phoneHidden ? null : channel.phone;
      profileData.website = channel.website;
      profileData.delivery = channel.delivery;
      profileData.businessHours = channel.businessHours;
    }

    res.json({ success: true, profile: profileData });
  } catch (err) {
    console.error('❌ Error getChannelProfile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ============================================
// ✏️ ACTUALIZAR CANAL (solo dueño o admin)
// ============================================
const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const updates = req.body;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Campos permitidos a actualizar
    const allowedFields = ['name', 'activity', 'description', 'avatar', 'cover', 'phone', 'phoneHidden', 'email', 'website', 'wilaya', 'commune', 'location', 'delivery', 'businessHours', 'settings'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        channel[field] = updates[field];
      }
    });

    // Actualizar followersCount si se modificaron followers
    if (updates.followers) {
      channel.followersCount = updates.followers.length;
    }

    await channel.save();
    res.json({ success: true, channel });
  } catch (error) {
    console.error('❌ Error updateChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👥 SEGUIR / DEJAR DE SEGUIR UN CANAL
// ============================================
const toggleFollowChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isFollowing = channel.followers.includes(userId);
    if (isFollowing) {
      await Channel.findByIdAndUpdate(channelId, { $pull: { followers: userId } });
    } else {
      await Channel.findByIdAndUpdate(channelId, { $addToSet: { followers: userId } });
    }

    // Actualizar el array followingChannels en el usuario
    if (isFollowing) {
      await User.findByIdAndUpdate(userId, { $pull: { followingChannels: channelId } });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { followingChannels: channelId } });
    }

    const updatedChannel = await Channel.findById(channelId);
    res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: updatedChannel.followersCount
    });
  } catch (error) {
    console.error('❌ Error toggleFollowChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📺 OBTENER VIDEOS DE UN CANAL (paginated)
// ============================================
const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find({ channel: channelId, pendiente: false, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name slug')
      .lean();

    const total = await Video.countDocuments({ channel: channelId, pendiente: false, isActive: true });

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total
    });
  } catch (error) {
    console.error('❌ Error getChannelVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🔍 LISTAR CANALES DEL USUARIO ACTUAL
// ============================================
const getMyChannels = async (req, res) => {
  try {
    const userId = req.user._id;
    const channels = await Channel.find({ owner: userId })
      .populate('owner', 'username avatar')
      .lean();

    res.json({ success: true, channels });
  } catch (error) {
    console.error('❌ Error getMyChannels:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📊 OBTENER ESTADÍSTICAS DEL CANAL (para el dueño)
// ============================================
const getChannelStats = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Estadísticas de videos del canal
    const videoStats = await Video.aggregate([
      { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
      { $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } },
        totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } },
        commercialVideos: { $sum: { $cond: ['$isCommercial', 1, 0] } }
      }}
    ]);

    // Estadísticas de seguidores (crecimiento últimas semanas)
    // (Necesitarías almacenar historial de followers, por ahora solo contamos)
    const followersGrowth = {
      current: channel.followersCount,
      // Podrías calcular basado en createdAt de followers si tuvieras fechas
    };

    res.json({
      success: true,
      stats: {
        ...videoStats[0],
        followersCount: channel.followersCount,
        followersGrowth
      }
    });
  } catch (error) {
    console.error('❌ Error getChannelStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ============================================
// 🌐 PERFIL PÚBLICO DEL CANAL (para visualización pública)
// ============================================
 
// ============================================
// 🗑️ ELIMINAR CANAL (solo owner o admin, con todos sus videos)
// ============================================
const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Eliminar todos los videos del canal
    await Video.deleteMany({ channel: channelId });

    // Remover el canal de followingChannels de todos los usuarios que lo seguían
    await User.updateMany(
      { followingChannels: channelId },
      { $pull: { followingChannels: channelId } }
    );

    await channel.deleteOne();

    res.json({ success: true, message: 'Canal y todos sus videos eliminados' });
  } catch (error) {
    console.error('❌ Error deleteChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createChannel,
  getChannelById,
  getChannelProfile,   // ← agregar si no estaba
  updateChannel,
  toggleFollowChannel,
  getChannelVideos,
  getMyChannels,
  getChannelStats,
  deleteChannel
};