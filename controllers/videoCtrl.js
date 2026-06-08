// backend/controllers/videoController.js

const Video = require('../models/videoModel');
const User = require('../models/userModel');
const Category = require('../models/categoryModel');
const Channel = require('../models/channelModel');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteFromCloudinary = async (publicId, resourceType = 'video') => {
  if (!publicId) return { success: false, error: 'No publicId provided' };
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result === 'ok') {
      console.log(`✅ Eliminado de Cloudinary: ${publicId} (${resourceType})`);
      return { success: true };
    } else if (result.result === 'not found') {
      console.log(`⚠️ Recurso no encontrado en Cloudinary: ${publicId}`);
      return { success: true };
    } else {
      console.error(`❌ Error eliminando ${publicId}: ${result.result}`);
      return { success: false, error: result.result };
    }
  } catch (err) {
    console.error(`❌ Excepción eliminando ${publicId}:`, err.message);
    return { success: false, error: err.message };
  }
};

const validateAndGetCategory = async (categoryIdOrSlug) => {
  if (!categoryIdOrSlug) return null;
  let category = null;
  if (mongoose.Types.ObjectId.isValid(categoryIdOrSlug)) {
    category = await Category.findById(categoryIdOrSlug);
  }
  if (!category && typeof categoryIdOrSlug === 'string') {
    category = await Category.findOne({ slug: categoryIdOrSlug });
  }
  if (!category && typeof categoryIdOrSlug === 'string') {
    category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryIdOrSlug}$`, 'i') } });
  }
  return category;
};

// ============================================
// 📹 CREATE VIDEO
// ============================================
const createVideo = async (req, res) => {
  try {
    const {
      titre, title: receivedTitle, description, category, videoUrl, videoPublicId,
      thumbnail, duration, music, isCommercial, saleType, address, mapUrl, channelId
    } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const isAdmin = user.role === 'admin';
    const MAX_VIDEO_DURATION = 60;
    
    if (duration && duration > MAX_VIDEO_DURATION) {
      return res.status(400).json({
        success: false,
        message: `⏱️ La durée maximale est de ${MAX_VIDEO_DURATION} secondes`
      });
    }

    const finalTitle = titre || receivedTitle;
    if (!finalTitle || !finalTitle.trim()) {
      return res.status(400).json({ success: false, message: 'Le titre est obligatoire' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'La catégorie est obligatoire' });
    }

    const categoryDoc = await validateAndGetCategory(category);
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: `Catégorie invalide: ${category}` });
    }

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'La vidéo est obligatoire' });
    }

    let channel;
    if (channelId) {
      channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ success: false, message: 'Canal non trouvé' });
      }
      if (channel.owner.toString() !== userId.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Vous n\'êtes pas propriétaire de ce canal' });
      }
    } else {
      channel = await Channel.findOne({ owner: userId });
      if (!channel) {
        return res.status(400).json({ success: false, message: 'Vous n\'avez pas de canal. Créez-en un d\'abord.' });
      }
    }

    if (isCommercial === true || isCommercial === 'true') {
      if (!channel.wilaya || !channel.commune) {
        return res.status(400).json({ success: false, message: 'Pour les vidéos commerciales, le canal doit avoir une wilaya et une commune' });
      }
      if (!channel.phone && !channel.email) {
        return res.status(400).json({ success: false, message: 'Le canal doit avoir au moins un moyen de contact' });
      }
      if (!saleType || !['retail', 'wholesale', 'both'].includes(saleType)) {
        return res.status(400).json({ success: false, message: 'Le type de vente est obligatoire' });
      }
    }

    let finalVideoUrl = videoUrl;
    let finalThumbnail = thumbnail;
    let musicData = null;

    if (music && music.audioPublicId && videoPublicId) {
      try {
        const formattedAudioId = music.audioPublicId.replace(/\//g, ':');
        const uploadIndex = videoUrl.indexOf('/upload/');
        if (uploadIndex === -1) throw new Error('URL invalide');
        const base = videoUrl.substring(0, uploadIndex + 8);
        const pathAndFile = videoUrl.substring(uploadIndex + 8);
        const transformation = `l_audio:${formattedAudioId},fl_layer_apply`;
        finalVideoUrl = `${base}${transformation}/${pathAndFile}`;
        finalThumbnail = finalVideoUrl.replace(/\.mp4$/, '.jpg');
        musicData = {
          id: music.id, title: music.title, artist: music.artist,
          audioUrl: music.audioUrl, audioPublicId: music.audioPublicId,
          volume: music.volume || 70, processed: true
        };
      } catch (err) {
        musicData = { ...music, processed: false, error: err.message };
      }
    } else if (music && music.audioUrl) {
      musicData = { ...music, processed: false };
    }

    const newVideo = new Video({
      title: finalTitle.trim(),
      description: description || '',
      shortDescription: description ? description.substring(0, 300) : '',
      category: categoryDoc._id,
      videoUrl: finalVideoUrl,
      videoPublicId: videoPublicId,
      thumbnail: finalThumbnail,
      duration: duration || 0,
      channel: channel._id,
      user: userId,
      music: musicData,
      tags: req.body.tags || [],
      isCommercial: isCommercial === true || isCommercial === 'true' ? true : false,
      saleType: (isCommercial === true || isCommercial === 'true') ? saleType : null,
      address: address || '',
      mapUrl: mapUrl || '',
      status: isAdmin ? 'approved' : 'pending'
    });

    await newVideo.save();
    await Category.findByIdAndUpdate(categoryDoc._id, { $inc: { videoCount: 1 } });
    
    channel.totalVideos = await Video.countDocuments({ channel: channel._id, status: 'approved', isActive: true });
    await channel.save();

    const populatedVideo = await Video.findById(newVideo._id)
      .populate('channel', 'name avatar isVerified _id owner wilaya commune phone email')
      .populate('category', 'name slug icon')
      .populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      message: isAdmin ? 'Vidéo créée avec succès' : 'Vidéo en attente d\'approbation',
      video: populatedVideo
    });

  } catch (error) {
    console.error('❌ Error createVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📹 GET VIDEO BY ID (PÚBLICO)
// ============================================
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro')
      .populate('channel', 'name avatar isVerified _id owner wilaya commune phone email')
      .populate('comments.user', 'username avatar')
      .lean();

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    res.json({ success: true, video });
  } catch (error) {
    console.error('Error getVideoById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📹 GET VIDEO (CON VERIFICACIÓN DE PERMISOS)
// ============================================
const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role bio')
      .populate('channel', 'name avatar isVerified _id owner')
      .populate('comments.user', 'username avatar');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    const isOwner = req.user && video.user._id.toString() === req.user._id.toString();

    if (video.status === 'pending' && !isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Este video está pendiente de aprobación' });
    }

    if (req.user && !isOwner && video.status === 'approved') {
      video.views = (video.views || 0) + 1;
      await video.save();
    }

    res.json({ success: true, video });
  } catch (error) {
    console.error('Error getVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📹 UPDATE VIDEO
// ============================================
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, title: receivedTitle, description, category, music, videoUrl, videoPublicId, thumbnail, duration, isCommercial, saleType, address, mapUrl, tags, channelId } = req.body;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    let currentChannel = await Channel.findById(video.channel);
    if (!currentChannel) {
      return res.status(404).json({ success: false, message: 'Canal original no encontrado' });
    }

    const isOwner = currentChannel.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Cambio de canal opcional
    if (channelId && channelId !== video.channel.toString()) {
      const newChannel = await Channel.findById(channelId);
      if (!newChannel) {
        return res.status(404).json({ success: false, message: 'Nuevo canal no encontrado' });
      }
      if (newChannel.owner.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: 'No eres dueño del nuevo canal' });
      }
      video.channel = newChannel._id;
    }

    const oldCategoryId = video.category ? video.category.toString() : null;
    const newTitle = titre || receivedTitle;
    if (newTitle !== undefined) video.title = newTitle.trim();
    if (description !== undefined) {
      video.description = description;
      video.shortDescription = description ? description.substring(0, 300) : '';
    }
    if (thumbnail) video.thumbnail = thumbnail;
    if (duration !== undefined) video.duration = duration;
    if (videoUrl) video.videoUrl = videoUrl;
    if (videoPublicId !== undefined) video.videoPublicId = videoPublicId;
    if (tags) video.tags = tags;

    if (category !== undefined) {
      const categoryDoc = await validateAndGetCategory(category);
      if (!categoryDoc) {
        return res.status(400).json({ success: false, message: `Catégorie invalide: ${category}` });
      }
      video.category = categoryDoc._id;
    }

    if (isCommercial !== undefined) video.isCommercial = isCommercial;
    if (isCommercial === true) {
      if (saleType !== undefined && !['retail', 'wholesale', 'both'].includes(saleType)) {
        return res.status(400).json({ success: false, message: 'saleType inválido' });
      }
      if (saleType !== undefined) video.saleType = saleType;
      if (address !== undefined) video.address = address;
      if (mapUrl !== undefined) video.mapUrl = mapUrl;
    } else if (isCommercial === false) {
      video.saleType = null;
      video.address = '';
      video.mapUrl = '';
    }

    // Manejo de música
    if (music !== undefined && music !== null) {
      if (music === null) {
        video.music = null;
      } else if (music.audioPublicId) {
        let baseVideoUrl = videoUrl || video.videoUrl;
        try {
          const formattedAudioId = music.audioPublicId.replace(/\//g, ':');
          const uploadIndex = baseVideoUrl.indexOf('/upload/');
          if (uploadIndex !== -1) {
            const base = baseVideoUrl.substring(0, uploadIndex + 8);
            const pathAndFile = baseVideoUrl.substring(uploadIndex + 8);
            const transformation = `l_audio:${formattedAudioId},fl_layer_apply`;
            video.videoUrl = `${base}${transformation}/${pathAndFile}`;
            if (!thumbnail && video.thumbnail) {
              video.thumbnail = video.videoUrl.replace(/\.(mp4|mov|webm)$/, '.jpg');
            }
            video.music = { ...music, processed: true };
          }
        } catch (err) {
          video.music = { ...music, processed: false, error: err.message };
        }
      } else if (music.audioUrl) {
        video.music = { ...music, processed: false };
      }
    }

    await video.save();

    // Actualizar contadores de categoría
    if (oldCategoryId && video.category && oldCategoryId !== video.category.toString()) {
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { videoCount: -1 } });
      await Category.findByIdAndUpdate(video.category, { $inc: { videoCount: 1 } });
    }

    await currentChannel.updateStats();
    if (channelId && channelId !== video.channel.toString()) {
      const newChannel = await Channel.findById(channelId);
      if (newChannel) await newChannel.updateStats();
    }

    const updatedVideo = await Video.findById(video._id)
      .populate('channel', 'name avatar isVerified _id owner')
      .populate('category', 'name slug icon')
      .populate('user', 'username avatar');

    res.json({ success: true, message: 'Video actualizado correctamente', video: updatedVideo });
  } catch (error) {
    console.error('Error updateVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🗑️ DELETE VIDEO
// ============================================
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('channel');
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const isOwner = video.channel.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    await video.softDelete(req.user._id, 'Eliminado por el usuario');

    const channel = await Channel.findById(video.channel._id);
    if (channel) {
      channel.totalVideos = await Video.countDocuments({ channel: channel._id, status: 'approved', isActive: true });
      await channel.save();
    }

    if (video.category) {
      await Category.findByIdAndUpdate(video.category, { $inc: { videoCount: -1 } });
    }

    res.json({ success: true, message: 'Video eliminado correctamente' });
  } catch (error) {
    console.error('Error deleteVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ❤️ TOGGLE LIKE
// ============================================
const toggleLikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const userId = req.user._id;
    const result = await video.toggleLike(userId);
    
    res.json({ success: true, likes: result.likesCount, liked: result.liked });
  } catch (error) {
    console.error('Error toggleLikeVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📤 SHARE VIDEO
// ============================================
const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const { shared, sharesCount } = await video.share(req.user._id);
    res.json({ success: true, shares: sharesCount, shared });
  } catch (error) {
    console.error('Error shareVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👁️ TRACK WATCH TIME
// ============================================
const trackWatchTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    await video.updateWatchTime(req.user._id, watchTime);
    res.json({ success: true, averageWatchTime: video.averageWatchTime });
  } catch (error) {
    console.error('Error trackWatchTime:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📊 GET USER VIDEO STATS
// ============================================
const getUserVideoStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'approved' } },
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
    
    res.json({ success: true, stats: stats[0] || { totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, commercialVideos: 0 } });
  } catch (error) {
    console.error('Error getUserVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🎵 GET MUSIC LIBRARY
// ============================================
const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '9dee24cd';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0/tracks/';

const getMusicLibrary = async (req, res) => {
  const query = req.query.q || 'background';
  const limit = parseInt(req.query.limit) || 20;
  const perPage = Math.min(limit, 50);
  try {
    const response = await axios.get(JAMENDO_API_URL, {
      params: { client_id: JAMENDO_CLIENT_ID, format: 'json', limit: perPage, search: query, include: 'musicinfo' },
      timeout: 10000
    });
    if (!response.data || !response.data.results || response.data.results.length === 0) {
      return res.json({ success: true, hits: [], message: 'Aucun résultat' });
    }
    const hits = response.data.results.map(track => ({
      id: track.id, title: track.name, user: track.artist_name, duration: track.duration,
      audio: track.audio, thumbnail: track.album_image || '', genre: track.genre || '', tags: track.tags || ''
    }));
    res.json({ success: true, hits });
  } catch (error) {
    console.error('❌ Error en Jamendo:', error.message);
    res.status(200).json({ success: true, hits: [], message: 'Servicio de música no disponible' });
  }
};

// ============================================
// 🔥 FILTER VIDEOS
// ============================================
const filterVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12, searchTerm, sortBy = 'recent', category, wilaya } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let match = { status: 'approved', isActive: true };
    if (searchTerm) match.title = { $regex: searchTerm, $options: 'i' };
    if (category && mongoose.Types.ObjectId.isValid(category)) match.category = category;
    if (wilaya) match.wilaya = wilaya;

    let sort = {};
    if (sortBy === 'popular') sort = { views: -1 };
    else if (sortBy === 'liked') sort = { likesCount: -1 };
    else sort = { createdAt: -1 };

    const videos = await Video.aggregate([
      { $match: match },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sort },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userData' } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'channels', localField: 'channel', foreignField: '_id', as: 'channelData' } },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: { _id: '$userData._id', username: '$userData.username', avatar: '$userData.avatar' },
          channel: {
            _id: '$channelData._id', name: '$channelData.name', isVerified: '$channelData.isVerified',
            avatar: { $cond: { if: { $isArray: '$channelData.avatar' }, then: { $arrayElemAt: ['$channelData.avatar.url', 0] }, else: '$channelData.avatar' } }
          }
        }
      },
      { $project: { userData: 0, channelData: 0 } }
    ]);

    const total = await Video.countDocuments(match);
    res.json({ success: true, videos, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), hasMore: skip + videos.length < total });
  } catch (err) {
    console.error('Error filterVideos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// 📂 GET VIDEOS BY CATEGORY
// ============================================
const getVideosByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, sortBy = 'recent' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const category = await Category.findOne({ slug: slug, isActive: true });
    if (!category) {
      return res.json({ success: true, videos: [], total: 0, categoryInfo: null });
    }
    let filter = { category: category._id, status: 'approved', isActive: true };
    let sort = {};
    switch (sortBy) {
      case 'views': sort = { views: -1 }; break;
      case 'likes': sort = { likesCount: -1 }; break;
      default: sort = { createdAt: -1 };
    }
    const videos = await Video.aggregate([
      { $match: filter },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sort },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userData' } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'channels', localField: 'channel', foreignField: '_id', as: 'channelData' } },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: { _id: '$userData._id', username: '$userData.username', avatar: '$userData.avatar' },
          channel: {
            _id: '$channelData._id', name: '$channelData.name', isVerified: '$channelData.isVerified',
            avatar: { $cond: { if: { $isArray: '$channelData.avatar' }, then: { $arrayElemAt: ['$channelData.avatar.url', 0] }, else: '$channelData.avatar' } }
          }
        }
      },
      { $project: { userData: 0, channelData: 0 } }
    ]);
    const total = await Video.countDocuments(filter);
    res.json({ success: true, videos, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), hasMore: skip + videos.length < total, categoryInfo: { _id: category._id, name: category.name, slug: category.slug, icon: category.icon, iconColor: category.iconColor } });
  } catch (error) {
    console.error('Error getVideosByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ⭐ GET FEATURED VIDEOS
// ============================================
const getFeaturedVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.find({ isFeatured: true, status: 'approved', isActive: true })
      .sort({ createdAt: -1 }).limit(parseInt(limit)).populate('user', 'username avatar isPro');
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getFeaturedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📈 GET POPULAR VIDEOS
// ============================================
const getPopularVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.aggregate([
      { $match: { status: 'approved', isActive: true } },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: { views: -1, likesCount: -1, createdAt: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]);
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getPopularVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 GET TRENDING VIDEOS
// ============================================
const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 20, days = 7 } = req.query;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - parseInt(days));
    const videos = await Video.aggregate([
      { $match: { status: 'approved', isActive: true, createdAt: { $gte: sinceDate } } },
      { $addFields: { likesCount: { $size: '$likes' }, commentsCount: { $size: '$comments' }, sharesCount: { $size: '$shares' }, uniqueViewsCount: { $size: '$uniqueViews' } } },
      { $addFields: { trendingScore: { $add: [{ $multiply: ['$views', 1] }, { $multiply: ['$likesCount', 2] }, { $multiply: ['$commentsCount', 3] }, { $multiply: ['$sharesCount', 4] }, { $multiply: ['$uniqueViewsCount', 1.5] }] } } },
      { $sort: { trendingScore: -1, createdAt: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userData' } },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'channels', localField: 'channel', foreignField: '_id', as: 'channelData' } },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryData' } },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: { _id: '$userData._id', username: '$userData.username', avatar: '$userData.avatar', isPro: '$userData.isPro' },
          channel: { _id: '$channelData._id', name: '$channelData.name', avatar: { $cond: { if: { $isArray: '$channelData.avatar' }, then: { $arrayElemAt: ['$channelData.avatar.url', 0] }, else: '$channelData.avatar' } }, isVerified: '$channelData.isVerified' },
          category: { _id: '$categoryData._id', name: '$categoryData.name', slug: '$categoryData.slug', icon: '$categoryData.icon' }
        }
      },
      { $project: { userData: 0, channelData: 0, categoryData: 0 } }
    ]);
    res.json({ success: true, videos, metadata: { limit: parseInt(limit), days: parseInt(days), timestamp: new Date().toISOString() } });
  } catch (error) {
    console.error('Error getTrendingVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👤 GET USER VIDEOS
// ============================================
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const isOwner = currentUserId.toString() === userId;
    let query = { user: new mongoose.Types.ObjectId(userId) };
    if (!isOwner && !isAdmin) {
      query.status = 'approved';
    }
    if (filter === 'pending') {
      query.status = 'pending';
    } else if (filter === 'approved') {
      query.status = 'approved';
    }
    const videos = await Video.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('channel', 'name avatar isVerified _id').populate('user', 'username avatar').lean();
    const total = await Video.countDocuments(query);
    const pendingCount = await Video.countDocuments({ user: new mongoose.Types.ObjectId(userId), status: 'pending' });
    const approvedCount = await Video.countDocuments({ user: new mongoose.Types.ObjectId(userId), status: 'approved' });
    res.json({ success: true, videos, total, pendingCount, approvedCount, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), hasMore: skip + videos.length < total });
  } catch (error) {
    console.error('Error getUserVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🔍 FILTRAR VIDEOS COMERCIALES (PÚBLICO)
// ============================================
const filterCommercialVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, wilaya, commune, wholesale, minPrice, maxPrice, searchTerm, sortBy = 'recent' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { isCommercial: true, status: 'approved', isActive: true };
    
    if (category && category !== 'all') {
      if (mongoose.Types.ObjectId.isValid(category)) query.category = category;
      else { const categoryDoc = await Category.findOne({ slug: category }); if (categoryDoc) query.category = categoryDoc._id; }
    }
    if (wilaya) query.wilaya = wilaya;
    if (commune) query.commune = commune;
    if (wholesale !== undefined && wholesale !== '') query.wholesale = wholesale === 'true';
    if (minPrice || maxPrice) { query.price = {}; if (minPrice) query.price.$gte = parseFloat(minPrice); if (maxPrice) query.price.$lte = parseFloat(maxPrice); }
    if (searchTerm && searchTerm.trim() !== '') query.$or = [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }];
    
    let sort = {};
    switch(sortBy) {
      case 'price_asc': sort = { price: 1 }; break;
      case 'price_desc': sort = { price: -1 }; break;
      case 'popular': sort = { views: -1 }; break;
      default: sort = { createdAt: -1 };
    }
    
    const [videos, total] = await Promise.all([
      Video.find(query).sort(sort).skip(skip).limit(parseInt(limit)).populate('user', 'username avatar isPro').populate('channel', 'name avatar wilaya commune'),
      Video.countDocuments(query)
    ]);
    
    res.json({ success: true, videos, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), hasMore: skip + videos.length < total });
  } catch (error) {
    console.error('Error filterCommercialVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📍 VIDEOS CERCA DE UNA UBICACIÓN
// ============================================
const getVideosNearby = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000, limit = 20 } = req.query;
    if (!longitude || !latitude) return res.status(400).json({ success: false, message: 'Longitude et latitude sont requises' });
    
    const videos = await Video.aggregate([
      { $match: { isCommercial: true, status: 'approved', isActive: true, location: { $exists: true, $ne: null } } },
      { $addFields: { distance: { $sqrt: { $add: [ { $pow: [{ $subtract: [{ $arrayElemAt: ['$location.coordinates', 0] }, parseFloat(longitude)] }, 2] }, { $pow: [{ $subtract: [{ $arrayElemAt: ['$location.coordinates', 1] }, parseFloat(latitude)] }, 2] } ] } } } },
      { $match: { distance: { $lte: parseFloat(maxDistance) } } },
      { $sort: { distance: 1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'channels', localField: 'channel', foreignField: '_id', as: 'channel' } },
      { $unwind: { path: '$channel', preserveNullAndEmptyArrays: true } }
    ]);
    
    res.json({ success: true, videos, center: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) }, maxDistance: parseFloat(maxDistance) });
  } catch (error) {
    console.error('Error getVideosNearby:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👁️ GET VIDEO BY ID (PÚBLICO) - CON MENSAJE PARA PENDIENTE
// ============================================
const getVideoByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    
    const video = await Video.findById(id).populate('user', 'username avatar isPro').populate('channel', 'name avatar isVerified').lean();
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    if (video.status === 'pending') {
      return res.status(200).json({ success: false, video, message: '📹 Votre vidéo est en attente de validation.' });
    }
    
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ success: true, video: { ...video, liked: false } });
  } catch (error) {
    console.error('Error getVideoByIdPublic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👁️ GET VIDEO BY ID (PRIVADO - ADMIN/DUEÑO)
// ============================================
const getVideoByIdPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'ID inválido' });
    
    const video = await Video.findById(id).populate('user', 'username avatar isPro role').populate('channel', 'name avatar isVerified').lean();
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    const isOwner = video.user._id.toString() === req.user._id.toString();
    
    if (video.status === 'pending' && !isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Vous n\'avez pas la permission de voir cette vidéo' });
    }
    
    let liked = false;
    if (req.user && video.likes) liked = video.likes.some(likeId => likeId && likeId.toString() === req.user._id.toString());
    
    res.json({ success: true, video: { ...video, liked } });
  } catch (error) {
    console.error('Error getVideoByIdPrivate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📹 MIS VIDEOS COMERCIALES
// ============================================
const getMyCommercialVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.user._id;
    
    const videos = await Video.find({ user: userId, isCommercial: true }).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('user', 'username avatar');
    const total = await Video.countDocuments({ user: userId, isCommercial: true });
    
    const salesStats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), isCommercial: true } },
      { $group: { _id: null, totalProducts: { $sum: 1 }, averagePrice: { $avg: '$price' }, wholesaleCount: { $sum: { $cond: ['$wholesale', 1, 0] } } } }
    ]);
    
    res.json({ success: true, videos, stats: salesStats[0] || { totalProducts: 0, averagePrice: 0, wholesaleCount: 0 }, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Error getMyCommercialVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🏷️ TOGGLE VENTA AL MAYOR
// ============================================
const toggleWholesale = async (req, res) => {
  try {
    const { id } = req.params;
    const { wholesale, minQuantity } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'No autorizado' });
    if (!video.isCommercial) return res.status(400).json({ success: false, message: 'Solo disponible para videos comerciales' });
    
    if (wholesale !== undefined) video.wholesale = wholesale;
    if (minQuantity !== undefined && video.wholesale) video.minQuantity = minQuantity;
    await video.save();
    
    res.json({ success: true, message: video.wholesale ? 'Venta al mayor activada' : 'Venta al mayor desactivada', video: { wholesale: video.wholesale, minQuantity: video.minQuantity } });
  } catch (error) {
    console.error('Error toggleWholesale:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📦 ACTUALIZAR STOCK
// ============================================
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { total, available, reserved, operation } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'No autorizado' });
    if (!video.isCommercial) return res.status(400).json({ success: false, message: 'Solo disponible para videos comerciales' });
    
    if (!video.stock) video.stock = { total: 0, available: 0, reserved: 0 };
    
    if (operation === 'add') {
      video.stock.available += (total || 0);
      video.stock.total += (total || 0);
    } else if (operation === 'remove') {
      const quantity = total || 0;
      if (video.stock.available < quantity) return res.status(400).json({ success: false, message: 'Stock insuficiente' });
      video.stock.available -= quantity;
      video.stock.total -= quantity;
    } else {
      if (total !== undefined) video.stock.total = total;
      if (available !== undefined) video.stock.available = available;
      if (reserved !== undefined) video.stock.reserved = reserved;
    }
    
    await video.save();
    res.json({ success: true, message: 'Stock actualizado', stock: video.stock });
  } catch (error) {
    console.error('Error updateStock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📍 ACTUALIZAR UBICACIÓN DEL VIDEO
// ============================================
const updateVideoLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { wilaya, commune, longitude, latitude, address } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'No autorizado' });
    if (!video.isCommercial) return res.status(400).json({ success: false, message: 'Solo disponible para videos comerciales' });
    
    if (wilaya) video.wilaya = wilaya;
    if (commune) video.commune = commune;
    if (longitude && latitude) video.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)], address: address || '' };
    
    await video.save();
    res.json({ success: true, message: 'Ubicación actualizada', location: { wilaya: video.wilaya, commune: video.commune, coordinates: video.location.coordinates } });
  } catch (error) {
    console.error('Error updateVideoLocation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 👤 PERFIL DE USUARIO (ESTILO TIKTOK)
// ============================================
const getUserProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ success: false, message: 'ID inválido' });
    
    const user = await User.findById(userId).select('username avatar bio fullname isPro role followers following');
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    
    const followersCount = user.followers.length || 0;
    const followingCount = user.following.length || 0;
    let isFollowing = false;
    if (currentUserId && currentUserId.toString() !== userId) {
      isFollowing = user.followers.some(follower => follower.toString() === currentUserId.toString()) || false;
    }
    
    const videoStats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'approved', isActive: true } },
      { $group: { _id: null, totalVideos: { $sum: 1 }, totalLikes: { $sum: { $size: '$likes' } }, totalViews: { $sum: '$views' }, totalComments: { $sum: { $size: '$comments' } }, totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } } } }
    ]);
    
    const savedVideosCount = user.savedVideos.length || 0;
    
    res.json({ success: true, profile: {
      _id: user._id, username: user.username, avatar: user.avatar, bio: user.bio || '', fullname: user.fullname || user.username,
      isPro: user.isPro || false, role: user.role, followersCount, followingCount, isFollowing,
      videoStats: videoStats[0] || { totalVideos: 0, totalLikes: 0, totalViews: 0, totalComments: 0, totalShares: 0 }, savedVideosCount
    } });
  } catch (error) {
    console.error('Error getUserProfileStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📋 VIDEOS PENDIENTES (ADMIN)
// ============================================
const getVideosPendientesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, commercialOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const match = { status: 'pending', isActive: true };
    if (commercialOnly === 'true') match.isCommercial = true;
    
    const [videos, total, commercialStats, normalStats] = await Promise.all([
      Video.find(match).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('user', 'username email avatar isPro').lean(),
      Video.countDocuments(match),
      Video.countDocuments({ ...match, isCommercial: true }),
      Video.countDocuments({ ...match, isCommercial: false })
    ]);
    
    res.json({ success: true, videos, stats: { commercial: commercialStats, normal: normalStats, total }, pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    console.error('Error getVideosPendientesAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ APROBAR VIDEO (ADMIN)
// ============================================
const aprobarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    await video.approve(req.user._id);
    res.json({ success: true, message: 'Video aprobado correctamente', video });
  } catch (error) {
    console.error('Error aprobarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🗑️ ELIMINAR VIDEO (ADMIN)
// ============================================
const eliminarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    await video.softDelete(req.user._id, 'Eliminado por administrador');
    res.json({ success: true, message: 'Video eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📊 ESTADÍSTICAS DE ADMIN (OVERVIEW)
// ============================================
const getAdminVideoStats = async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const pendingVideos = await Video.countDocuments({ status: 'pending' });
    const commercialVideos = await Video.countDocuments({ isCommercial: true });
    const activeVideos = await Video.countDocuments({ isActive: true });
    
    const viewsThisMonth = await Video.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    const topVideos = await Video.find({ status: 'approved', isActive: true }).sort({ views: -1 }).limit(10).populate('user', 'username');
    
    res.json({ success: true, stats: { totalVideos, pendingVideos, commercialVideos, activeVideos, viewsThisMonth: viewsThisMonth[0].totalViews || 0 }, topVideos });
  } catch (error) {
    console.error('Error getAdminVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📊 ESTADÍSTICAS COMERCIALES (ADMIN)
// ============================================
const getCommercialStats = async (req, res) => {
  try {
    const stats = await Video.aggregate([
      { $match: { isCommercial: true } },
      { $group: { _id: null, totalCommercialVideos: { $sum: 1 }, averagePrice: { $avg: '$price' }, wholesaleCount: { $sum: { $cond: ['$wholesale', 1, 0] } } } }
    ]);
    
    const topWilayas = await Video.aggregate([
      { $match: { isCommercial: true, wilaya: { $ne: null, $ne: '' } } },
      { $group: { _id: '$wilaya', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({ success: true, stats: stats[0] || { totalCommercialVideos: 0, averagePrice: 0, wholesaleCount: 0 }, topWilayas });
  } catch (error) {
    console.error('Error getCommercialStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ⭐ DESTACAR VIDEO COMERCIAL (ADMIN)
// ============================================
const featureCommercialVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    if (!video.isCommercial) return res.status(400).json({ success: false, message: 'Solo se pueden destacar videos comerciales' });
    
    video.isFeatured = isFeatured !== undefined ? isFeatured : !video.isFeatured;
    await video.save();
    
    res.json({ success: true, message: video.isFeatured ? 'Video destacado' : 'Video eliminado de destacados', isFeatured: video.isFeatured });
  } catch (error) {
    console.error('Error featureCommercialVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 📹 OBTENER VIDEOS POR CANAL
// ============================================
const getChannelVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const isOwner = currentUserId.toString() === userId;
    
    let query = { user: new mongoose.Types.ObjectId(userId), status: 'approved' };
    if (isOwner || isAdmin) query = { user: new mongoose.Types.ObjectId(userId) };
    
    const [videos, total] = await Promise.all([
      Video.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('channel', 'name avatar isVerified').populate('user', 'username avatar'),
      Video.countDocuments(query)
    ]);
    
    res.json({ success: true, videos, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), hasMore: skip + videos.length < total });
  } catch (error) {
    console.error('Error getChannelVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  // EXISTENTES
  createVideo, updateVideo, deleteVideo, getVideoById, getVideo, toggleLikeVideo,
  shareVideo, trackWatchTime, getUserVideoStats, getMusicLibrary, filterVideos,
  getVideosByCategory, getFeaturedVideos, getPopularVideos, getTrendingVideos,
  getUserVideos,
  
  // ✅ NUEVAS FUNCIONES
  filterCommercialVideos,
  getVideosNearby,
  getVideoByIdPublic,
  getVideoByIdPrivate,
  getMyCommercialVideos,
  toggleWholesale,
  updateStock,
  updateVideoLocation,
  getUserProfileStats,
  getVideosPendientesAdmin,
  aprobarVideoAdmin,
  eliminarVideoAdmin,
  getAdminVideoStats,
  getCommercialStats,
  featureCommercialVideo,
  getChannelVideos
};