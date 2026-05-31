// backend/controllers/channelCtrl.js
const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary (usar variables de entorno en producción)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'dzd58nm3l',
    api_key: process.env.CLOUDINARY_API_KEY || '213848222123818',
    api_secret: process.env.CLOUDINARY_API_SECRET || '1ug0ft6Q81wSnfgKpmqKy3bAMNc'
});
// ==================== CREAR CANAL (COVER Y AVATAR CON MISMA LÓGICA) ====================
// backend/controllers/channelCtrl.js

const createChannel = async (req, res) => {
    try {
        const { 
            name, 
            activity, 
            description, 
            avatar,    // Puede ser Array o String
            cover,     // Puede ser Array o String
            phone, 
            email, 
            website, 
            wilaya, 
            commune 
        } = req.body;

        // Validación de campos requeridos
        if(!name || !activity || !wilaya || !commune) {
            return res.status(400).json({msg: "Champs requis manquants"});
        }

        // Verificar si el usuario ya tiene un canal con este nombre
        const existingChannel = await Channel.findOne({ owner: req.user._id, name });
        if (existingChannel) {
            return res.status(400).json({msg: "Vous avez déjà un canal avec ce nom"});
        }

        // Crear slug único
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        let finalSlug = slug;
        let counter = 1;
        while (await Channel.findOne({ slug: finalSlug })) {
            finalSlug = `${slug}-${counter++}`;
        }

        // ============================================
        // ✅ NORMALIZAR AVATAR - SIEMPRE como ARRAY
        // ============================================
        let normalizedAvatar = [];
        
        if (avatar) {
            if (Array.isArray(avatar)) {
                // Si es array, procesar cada elemento
                normalizedAvatar = avatar.map(item => {
                    if (typeof item === 'string') {
                        return { url: item, public_id: `avatar_${Date.now()}_${Math.random()}` };
                    } else if (item && item.url) {
                        return { 
                            url: item.url, 
                            public_id: item.public_id || `avatar_${Date.now()}_${Math.random()}`
                        };
                    }
                    return item;
                });
            } else if (typeof avatar === 'string') {
                // Si es string, convertir a array
                normalizedAvatar = [{
                    url: avatar,
                    public_id: `avatar_${Date.now()}_${Math.random()}`
                }];
            } else if (avatar && avatar.url) {
                // Si es objeto con url
                normalizedAvatar = [{
                    url: avatar.url,
                    public_id: avatar.public_id || `avatar_${Date.now()}_${Math.random()}`
                }];
            }
        }

        // ============================================
        // ✅ NORMALIZAR COVER - SIEMPRE como ARRAY
        // ============================================
        let normalizedCover = [];
        
        if (cover) {
            if (Array.isArray(cover)) {
                // Si es array, procesar cada elemento
                normalizedCover = cover.map(item => {
                    if (typeof item === 'string') {
                        return { url: item, public_id: `cover_${Date.now()}_${Math.random()}` };
                    } else if (item && item.url) {
                        return { 
                            url: item.url, 
                            public_id: item.public_id || `cover_${Date.now()}_${Math.random()}`
                        };
                    }
                    return item;
                });
            } else if (typeof cover === 'string') {
                // Si es string, convertir a array
                normalizedCover = [{
                    url: cover,
                    public_id: `cover_${Date.now()}_${Math.random()}`
                }];
            } else if (cover && cover.url) {
                // Si es objeto con url
                normalizedCover = [{
                    url: cover.url,
                    public_id: cover.public_id || `cover_${Date.now()}_${Math.random()}`
                }];
            }
        }

        // LOG para depuración
        console.log('📸 Creando canal:');
        console.log('  - Nombre:', name);
        console.log('  - Actividad:', activity);
        console.log('  - Avatar normalizado:', JSON.stringify(normalizedAvatar, null, 2));
        console.log('  - Cover normalizado:', JSON.stringify(normalizedCover, null, 2));

        // ============================================
        // ✅ CREAR CANAL CON LOS DATOS NORMALIZADOS
        // ============================================
        const newChannel = new Channel({
            name,
            slug: finalSlug,
            activity,
            description: description || '',
            avatar: normalizedAvatar,   // ✅ SIEMPRE ARRAY
            cover: normalizedCover,     // ✅ SIEMPRE ARRAY
            phone: phone || '',
            email: email || '',
            website: website || '',
            wilaya,
            commune,
            owner: req.user._id,
            pending: true,  // Por defecto pendiente de aprobación
            isActive: true,
            followers: [],
            followersCount: 0,
            totalVideos: 0,
            totalViews: 0,
            totalLikes: 0
        });

        await newChannel.save();

        // Poblar el owner para la respuesta
        const populatedChannel = await Channel.findById(newChannel._id)
            .populate('owner', 'username avatar fullname')
            .lean();

        // ============================================
        // ✅ FORMATEAR RESPUESTA (Mantener como arrays)
        // ============================================
        const formattedChannel = {
            ...populatedChannel,
            _id: populatedChannel._id.toString(),
            avatar: populatedChannel.avatar || [],
            cover: populatedChannel.cover || [],
            owner: {
                ...populatedChannel.owner,
                _id: populatedChannel.owner._id.toString()
            }
        };

        console.log('✅ Canal creado exitosamente:');
        console.log('  - ID:', formattedChannel._id);
        console.log('  - Nombre:', formattedChannel.name);
        console.log('  - Cover:', formattedChannel.cover);
        console.log('  - Avatar:', formattedChannel.avatar);

        res.json({
            success: true,
            msg: 'Canal créé avec succès!',
            channel: formattedChannel
        });

    } catch (err) {
        console.error('❌ Error createChannel:', err);
        return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
};
// backend/controllers/channelCtrl.js

// backend/controllers/channelCtrl.js

const updateChannel = async (req, res) => {
    try {
        // ✅ IMPORTANTE: Usar el mismo nombre que en la ruta
        const channelId = req.params.channelId || req.params.id;
        
        console.log('🔍 Actualizando canal con ID:', channelId);
        
        const { 
            name, 
            activity, 
            description, 
            avatar,
            cover,
            phone, 
            email, 
            website, 
            wilaya, 
            commune 
        } = req.body;

        // Buscar el canal existente
        const existingChannel = await Channel.findById(channelId);
        
        if (!existingChannel) {
            console.log('❌ Canal no encontrado:', channelId);
            return res.status(404).json({
                success: false,
                msg: "Canal no encontrado"
            });
        }

        console.log('📺 Canal encontrado:', existingChannel.name);

        // Verificar que el usuario es el dueño o admin
        const isOwner = existingChannel.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                msg: "No autorizado"
            });
        }

        // ============================================
        // ✅ NORMALIZAR AVATAR
        // ============================================
        let normalizedAvatar = existingChannel.avatar || [];
        
        if (avatar !== undefined) {
            if (Array.isArray(avatar)) {
                normalizedAvatar = avatar.map(item => {
                    if (typeof item === 'string') {
                        return { 
                            url: item, 
                            public_id: `avatar_${Date.now()}_${Math.random()}` 
                        };
                    } else if (item && item.url) {
                        return { 
                            url: item.url, 
                            public_id: item.public_id || `avatar_${Date.now()}_${Math.random()}`
                        };
                    }
                    return item;
                });
            } else if (typeof avatar === 'string' && avatar) {
                normalizedAvatar = [{
                    url: avatar,
                    public_id: `avatar_${Date.now()}_${Math.random()}`
                }];
            } else if (avatar === null || avatar === '') {
                normalizedAvatar = [];
            }
        }

        // ============================================
        // ✅ NORMALIZAR COVER
        // ============================================
        let normalizedCover = existingChannel.cover || [];
        
        if (cover !== undefined) {
            if (Array.isArray(cover)) {
                normalizedCover = cover.map(item => {
                    if (typeof item === 'string') {
                        return { 
                            url: item, 
                            public_id: `cover_${Date.now()}_${Math.random()}` 
                        };
                    } else if (item && item.url) {
                        return { 
                            url: item.url, 
                            public_id: item.public_id || `cover_${Date.now()}_${Math.random()}`
                        };
                    }
                    return item;
                });
            } else if (typeof cover === 'string' && cover) {
                normalizedCover = [{
                    url: cover,
                    public_id: `cover_${Date.now()}_${Math.random()}`
                }];
            } else if (cover === null || cover === '') {
                normalizedCover = [];
            }
        }

        // ============================================
        // ✅ ACTUALIZAR CANAL
        // ============================================
        const updatedChannel = await Channel.findByIdAndUpdate(
            channelId,
            { 
                name: name || existingChannel.name,
                activity: activity || existingChannel.activity,
                description: description !== undefined ? description : existingChannel.description,
                avatar: normalizedAvatar,
                cover: normalizedCover,
                phone: phone !== undefined ? phone : existingChannel.phone,
                email: email !== undefined ? email : existingChannel.email,
                website: website !== undefined ? website : existingChannel.website,
                wilaya: wilaya || existingChannel.wilaya,
                commune: commune || existingChannel.commune
            },
            { new: true }
        ).populate('owner', 'username avatar fullname')
         .lean();

        if (!updatedChannel) {
            return res.status(404).json({
                success: false,
                msg: "Canal no encontrado después de actualizar"
            });
        }

        // ============================================
        // ✅ FORMATEAR RESPUESTA
        // ============================================
        const formattedChannel = {
            ...updatedChannel,
            _id: updatedChannel._id.toString(),
            avatar: updatedChannel.avatar || [],
            cover: updatedChannel.cover || [],
            owner: {
                ...updatedChannel.owner,
                _id: updatedChannel.owner._id.toString()
            }
        };

        console.log('✅ Canal actualizado:', formattedChannel.name);

        res.json({
            success: true,
            msg: "Canal actualizado con éxito!",
            channel: formattedChannel
        });

    } catch (err) {
        console.error('❌ Error updateChannel:', err);
        return res.status(500).json({
            success: false,
            msg: err.message
        });
    }
};

 // backend/controllers/channelCtrl.js

const getChannelById = async (req, res) => {
    try {
        const { channelId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        const channel = await Channel.findById(channelId)
            .populate('owner', 'username avatar fullname')
            .lean();

        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        // ✅ Devolver como arrays (sin extraer URLs)
        res.json({ 
            success: true, 
            channel: {
                ...channel,
                _id: channel._id.toString(),
                avatar: channel.avatar || [],
                cover: channel.cover || []
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
        const isAdmin = req.user ? req.user.role === 'admin' : false;

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        const channel = await Channel.findById(channelId)
            .populate('owner', 'username avatar fullname')
            .lean();

        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        const isOwner = currentUserId && channel.owner._id.toString() === currentUserId.toString();

        // ✅ Verificar estado del canal
        if (channel.pending && !isOwner && !isAdmin) {
            return res.status(404).json({ success: false, message: 'Canal pendiente de aprobación' });
        }

        if (!channel.isActive && !isOwner && !isAdmin) {
            return res.status(404).json({ success: false, message: 'Canal no disponible' });
        }

        // ✅ Verificar follow
        let isFollowing = false;
        if (currentUserId && !isOwner) {
            const currentUser = await User.findById(currentUserId).select('followingChannels');
            if (currentUser && currentUser.followingChannels) {
                isFollowing = currentUser.followingChannels.some(id => id.toString() === channelId);
            }
        }

        // ✅ Obtener estadísticas
        const stats = await Video.aggregate([
            { $match: { channel: new mongoose.Types.ObjectId(channelId), pendiente: false, isActive: true } },
            { $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalLikes: { $sum: { $size: '$likes' } },
                totalViews: { $sum: '$views' }
            }}
        ]);

        const statsData = stats.length > 0 ? stats[0] : { totalVideos: 0, totalLikes: 0, totalViews: 0 };

        // ✅ Construir respuesta (manteniendo arrays)
        const profileData = {
            _id: channel._id.toString(),
            name: channel.name,
            slug: channel.slug,
            description: channel.description || '',
            avatar: channel.avatar || [],  // ✅ ARRAY
            cover: channel.cover || [],    // ✅ ARRAY
            wilaya: channel.wilaya || '',
            commune: channel.commune || '',
            activity: channel.activity || '',
            isVerified: channel.isVerified || false,
            followersCount: channel.followersCount || 0,
            totalVideos: statsData.totalVideos,
            totalViews: statsData.totalViews,
            totalLikes: statsData.totalLikes,
            owner: channel.owner,
            isFollowing: isFollowing || false,
            pending: channel.pending || false,
            isActive: channel.isActive !== false,
            email: channel.email || '',
            phone: channel.phone || '',
            website: channel.website || '',
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
        };

        console.log('✅ Perfil enviado:', {
            id: profileData._id,
            nombre: profileData.name,
            coverType: Array.isArray(profileData.cover) ? 'array' : typeof profileData.cover,
            coverLength: profileData.cover.length
        });

        res.json({ success: true, profile: profileData });
        
    } catch (err) {
        console.error('❌ Error getChannelProfile:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
// ==================== OBTENER MIS CANALES ====================
// ==================== OBTENER MIS CANALES ====================
const getMyChannels = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const channels = await Channel.find({ owner: userId })
            .populate('owner', 'username avatar fullname')
            .lean();
        
        // ✅ Extraer URLs como strings
        const formattedChannels = channels.map(channel => {
            let avatarUrl = '';
            let coverUrl = '';

            if (channel.avatar) {
                if (Array.isArray(channel.avatar) && channel.avatar.length > 0) {
                    avatarUrl = channel.avatar[0].url || '';
                } else if (typeof channel.avatar === 'string') {
                    avatarUrl = channel.avatar;
                } else if (channel.avatar.url) {
                    avatarUrl = channel.avatar.url;
                }
            }

            if (channel.cover) {
                if (Array.isArray(channel.cover) && channel.cover.length > 0) {
                    coverUrl = channel.cover[0].url || '';
                } else if (typeof channel.cover === 'string') {
                    coverUrl = channel.cover;
                } else if (channel.cover.url) {
                    coverUrl = channel.cover.url;
                }
            }

            return {
                ...channel,
                avatar: avatarUrl,   // ✅ String
                cover: coverUrl      // ✅ String
            };
        });
        
        res.json({ 
            success: true, 
            channels: formattedChannels 
        });
        
    } catch (error) {
        console.error('❌ Error getMyChannels:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            channels: [] 
        });
    }
};
// ==================== OBTENER PERFIL (con la primera imagen) ====================
// ==================== OBTENER PERFIL DEL CANAL (CORREGIDO) ====================
 
const getChannelVideos = async (req, res) => {
    try {
        const { channelId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const currentUserId = req.user ? req.user._id : null;
        const isAdmin = req.user ? req.user.role === 'admin' : false;

        const channel = await Channel.findById(channelId).lean();
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        const isOwner = currentUserId && channel.owner.toString() === currentUserId.toString();

        let videoQuery = { channel: channelId, isActive: true };
        
        if (!isOwner && !isAdmin) {
            videoQuery.pendiente = false;
        }

        const videos = await Video.find(videoQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('channel', '_id name avatar slug')
            .populate('category', 'name slug')
            .lean();

        const total = await Video.countDocuments(videoQuery);
        const hasMore = skip + videos.length < total;

        const videosWithInfo = videos.map(video => ({
            ...video,
            isOwner: isOwner,
            status: video.pendiente ? '⏳ En attente' : '✅ Publié'
        }));

        res.json({
            success: true,
            videos: videosWithInfo,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore,
            isOwner,
            channelName: channel.name
        });

    } catch (error) {
        console.error('❌ Error getChannelVideos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== SEGUIR CANAL ====================
const toggleFollowChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID de canal inválido' });
        }

        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        const isFollowing = channel.followers.includes(userId);
        
        if (isFollowing) {
            await Channel.findByIdAndUpdate(channelId, { $pull: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { followingChannels: channelId } });
        } else {
            await Channel.findByIdAndUpdate(channelId, { $addToSet: { followers: userId } });
            await User.findByIdAndUpdate(userId, { $addToSet: { followingChannels: channelId } });
        }

        const updatedChannel = await Channel.findById(channelId);
        
        res.json({
            success: true,
            isFollowing: !isFollowing,
            followersCount: updatedChannel.followersCount,
            channelOwner: channel.owner,
            channelName: channel.name
        });
    } catch (error) {
        console.error('❌ Error toggleFollowChannel:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const approveChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const adminId = req.user._id;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé. Réservé aux administrateurs.' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }
    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }
    
    // ✅ Aprobar canal
    channel.pending = false;
    channel.isActive = true;
    channel.approvedBy = adminId;
    channel.approvedAt = new Date();
    channel.rejectionReason = '';
    
    await channel.save();
    
    console.log('✅ Canal aprobado:', channel.name, 'por admin:', adminId);
    
    // ✅ Notificar al dueño del canal (opcional - con socket)
    // if (req.io) {
    //   req.io.to(channel.owner.toString()).emit('channel_approved', {
    //     channelId: channel._id,
    //     channelName: channel.name
    //   });
    // }
    
    res.json({ 
      success: true, 
      message: 'Canal approuvé avec succès',
      channel: {
        _id: channel._id,
        name: channel.name,
        pending: channel.pending,
        isActive: channel.isActive
      }
    });
    
  } catch (error) {
    console.error('❌ Error approveChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ❌ RECHAZAR CANAL (solo ADMIN)
// ============================================
const rejectChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { reason } = req.body;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé. Réservé aux administrateurs.' 
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }
    
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }
    
    // ✅ Rechazar canal
    channel.pending = false;
    channel.isActive = false;
    channel.rejectionReason = reason || 'Canal non conforme aux conditions d\'utilisation';
    
    await channel.save();
    
    console.log('❌ Canal rechazado:', channel.name);
    
    res.json({ 
      success: true, 
      message: 'Canal rejeté',
      channel: {
        _id: channel._id,
        name: channel.name,
        pending: channel.pending,
        isActive: channel.isActive,
        rejectionReason: channel.rejectionReason
      }
    });
    
  } catch (error) {
    console.error('❌ Error rejectChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📋 OBTENER CANALES PENDIENTES (solo ADMIN)
// ============================================
const getPendingChannels = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé. Réservé aux administrateurs.' 
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const channels = await Channel.find({ pending: true })
      .populate('owner', 'username email avatar fullname')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Channel.countDocuments({ pending: true });
    
    res.json({
      success: true,
      channels,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    console.error('❌ Error getPendingChannels:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exportar todas las funciones
module.exports = {
    createChannel,
    updateChannel,
    getChannelProfile,
    getChannelById,
    getMyChannels,
    getChannelVideos,
    toggleFollowChannel,
    
    approveChannel ,
    rejectChannel,
    getPendingChannels 
};