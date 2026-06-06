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

// ==================== OBTENER MIS CANALES (CORREGIDO) ====================
const getMyChannels = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        
        // ✅ IMPORTANTE: El dueño debe ver TODOS sus canales (activos, pendientes, etc.)
        // Solo filtramos isActive=false para canales ELIMINADOS (soft delete)
        let query = { owner: userId };
        
        // Si NO es admin, mostramos todos sus canales excepto los eliminados
        // Si es admin, mostramos todos los canales que posee
        if (userRole !== 'admin') {
            // El dueño ve canales activos (pending puede ser true o false)
            // Solo ocultamos canales marcados como isActive=false (eliminados)
            query.isActive = { $ne: false };
        }
        
        const channels = await Channel.find(query)
            .populate('owner', 'username avatar fullname')
            .sort({ createdAt: -1 })
            .lean();
        
        // Formatear canales para el frontend
        const formattedChannels = channels.map(channel => ({
            ...channel,
            _id: channel._id.toString(),
            // Extraer URL del avatar si es array
            avatar: channel.avatar && channel.avatar.length > 0 ? channel.avatar[0].url : (channel.avatar || ''),
            cover: channel.cover && channel.cover.length > 0 ? channel.cover[0].url : (channel.cover || ''),
            // Asegurar que pending existe
            pending: channel.pending === true,
            isActive: channel.isActive !== false,
            // Datos del owner
            owner: channel.owner ? {
                _id: channel.owner._id.toString(),
                username: channel.owner.username,
                avatar: channel.owner.avatar,
                fullname: channel.owner.fullname
            } : null
        }));
        
        console.log(`📋 Usuario ${userId} (${userRole}) tiene ${formattedChannels.length} canales`);
        console.log(`   - Pendientes: ${formattedChannels.filter(c => c.pending).length}`);
        console.log(`   - Aprobados: ${formattedChannels.filter(c => !c.pending).length}`);
        
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

// Backend: Permitir al dueño ver/editar su canal pendiente
// Solo restringir a otros usuarios

const getChannelById = async (req, res) => {
    const isOwner = channel.owner.toString() === userId;
    const isAdmin = userRole === 'admin';
    
    // ✅ El dueño SIEMPRE puede ver su canal (pendiente o no)
    if (isOwner || isAdmin) {
      return res.json({ success: true, channel });
    }
    
    // ❌ Otros usuarios solo ven canales aprobados
    if (channel.pending) {
      return res.status(404).json({ 
        message: 'Canal en revisión, pronto estará disponible' 
      });
    }
    
    return res.json({ success: true, channel });
  };

// ==================== ACTUALIZAR CANAL (CORREGIDO) ====================
const updateChannel = async (req, res) => {
    try {
        const channelId = req.params.channelId || req.params.id;
        
        console.log('🔍 Actualizando canal ID:', channelId);
        
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
        console.log('   - Pending:', existingChannel.pending);
        console.log('   - Owner:', existingChannel.owner.toString());
        console.log('   - User:', req.user._id.toString());

        // Verificar que el usuario es el dueño o admin
        const isOwner = existingChannel.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        // ✅ IMPORTANTE: El dueño puede actualizar incluso si está pendiente
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                msg: "No autorizado para modificar este canal"
            });
        }

        console.log(`✅ Permiso concedido: ${isOwner ? 'Dueño' : 'Admin'}`);

        // Normalizar avatar
        let normalizedAvatar = existingChannel.avatar || [];
        if (avatar !== undefined) {
            if (Array.isArray(avatar)) {
                normalizedAvatar = avatar;
            } else if (typeof avatar === 'string' && avatar) {
                normalizedAvatar = [{ url: avatar, public_id: `avatar_${Date.now()}` }];
            } else if (avatar === null || avatar === '') {
                normalizedAvatar = [];
            }
        }

        // Normalizar cover
        let normalizedCover = existingChannel.cover || [];
        if (cover !== undefined) {
            if (Array.isArray(cover)) {
                normalizedCover = cover;
            } else if (typeof cover === 'string' && cover) {
                normalizedCover = [{ url: cover, public_id: `cover_${Date.now()}` }];
            } else if (cover === null || cover === '') {
                normalizedCover = [];
            }
        }

        // Actualizar canal
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
                // ⚠️ NO actualizamos 'pending' aquí - eso solo lo hace el admin
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

        // Formatear respuesta
        const formattedChannel = {
            ...updatedChannel,
            _id: updatedChannel._id.toString(),
            avatar: updatedChannel.avatar && updatedChannel.avatar.length > 0 ? updatedChannel.avatar[0].url : (updatedChannel.avatar || ''),
            cover: updatedChannel.cover && updatedChannel.cover.length > 0 ? updatedChannel.cover[0].url : (updatedChannel.cover || ''),
            pending: updatedChannel.pending === true,
            isActive: updatedChannel.isActive !== false,
            owner: updatedChannel.owner ? {
                ...updatedChannel.owner,
                _id: updatedChannel.owner._id.toString()
            } : null
        };

        console.log('✅ Canal actualizado:', formattedChannel.name);
        console.log('   - Pending se mantiene:', formattedChannel.pending);

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

// backend/controllers/channelCtrl.js

const getChannelProfile = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        // ✅ Intentar obtener usuario del token (si existe)
        let currentUserId = null;
        let userRole = null;
        
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                currentUserId = decoded.id;
                
                const user = await User.findById(currentUserId).select('role username');
                if (user) {
                    userRole = user.role;
                }
                console.log('✅ Usuario autenticado:', currentUserId, 'Role:', userRole);
            } catch (err) {
                console.log('⚠️ Token inválido, continuando como usuario anónimo');
            }
        } else {
            console.log('👤 Sin token, usuario anónimo');
        }

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        const channel = await Channel.findById(channelId)
            .populate('owner', 'username avatar fullname _id email')
            .lean();

        if (!channel) {
            console.log('❌ Canal no encontrado:', channelId);
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        // ✅ Verificar si es dueño o admin
        const isOwner = currentUserId && channel.owner._id.toString() === currentUserId.toString();
        const isAdmin = userRole === 'admin';

        console.log('📺 Canal encontrado:', {
            id: channel._id,
            name: channel.name,
            pending: channel.pending,
            isActive: channel.isActive,
            status: channel.status,
            isOwner: isOwner,
            isAdmin: isAdmin
        });

        // ============================================
        // ✅ REGLA 1: ADMIN SIEMPRE PUEDE VER CUALQUIER CANAL
        // ============================================
        if (isAdmin) {
            console.log(`👑 Admin viendo canal: ${channel.name} (status: ${channel.status || (channel.pending ? 'pending' : 'approved')})`);
            
            // Obtener estadísticas
            const stats = await Video.aggregate([
                { $match: { channel: new mongoose.Types.ObjectId(channelId), isActive: true } },
                { $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalViews: { $sum: '$views' }
                }}
            ]);

            const statsData = stats.length > 0 ? stats[0] : { totalVideos: 0, totalLikes: 0, totalViews: 0 };

            const profileData = {
                _id: channel._id.toString(),
                name: channel.name,
                slug: channel.slug,
                description: channel.description || '',
                avatar: channel.avatar || [],
                cover: channel.cover || [],
                wilaya: channel.wilaya || '',
                commune: channel.commune || '',
                activity: channel.activity || '',
                isVerified: channel.isVerified || false,
                followersCount: channel.followersCount || 0,
                totalVideos: statsData.totalVideos,
                totalViews: statsData.totalViews,
                totalLikes: statsData.totalLikes,
                owner: {
                    _id: channel.owner._id.toString(),
                    username: channel.owner.username,
                    avatar: channel.owner.avatar,
                    fullname: channel.owner.fullname,
                    email: channel.owner.email
                },
                isFollowing: false,
                pending: channel.pending === true,
                isActive: channel.isActive !== false,
                status: channel.status || (channel.pending ? 'pending' : channel.isActive ? 'approved' : 'rejected'),
                rejectionReason: channel.rejectionReason || '',
                email: channel.email || '',
                phone: channel.phone || '',
                website: channel.website || '',
                createdAt: channel.createdAt,
                updatedAt: channel.updatedAt
            };

            return res.json({ success: true, profile: profileData });
        }

        // ============================================
        // ✅ REGLA 2: EL DUEÑO PUEDE VER SU CANAL (incluso rechazado)
        // ============================================
        if (isOwner) {
            console.log(`👑 Dueño viendo su canal: ${channel.name} (status: ${channel.status || (channel.pending ? 'pending' : 'approved')})`);
            
            const stats = await Video.aggregate([
                { $match: { channel: new mongoose.Types.ObjectId(channelId), isActive: true } },
                { $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalLikes: { $sum: { $size: '$likes' } },
                    totalViews: { $sum: '$views' }
                }}
            ]);

            const statsData = stats.length > 0 ? stats[0] : { totalVideos: 0, totalLikes: 0, totalViews: 0 };

            const profileData = {
                _id: channel._id.toString(),
                name: channel.name,
                slug: channel.slug,
                description: channel.description || '',
                avatar: channel.avatar || [],
                cover: channel.cover || [],
                wilaya: channel.wilaya || '',
                commune: channel.commune || '',
                activity: channel.activity || '',
                isVerified: channel.isVerified || false,
                followersCount: channel.followersCount || 0,
                totalVideos: statsData.totalVideos,
                totalViews: statsData.totalViews,
                totalLikes: statsData.totalLikes,
                owner: {
                    _id: channel.owner._id.toString(),
                    username: channel.owner.username,
                    avatar: channel.owner.avatar,
                    fullname: channel.owner.fullname,
                    email: channel.owner.email
                },
                isFollowing: false,
                pending: channel.pending === true,
                isActive: channel.isActive !== false,
                status: channel.status || (channel.pending ? 'pending' : channel.isActive ? 'approved' : 'rejected'),
                rejectionReason: channel.rejectionReason || '',
                email: channel.email || '',
                phone: channel.phone || '',
                website: channel.website || '',
                createdAt: channel.createdAt,
                updatedAt: channel.updatedAt
            };

            return res.json({ success: true, profile: profileData });
        }

        // ============================================
        // ✅ REGLA 3: USUARIOS NORMALES SOLO VEN CANALES APROBADOS
        // ============================================
        if (channel.pending) {
            console.log(`❌ Canal pendiente bloqueado para usuario normal: ${channel.name}`);
            return res.status(404).json({ 
                success: false, 
                message: 'Canal en cours de vérification, disponible prochainement' 
            });
        }

        if (!channel.isActive) {
            console.log(`❌ Canal inactivo bloqueado: ${channel.name}`);
            return res.status(404).json({ 
                success: false, 
                message: 'Canal non disponible' 
            });
        }

        // Verificar follow para usuarios normales
        let isFollowing = false;
        if (currentUserId) {
            const currentUser = await User.findById(currentUserId).select('followingChannels');
            if (currentUser && currentUser.followingChannels) {
                isFollowing = currentUser.followingChannels.some(id => id.toString() === channelId);
            }
        }

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

        const profileData = {
            _id: channel._id.toString(),
            name: channel.name,
            slug: channel.slug,
            description: channel.description || '',
            avatar: channel.avatar || [],
            cover: channel.cover || [],
            wilaya: channel.wilaya || '',
            commune: channel.commune || '',
            activity: channel.activity || '',
            isVerified: channel.isVerified || false,
            followersCount: channel.followersCount || 0,
            totalVideos: statsData.totalVideos,
            totalViews: statsData.totalViews,
            totalLikes: statsData.totalLikes,
            owner: {
                _id: channel.owner._id.toString(),
                username: channel.owner.username,
                avatar: channel.owner.avatar,
                fullname: channel.owner.fullname,
                email: channel.owner.email
            },
            isFollowing: isFollowing,
            pending: false,
            isActive: true,
            status: 'approved',
            email: channel.email || '',
            phone: channel.phone || '',
            website: channel.website || '',
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
        };

        res.json({ success: true, profile: profileData });
        
    } catch (err) {
        console.error('❌ Error getChannelProfile:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
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

        let videoQuery = { channel: channelId };
        
        // ✅ ADMIN puede ver TODOS los videos (incluyendo pendientes)
        if (!isOwner && !isAdmin) {
            videoQuery = { channel: channelId, isActive: true, pendiente: false };
        } else if (isAdmin) {
            // Admin ve todo, sin filtros
            videoQuery = { channel: channelId };
        } else if (isOwner) {
            // Owner ve sus videos (incluyendo pendientes)
            videoQuery = { channel: channelId };
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
            isOwner: isOwner || isAdmin,
            channelName: channel.name
        });

    } catch (error) {
        console.error('❌ Error getChannelVideos:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleFollowChannel = async (req, res) => {
    console.log('🔥🔥🔥 toggleFollowChannel EJECUTÁNDOSE 🔥🔥🔥');
    
    try {
      const { channelId } = req.params;
      const userId = req.user._id;
      
      console.log('📌 channelId:', channelId);
      console.log('📌 userId:', userId);
      
      // Validar IDs
      if (!channelId || !userId) {
        console.log('❌ IDs inválidos');
        return res.status(400).json({ success: false, message: 'IDs inválidos' });
      }
      
      // Importar modelos
      const Channel = require('../models/channelModel');
      const User = require('../models/userModel');
      
      // Buscar canal
      const channel = await Channel.findById(channelId);
      if (!channel) {
        console.log('❌ Canal no encontrado');
        return res.status(404).json({ success: false, message: 'Canal no encontrado' });
      }
      console.log('✅ Canal encontrado:', channel.name);
      
      // Buscar usuario
      const user = await User.findById(userId);
      if (!user) {
        console.log('❌ Usuario no encontrado');
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      console.log('✅ Usuario encontrado:', user.username);
      
      // Verificar si ya sigue
      const isFollowing = user.followingChannels && user.followingChannels.includes(channelId);
      console.log('📌 isFollowing:', isFollowing);
      
      if (isFollowing) {
        // Dejar de seguir
        await User.findByIdAndUpdate(userId, { $pull: { followingChannels: channelId } });
        await Channel.findByIdAndUpdate(channelId, { $pull: { followers: userId } });
        console.log('✅ Dejó de seguir');
      } else {
        // Seguir
        await User.findByIdAndUpdate(userId, { $addToSet: { followingChannels: channelId } });
        await Channel.findByIdAndUpdate(channelId, { $addToSet: { followers: userId } });
        console.log('✅ Ahora sigue');
      }
      
      // Obtener canal actualizado
      const updatedChannel = await Channel.findById(channelId);
      const followersCount = updatedChannel.followers ? updatedChannel.followers.length : 0;
      
      // Guardar el contador
      updatedChannel.followersCount = followersCount;
      await updatedChannel.save();
      
      console.log('📌 Nuevo followersCount:', followersCount);
      
      res.json({
        success: true,
        isFollowing: !isFollowing,
        followersCount: followersCount
      });
      
    } catch (error) {
      console.error('❌ ERROR en toggleFollowChannel:', error);
      console.error('❌ Stack:', error.stack);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
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
// backend/controllers/channelCtrl.js

// ============================================
// ❌ RECHAZAR CANAL (NO ELIMINAR)
// ============================================
const rejectChannel = async (req, res) => {
    try {
      const { channelId } = req.params;
      const { reason } = req.body;
      
      // Verificar que es admin
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
      
      // ✅ RECHAZAR canal - NO ELIMINAR
      channel.pending = false;           // Ya no está pendiente
      channel.isActive = false;          // No está activo para el público
      channel.status = 'rejected';       // Estado: rechazado
      channel.rejectionReason = reason || 'Canal non conforme aux conditions d\'utilisation';
      channel.rejectedAt = new Date();
      channel.rejectedBy = req.user._id;
      
      // ✅ NO eliminamos el canal, solo lo marcamos como rechazado
      // El dueño podrá verlo y editarlo para reenviarlo
      
      await channel.save();
      
      console.log(`❌ Canal rechazado: ${channel.name}`);
      console.log(`   - Razón: ${channel.rejectionReason}`);
      console.log(`   - Por: ${req.user.username}`);
      
      // Devolver el canal con el nuevo estado
      const updatedChannel = await Channel.findById(channelId)
        .populate('owner', 'username email avatar')
        .lean();
      
      res.json({ 
        success: true, 
        message: 'Canal rejeté avec succès',
        channel: {
          _id: updatedChannel._id,
          name: updatedChannel.name,
          pending: updatedChannel.pending,
          isActive: updatedChannel.isActive,
          status: updatedChannel.status,
          rejectionReason: updatedChannel.rejectionReason
        }
      });
      
    } catch (error) {
      console.error('❌ Error rejectChannel:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

// backend/controllers/channelCtrl.js

// ============================================
// 📤 REENVIAR CANAL (después de ser rechazado)
// ============================================
const resubmitChannel = async (req, res) => {
    try {
      const { channelId } = req.params;
      
      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ success: false, message: 'Canal no encontrado' });
      }
      
      // Verificar que el usuario es el dueño
      const isOwner = channel.owner.toString() === req.user._id.toString();
      if (!isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Seul le propriétaire peut renvoyer le canal' 
        });
      }
      
      // ✅ Reenviar canal para aprobación
      channel.pending = true;
      channel.isActive = false;
      channel.status = 'pending';
      channel.rejectionReason = '';
      channel.resubmittedAt = new Date();
      channel.resubmittedCount = (channel.resubmittedCount || 0) + 1;
      
      await channel.save();
      
      console.log(`📤 Canal re-envoyé: ${channel.name} par ${req.user.username}`);
      
      res.json({ 
        success: true, 
        message: 'Canal renvoyé pour approbation',
        channel: {
          _id: channel._id,
          name: channel.name,
          pending: channel.pending,
          status: channel.status
        }
      });
      
    } catch (error) {
      console.error('❌ Error resubmitChannel:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

// backend/controllers/channelCtrl.js

const getPendingChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        console.log('📺 getPendingChannel - Inicio');
        console.log('📺 channelId:', channelId);
        console.log('👤 req.user:', req.user._id);
        console.log('👤 req.user role:', req.user.role);
        
        if (!req.user) {
            console.log('❌ No hay usuario autenticado');
            return res.status(401).json({ success: false, message: "Accès non autorisé" });
        }
        
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }

        const channel = await Channel.findById(channelId)
            .populate('owner', 'username avatar fullname')
            .lean();

        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }

        const isOwner = channel.owner._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        console.log('📺 Verificación de permisos:');
        console.log('  - isOwner:', isOwner);
        console.log('  - isAdmin:', isAdmin);
        console.log('  - channel.owner:', channel.owner._id.toString());
        console.log('  - req.user._id:', req.user._id.toString());

        // ✅ Solo dueño o admin pueden ver canales pendientes
        if (!isOwner && !isAdmin) {
            console.log('❌ Acceso denegado - No es dueño ni admin');
            return res.status(403).json({ 
                success: false, 
                message: "Accès non autorisé. Seul le propriétaire peut voir ce canal en attente." 
            });
        }

        console.log('✅ Acceso concedido para canal pendiente');

        const profileData = {
            _id: channel._id.toString(),
            name: channel.name,
            slug: channel.slug,
            description: channel.description || '',
            avatar: channel.avatar || [],
            cover: channel.cover || [],
            wilaya: channel.wilaya || '',
            commune: channel.commune || '',
            activity: channel.activity || '',
            isVerified: channel.isVerified || false,
            followersCount: channel.followersCount || 0,
            totalVideos: channel.totalVideos || 0,
            totalViews: channel.totalViews || 0,
            totalLikes: channel.totalLikes || 0,
            owner: channel.owner,
            isFollowing: false,
            pending: channel.pending === true,
            isActive: channel.isActive !== false,
            email: channel.email || '',
            phone: channel.phone || '',
            website: channel.website || '',
            createdAt: channel.createdAt,
            updatedAt: channel.updatedAt
        };

        res.json({ success: true, profile: profileData });
        
    } catch (err) {
        console.error('❌ Error getPendingChannel:', err);
        res.status(500).json({ success: false, message: err.message });
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
// backend/controllers/channelCtrl.js

// ==================== ELIMINAR CANAL (SOFT DELETE) ====================
// backend/controllers/channelCtrl.js

const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { reason } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }
        
        // Verificar permisos (solo dueño o admin)
        const isOwner = channel.owner.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ success: false, message: 'No autorizado' });
        }
        
        // ✅ SOFT DELETE - Marcar como inactivo
        channel.isActive = false;
        channel.deletedReason = reason || (isOwner ? 'Eliminado por el propietario' : 'Eliminado por administrador');
        channel.deletedAt = new Date();
        channel.deletedBy = req.user._id;
        
        // ✅ También desactivar todos los videos del canal
        await Video.updateMany(
            { channel: channelId },
            { isActive: false, pendiente: true }
        );
        
        await channel.save();
        
        console.log(`✅ Canal eliminado (soft delete): ${channel.name} por ${req.user.username}`);
        
        res.json({
            success: true,
            message: 'Canal eliminado correctamente',
            channel: {
                _id: channel._id,
                name: channel.name,
                isActive: channel.isActive
            }
        });
        
    } catch (error) {
        console.error('❌ Error deleteChannel:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== REPORTAR CANAL ====================
const reportChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { reason, description } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        if (!reason) {
            return res.status(400).json({ success: false, message: 'La razón es requerida' });
        }
        
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }
        
        // Verificar si el usuario ya reportó este canal
        const alreadyReported = channel.reports.some(
            report => report.user.toString() === req.user._id.toString()
        );
        
        if (alreadyReported) {
            return res.status(400).json({ 
                success: false, 
                message: 'Ya has reportado este canal anteriormente' 
            });
        }
        
        // Agregar reporte
        channel.reports.push({
            user: req.user._id,
            reason,
            description: description || '',
            status: 'pending',
            createdAt: new Date()
        });
        
        channel.reportCount = channel.reports.length;
        
        // Si tiene muchos reportes, marcar para revisión automática
        if (channel.reportCount >= 10) {
            channel.pending = true; // Requiere revisión
        }
        
        await channel.save();
        
        // Notificar a admin (opcional - con socket)
        // if (req.io) {
        //     req.io.to('admin-room').emit('new_channel_report', {
        //         channelId: channel._id,
        //         channelName: channel.name,
        //         reportCount: channel.reportCount
        //     });
        // }
        
        console.log(`📢 Canal reportado: ${channel.name} por ${req.user.username} - Razón: ${reason}`);
        
        res.json({
            success: true,
            message: 'Reporte enviado correctamente',
            reportCount: channel.reportCount
        });
        
    } catch (error) {
        console.error('❌ Error reportChannel:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== BLOQUEAR CANAL ====================
const blockChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: 'ID inválido' });
        }
        
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }
        
        const userId = req.user._id;
        const isAlreadyBlocked = channel.blockedBy.includes(userId);
        
        if (isAlreadyBlocked) {
            // Desbloquear
            channel.blockedBy = channel.blockedBy.filter(
                id => id.toString() !== userId.toString()
            );
            channel.isBlocked = channel.blockedBy.length > 0;
            
            await channel.save();
            
            res.json({
                success: true,
                isBlocked: false,
                message: 'Canal desbloqueado'
            });
        } else {
            // Bloquear
            channel.blockedBy.push(userId);
            channel.isBlocked = true;
            
            await channel.save();
            
            res.json({
                success: true,
                isBlocked: true,
                message: 'Canal bloqueado'
            });
        }
        
    } catch (error) {
        console.error('❌ Error blockChannel:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== REGISTRAR COMPARTIDO ====================
const registerShare = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }
        
        channel.shareCount = (channel.shareCount || 0) + 1;
        channel.lastSharedAt = new Date();
        
        await channel.save();
        
        res.json({
            success: true,
            shareCount: channel.shareCount
        });
        
    } catch (error) {
        console.error('❌ Error registerShare:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== OBTENER INFO DE CONTACTO ====================
const getContactInfo = async (req, res) => {
    try {
        const { channelId } = req.params;
        
        const channel = await Channel.findById(channelId)
            .select('email phone website wilaya commune owner')
            .populate('owner', 'username email phone');
        
        if (!channel) {
            return res.status(404).json({ success: false, message: 'Canal no encontrado' });
        }
        
        // Solo mostrar información si el canal está activo
        if (!channel.isActive) {
            return res.status(403).json({ success: false, message: 'Canal no disponible' });
        }
        
        const contactInfo = {
            email: channel.email || channel.owner.email,
            phone: channel.phone || channel.owner.phone,
            website: channel.website,
            location: {
                wilaya: channel.wilaya,
                commune: channel.commune
            }
        };
        
        res.json({
            success: true,
            contact: contactInfo
        });
        
    } catch (error) {
        console.error('❌ Error getContactInfo:', error);
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
    getPendingChannel ,
    approveChannel ,
    rejectChannel,
    getPendingChannels ,
    deleteChannel,
    reportChannel,
    blockChannel,
    registerShare,
    getContactInfo,
    resubmitChannel
};

 