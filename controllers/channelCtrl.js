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
    await User.findByIdAndUpdate(userId, { $push: { channels: channel._id } });

    res.status(201).json({ success: true, channel });
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

// ============================================
// 🌐 PERFIL PÚBLICO DEL CANAL (CORREGIDO)
// ============================================
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

    let isFollowing = false;
    if (currentUserId) {
      const currentUser = await User.findById(currentUserId).select('followingChannels');
      if (currentUser && currentUser.followingChannels) {
        isFollowing = currentUser.followingChannels.some(id => id.toString() === channelId);
      }
    }

    // Estadísticas con protección contra array vacío
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
// ✏️ ACTUALIZAR CANAL
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

    const allowedFields = ['name', 'activity', 'description', 'avatar', 'cover', 'phone', 'phoneHidden', 'email', 'website', 'wilaya', 'commune', 'location', 'delivery', 'businessHours', 'settings'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) channel[field] = updates[field];
    });

    if (updates.followers) channel.followersCount = updates.followers.length;

    await channel.save();
    res.json({ success: true, channel });
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
// 📺 OBTENER VIDEOS DE UN CANAL (paginado)
// ============================================
const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ channel: channelId, pendiente: false, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
// 📊 ESTADÍSTICAS DEL CANAL (dueño/admin)
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
// EXPORTACIONES (sin duplicados)
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