// controllers/channelCtrl.js
const Channel = require('../models/channelModel');
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// ============================================
// 🆕 CREAR CANAL
// ============================================
const createChannel = async (req, res) => {
  try {
    const { name, activity, description, avatar, cover, phone, email, website, wilaya, commune } = req.body;
    const userId = req.user._id;

    console.log('📺 [createChannel] Creando canal para usuario:', userId);
    console.log('📺 Datos recibidos:', { name, activity, description, wilaya, commune });

    // Verificar si ya existe un canal con el mismo nombre para este usuario
    const existingChannel = await Channel.findOne({ owner: userId, name });
    if (existingChannel) {
      return res.status(400).json({ success: false, message: 'Ya tienes un canal con ese nombre' });
    }

    // Crear slug único basado en el nombre
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Verificar slug único
    let finalSlug = slug;
    let counter = 1;
    while (await Channel.findOne({ slug: finalSlug })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Crear el canal
    const channel = new Channel({
      name,
      slug: finalSlug,
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
    console.log('✅ Canal creado:', channel._id, channel.name);

    // ✅ IMPORTANTE: Actualizar el usuario con la referencia al canal
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $push: { channels: channel._id } },
      { new: true }
    );
    
    console.log('✅ Usuario actualizado:', userId);
    console.log('   Canales del usuario:', updatedUser.channels);

    res.status(201).json({ 
      success: true, 
      channel: {
        _id: channel._id,
        name: channel.name,
        slug: channel.slug,
        activity: channel.activity
      }
    });
    
  } catch (error) {
    console.error('❌ Error createChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📋 OBTENER CANAL POR ID (con estadísticas)
// ============================================
const getChannelById = async (req, res) => {
  try {
    const { channelId } = req.params;

    // ✅ Validar que channelId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    const channel = await Channel.findById(channelId)
      .populate('owner', 'username avatar fullname')
      .lean();

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const videos = await Video.find({ channel: channelId, pendiente: false, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate('category', 'name slug')
      .lean();

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

// controllers/channelCtrl.js - CORREGIR getChannelProfile
// controllers/channelCtrl.js - getChannelProfile CORREGIDO
const getChannelProfile = async (req, res) => {
  try {
    const { channelId } = req.params;
    
    // ✅ Manejar caso donde req.user es undefined (usuario no autenticado)
    const currentUserId = req.user ? req.user._id : null;
    const isAdmin = req.user ? req.user.role === 'admin' : false;

    console.log('🔍 getChannelProfile - channelId:', channelId);
    console.log('🔍 currentUserId:', currentUserId);
    console.log('🔍 isAdmin:', isAdmin);

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    const channel = await Channel.findById(channelId)
      .populate('owner', 'username avatar fullname')
      .lean();

    if (!channel || !channel.isActive) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    let isFollowing = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select('followingChannels');
      if (currentUser && currentUser.followingChannels) {
        isFollowing = currentUser.followingChannels.some(id => id.toString() === channelId);
      }
    }

    // Estadísticas básicas (siempre visibles)
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

    const statsData = stats.length > 0 ? stats[0] : {
      totalVideos: 0,
      totalLikes: 0,
      totalViews: 0,
      totalComments: 0
    };

    // Perfil base (siempre visible)
    const profileData = {
      _id: channel._id,
      name: channel.name,
      description: channel.description,
      avatar: channel.avatar,
      cover: channel.cover,
      wilaya: channel.wilaya || '',
      commune: channel.commune || '',
      activity: channel.activity || '',
      isVerified: channel.isVerified || false,
      followersCount: channel.followersCount || 0,
      totalVideos: statsData.totalVideos,
      totalViews: statsData.totalViews,
      totalLikes: statsData.totalLikes,
      owner: {
        _id: channel.owner._id,
        username: channel.owner.username,
        avatar: channel.owner.avatar,
        fullname: channel.owner.fullname
      },
      isFollowing
    };

    // ✅ Verificar si es el dueño o admin
    const isOwner = currentUserId && channel.owner._id.toString() === currentUserId.toString();
    
    if (isOwner || isAdmin) {
      // Dueño o admin: enviar TODOS los datos de contacto
      profileData.email = channel.email || '';
      profileData.phone = channel.phone || '';
      profileData.phoneHidden = channel.phoneHidden || false;
      profileData.website = channel.website || '';
      profileData.delivery = channel.delivery || null;
      profileData.businessHours = channel.businessHours || null;
      profileData.settings = channel.settings || null;
    } else {
      // Usuario normal: solo mostrar si no está oculto
      profileData.email = channel.email && !channel.emailHidden ? channel.email : null;
      profileData.phone = channel.phone && !channel.phoneHidden ? channel.phone : null;
      profileData.website = channel.website || null;
    }

    console.log('📤 Enviando perfil - isOwner:', isOwner);
    console.log('📤 Datos de contacto:', {
      email: profileData.email,
      phone: profileData.phone,
      website: profileData.website
    });

    res.json({ success: true, profile: profileData });
  } catch (err) {
    console.error('❌ Error getChannelProfile:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
const updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const updates = req.body;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    console.log('📝 updateChannel - channelId:', channelId);
    console.log('📝 updateChannel - updates:', updates);
    console.log('📝 updateChannel - userId:', userId);
    console.log('📝 updateChannel - isAdmin:', isAdmin);

    // ✅ Validar channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // ✅ CORREGIDO: Añadir todos los campos necesarios
    const allowedFields = [
      'name', 
      'activity', 
      'description', 
      'avatar', 
      'cover', 
      'phone',           // ✅ Añadido
      'phoneHidden',     // ✅ Añadido
      'email',           // ✅ Añadido
      'website',         // ✅ Añadido
      'wilaya',          // ✅ Añadido
      'commune',         // ✅ Añadido
      'location', 
      'delivery', 
      'businessHours', 
      'settings'
    ];
    
    let updatedFields = [];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        channel[field] = updates[field];
        updatedFields.push(field);
      }
    });

    console.log('✅ Campos actualizados:', updatedFields);

    // Actualizar followersCount si se modificaron followers
    if (updates.followers) {
      channel.followersCount = updates.followers.length;
    }

    await channel.save();
    
    console.log('✅ Canal guardado correctamente:', channel._id);
    
    // Devolver el canal actualizado con todos los campos
    res.json({ 
      success: true, 
      channel: {
        _id: channel._id,
        name: channel.name,
        activity: channel.activity,
        description: channel.description,
        avatar: channel.avatar,
        cover: channel.cover,
        phone: channel.phone,
        phoneHidden: channel.phoneHidden,
        email: channel.email,
        website: channel.website,
        wilaya: channel.wilaya,
        commune: channel.commune,
        delivery: channel.delivery,
        businessHours: channel.businessHours,
        settings: channel.settings,
        followersCount: channel.followersCount,
        isActive: channel.isActive,
        isVerified: channel.isVerified
      }
    });
  } catch (error) {
    console.error('❌ Error updateChannel:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👥 SEGUIR / DEJAR DE SEGUIR
// ============================================
const toggleFollowChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // ✅ Validar channelId
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
    } else {
      await Channel.findByIdAndUpdate(channelId, { $addToSet: { followers: userId } });
    }

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
// 📺 OBTENER VIDEOS DE UN CANAL (paginado) - CORREGIDO
// ============================================
const getChannelVideos = async (req, res) => {
  try {
    let { channelId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // ✅ Validar channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    // Verificar que el canal exista (opcional pero recomendable)
    const channelExists = await Channel.exists({ _id: channelId });
    if (!channelExists) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const videos = await Video.find({ channel: channelId, pendiente: false, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('channel', '_id name avatar slug')
      .populate('category', 'name slug')
      .lean();

    const total = await Video.countDocuments({ channel: channelId, pendiente: false, isActive: true });
    const hasMore = skip + videos.length < total;

    res.json({
      success: true,
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore
    });
  } catch (error) {
    console.error('❌ Error getChannelVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🔍 LISTAR CANALES DEL USUARIO ACTUAL
// ============================================
// controllers/channelCtrl.js - CORREGIR getMyChannels
// controllers/channelCtrl.js - getMyChannels CORREGIDO
const getMyChannels = async (req, res) => {
  try {
    const userId = req.user._id;
    
    console.log('📡 getMyChannels - userId:', userId);
    
    // ✅ Buscar canales del usuario con TODOS los campos
    const channels = await Channel.find({ owner: userId })
      .populate('owner', 'username avatar fullname')
      .lean();
    
    console.log('📡 getMyChannels - Canales encontrados:', channels.length);
    
    // ✅ Asegurar que cada canal tenga todos los campos necesarios
    const formattedChannels = channels.map(channel => ({
      _id: channel._id,
      name: channel.name,
      activity: channel.activity,
      description: channel.description,
      avatar: channel.avatar,
      cover: channel.cover,
      phone: channel.phone || '',
      email: channel.email || '',
      website: channel.website || '',
      wilaya: channel.wilaya || '',
      commune: channel.commune || '',
      followersCount: channel.followersCount || 0,
      totalVideos: channel.totalVideos || 0,
      totalViews: channel.totalViews || 0,
      totalLikes: channel.totalLikes || 0,
      isVerified: channel.isVerified || false,
      isActive: channel.isActive,
      createdAt: channel.createdAt
    }));
    
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

// ============================================
// 📊 ESTADÍSTICAS DEL CANAL (dueño/admin)
// ============================================
const getChannelStats = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // ✅ Validar channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

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

    const statsData = videoStats.length > 0 ? videoStats[0] : {
      totalVideos: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      commercialVideos: 0
    };

    res.json({
      success: true,
      stats: {
        ...statsData,
        followersCount: channel.followersCount,
        followersGrowth: { current: channel.followersCount }
      }
    });
  } catch (error) {
    console.error('❌ Error getChannelStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🗑️ ELIMINAR CANAL
// ============================================
const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // ✅ Validar channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ success: false, message: 'ID de canal inválido' });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const isOwner = channel.owner.toString() === userId.toString();
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    await Video.deleteMany({ channel: channelId });
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

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  createChannel,
  getChannelById,
  getChannelProfile,
  updateChannel,
  toggleFollowChannel,
  getChannelVideos,
  getMyChannels,
  getChannelStats,
  deleteChannel
};