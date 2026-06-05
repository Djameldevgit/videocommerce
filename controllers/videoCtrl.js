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
      return { success: true }; // No es error, ya no existe
    } else {
      console.error(`❌ Error eliminando ${publicId}: ${result.result}`);
      return { success: false, error: result.result };
    }
  } catch (err) {
    console.error(`❌ Excepción eliminando ${publicId}:`, err.message);
    return { success: false, error: err.message };
  }
};

// backend/controllers/videoController.js
// ============================================
// CREATE VIDEO - VERSIÓN ACTUALIZADA
// ============================================
const createVideo = async (req, res) => {
  try {
    console.log("🔴 BODY RECIBIDO:", JSON.stringify(req.body, null, 2));

    const {
      titre,
      title: receivedTitle,
      description,
      category,
      videoUrl,
      videoPublicId,
      thumbnail,
      duration,
      music,
      // Campos comerciales
      isCommercial,
      saleType,      // 'retail', 'wholesale', 'both'
      address,
      mapUrl,
      // Canal
      channelId
    } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    const isAdmin = user.role === 'admin';
    const isProValid = user.isPro && (!user.proExpiryDate || new Date(user.proExpiryDate) > new Date());

    // ✅ LÍMITE DE DURACIÓN: 60 SEGUNDOS PARA TODOS
    const MAX_VIDEO_DURATION = 60; // 1 minuto máximo
    
    console.log(`📊 Validando duración: ${duration}s / Máximo: ${MAX_VIDEO_DURATION}s`);
    console.log(`👤 Usuario: ${user.email}, Role: ${user.role}, isPro: ${isProValid}, isAdmin: ${isAdmin}`);
    
    if (duration && duration > MAX_VIDEO_DURATION) {
      console.log(`❌ VIDEO RECHAZADO: ${duration}s > ${MAX_VIDEO_DURATION}s`);
      return res.status(400).json({
        success: false,
        message: `⏱️ La durée maximale est de ${MAX_VIDEO_DURATION} secondes (1 minute). Ta vidéo dure ${Math.floor(duration)} secondes.`
      });
    }

    // Validar título
    const finalTitle = titre || receivedTitle;
    if (!finalTitle || !finalTitle.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le titre est obligatoire' 
      });
    }

    // Validar categoría
    if (!category) {
      return res.status(400).json({ 
        success: false, 
        message: 'La catégorie est obligatoire' 
      });
    }
    
    const categoryDoc = await validateAndGetCategory(category);
    if (!categoryDoc) {
      return res.status(400).json({ 
        success: false, 
        message: `Catégorie invalide: ${category}` 
      });
    }

    // Validar videoUrl
    if (!videoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'La vidéo est obligatoire' 
      });
    }

    // Obtener el canal
    let channel;
    if (channelId) {
      channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ 
          success: false, 
          message: 'Canal non trouvé' 
        });
      }
      if (channel.owner.toString() !== userId.toString() && !isAdmin) {
        return res.status(403).json({ 
          success: false, 
          message: 'Vous n\'êtes pas propriétaire de ce canal' 
        });
      }
    } else {
      channel = await Channel.findOne({ owner: userId });
      if (!channel) {
        return res.status(400).json({ 
          success: false, 
          message: 'Vous n\'avez pas de canal. Créez-en un d\'abord.' 
        });
      }
    }

    console.log('📺 Canal sélectionné:', {
      id: channel._id,
      name: channel.name,
      owner: channel.owner
    });

    // Validar campos comerciales (si es video comercial)
    if (isCommercial === true || isCommercial === 'true') {
      // Validar wilaya y commune
      if (!channel.wilaya || !channel.commune) {
        return res.status(400).json({
          success: false,
          message: 'Pour les vidéos commerciales, le canal doit avoir une wilaya et une commune'
        });
      }
      
      // Validar contacto
      if (!channel.phone && !channel.email) {
        return res.status(400).json({
          success: false,
          message: 'Le canal doit avoir au moins un moyen de contact (téléphone ou email)'
        });
      }
      
      // Validar tipo de venta
      if (!saleType || !['retail', 'wholesale', 'both'].includes(saleType)) {
        return res.status(400).json({
          success: false,
          message: 'Le type de vente est obligatoire: retail (détail), wholesale (gros) ou both (les deux)'
        });
      }
    }

    // Procesar música (mezcla de audio)
    let finalVideoUrl = videoUrl;
    let finalThumbnail = thumbnail;
    let musicData = null;

    if (music && music.audioPublicId && videoPublicId) {
      console.log("🎵 TRAITEMENT DU MIX AUDIO...");
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
          id: music.id,
          title: music.title,
          artist: music.artist,
          audioUrl: music.audioUrl,
          audioPublicId: music.audioPublicId,
          volume: music.volume || 70,
          processed: true
        };
        console.log("✅ Mix audio réussi");
      } catch (err) {
        console.error('❌ Erreur dans le mix audio:', err);
        musicData = { ...music, processed: false, error: err.message };
      }
    } else if (music && music.audioUrl) {
      musicData = { ...music, processed: false };
    }

    // ✅ CREAR EL VIDEO
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
      // Campos comerciales
      saleType: (isCommercial === true || isCommercial === 'true') ? saleType : null,
      address: address || '',
      mapUrl: mapUrl || '',
      pendiente: isAdmin ? false : true
    });

    await newVideo.save();
    console.log('✅ Vidéo sauvegardée avec canal:', newVideo.channel);

    // Incrementar contador de videos en la categoría
    await Category.findByIdAndUpdate(categoryDoc._id, { $inc: { videoCount: 1 } });
    
    // Actualizar totalVideos del canal
    channel.totalVideos = await Video.countDocuments({ 
      channel: channel._id, 
      pendiente: false, 
      isActive: true 
    });
    await channel.save();

    // Poblar respuesta con datos relacionados
    const populatedVideo = await Video.findById(newVideo._id)
      .populate('channel', 'name avatar isVerified _id owner wilaya commune phone email')
      .populate('category', 'name slug icon')
      .populate('user', 'username avatar');

    console.log(`✅ Vidéo créée: ${populatedVideo._id}`);
    console.log(`   Canal: ${populatedVideo.channel.name || 'SANS CANAL'}`);

    res.status(201).json({
      success: true,
      message: isAdmin ? 'Vidéo créée avec succès' : 'Vidéo en attente d\'approbation',
      video: populatedVideo
    });

  } catch (error) {
    console.error('❌ Erreur dans createVideo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de la création de la vidéo' 
    });
  }
};


    // Resto del código igual...
// ============================================
// UPDATE VIDEO - VERSIÓN ACTUALIZADA
// ============================================
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      title: receivedTitle,
      description,
      category,
      music,
      videoUrl,
      videoPublicId,
      thumbnail,
      duration,
      isCommercial,
      // Nuevos campos comerciales
      saleType,
      address,
      mapUrl,
      tags,
      channelId
    } = req.body;

    console.log("🔴 ========== UPDATE VIDEO ==========");
    console.log("🔴 ID:", id);

    // 1. Obtener video
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
    let newChannel = null;
    if (channelId && channelId !== video.channel.toString()) {
      newChannel = await Channel.findById(channelId);
      if (!newChannel) {
        return res.status(404).json({ success: false, message: 'Nuevo canal no encontrado' });
      }
      if (newChannel.owner.toString() !== req.user._id.toString() && !isAdmin) {
        return res.status(403).json({ success: false, message: 'No eres dueño del nuevo canal' });
      }
      video.channel = newChannel._id;
      console.log(`🔄 Canal cambiado: ${currentChannel.name} → ${newChannel.name}`);
    }

    // Guardar categoría antigua
    const oldCategoryId = video.category ? video.category.toString() : null;
    let newCategoryId = null;

    // 2. Actualizar campos básicos
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

    // 3. Actualizar categoría
    if (category !== undefined) {
      if (!category) {
        return res.status(400).json({ success: false, message: 'La catégorie est obligatoire' });
      }
      const categoryDoc = await validateAndGetCategory(category);
      if (!categoryDoc) {
        return res.status(400).json({ success: false, message: `Catégorie invalide: ${category}` });
      }
      newCategoryId = categoryDoc._id;
      video.category = newCategoryId;
    }

    // 4. Actualizar campos comerciales (nuevos)
    if (isCommercial !== undefined) video.isCommercial = isCommercial;
    
    // Si el video es comercial, actualizamos saleType, address, mapUrl
    // Si se cambia isCommercial a false, limpiamos esos campos
    if (isCommercial === true) {
      if (saleType !== undefined) {
        if (!['retail', 'wholesale', 'both'].includes(saleType)) {
          return res.status(400).json({ success: false, message: 'saleType inválido: debe ser retail, wholesale o both' });
        }
        video.saleType = saleType;
      }
      if (address !== undefined) video.address = address;
      if (mapUrl !== undefined) video.mapUrl = mapUrl;
    } else if (isCommercial === false) {
      // Si ya no es comercial, limpiar los campos comerciales
      video.saleType = null;
      video.address = '';
      video.mapUrl = '';
    } else {
      // Si no se envía isCommercial, actualizamos igualmente los campos si vienen
      if (saleType !== undefined) {
        if (!['retail', 'wholesale', 'both'].includes(saleType)) {
          return res.status(400).json({ success: false, message: 'saleType inválido' });
        }
        video.saleType = saleType;
      }
      if (address !== undefined) video.address = address;
      if (mapUrl !== undefined) video.mapUrl = mapUrl;
    }

    // 5. Manejo de música (igual que original)
    const cleanUrlFromTransformations = (url) => {
      if (!url) return url;
      let cleanUrl = url;
      cleanUrl = cleanUrl.replace(/\/l_audio:[^/]+,fl_layer_apply\//g, '/');
      cleanUrl = cleanUrl.replace(/\/upload\/l_audio:[^,]+,fl_layer_apply\//, '/upload/');
      return cleanUrl.replace(/\/l_audio:[^/]+,fl_layer_apply\//g, '/');
    };

    let finalVideoUrl = video.videoUrl;

    if (music !== undefined && music !== null) {
      if (music === null) {
        video.music = null;
        console.log("🎵 Música eliminada");
      } else if (music.audioPublicId) {
        console.log("🎵 Regenerando mezcla de audio...");
        let baseVideoUrl = videoUrl || video.videoUrl;
        baseVideoUrl = cleanUrlFromTransformations(baseVideoUrl);
        try {
          const formattedAudioId = music.audioPublicId.replace(/\//g, ':');
          const uploadIndex = baseVideoUrl.indexOf('/upload/');
          if (uploadIndex !== -1) {
            const base = baseVideoUrl.substring(0, uploadIndex + 8);
            const pathAndFile = baseVideoUrl.substring(uploadIndex + 8);
            const transformation = `l_audio:${formattedAudioId},fl_layer_apply`;
            finalVideoUrl = `${base}${transformation}/${pathAndFile}`;
            const newThumbnail = finalVideoUrl.replace(/\.(mp4|mov|webm)$/, '.jpg');
            if (newThumbnail !== video.thumbnail && !thumbnail) {
              video.thumbnail = newThumbnail;
            }
            video.music = {
              id: music.id || null,
              title: music.title || null,
              artist: music.artist || null,
              audioUrl: music.audioUrl,
              audioPublicId: music.audioPublicId,
              duration: music.duration || null,
              volume: music.volume !== undefined ? music.volume : 70,
              processed: true
            };
          } else {
            throw new Error('No se encontró /upload/ en la URL');
          }
        } catch (err) {
          console.error('❌ Error en mezcla de audio:', err);
          video.music = { ...music, processed: false, error: err.message };
          finalVideoUrl = baseVideoUrl;
        }
      } else if (music.audioUrl) {
        video.music = { ...music, processed: false };
      }
    }

    if (finalVideoUrl !== video.videoUrl) {
      video.videoUrl = finalVideoUrl;
    }

    // 6. Guardar cambios
    await video.save();
    console.log("✅ Video guardado correctamente");

    // 7. Actualizar contadores de categoría
    if (oldCategoryId && newCategoryId && oldCategoryId !== newCategoryId.toString()) {
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { videoCount: -1 } });
      await Category.findByIdAndUpdate(newCategoryId, { $inc: { videoCount: 1 } });
    } else if (newCategoryId && !oldCategoryId) {
      await Category.findByIdAndUpdate(newCategoryId, { $inc: { videoCount: 1 } });
    } else if (oldCategoryId && !newCategoryId) {
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { videoCount: -1 } });
    }

    // 8. Actualizar estadísticas de los canales
    if (currentChannel) {
      await currentChannel.updateStats();
    }
    if (newChannel) {
      await newChannel.updateStats();
    } else {
      await currentChannel.updateStats();
    }

    // 9. Poblar respuesta
    const updatedVideo = await Video.findById(video._id)
      .populate('channel', 'name avatar isVerified _id owner')
      .populate('category', 'name slug icon')
      .populate('user', 'username avatar');

    console.log("📤 Video actualizado:", updatedVideo._id, updatedVideo.title);
    console.log(`   Canal: ${updatedVideo.channel.name || 'NO CHANNEL'}`);

    res.json({
      success: true,
      message: 'Video actualizado correctamente',
      video: updatedVideo
    });

  } catch (error) {
    console.error('❌ Error updateVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener video con canal poblado
    const video = await Video.findById(id).populate('channel');
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const isOwner = video.channel.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // Eliminar de Cloudinary si existe
    const deletionErrors = [];
    if (video.videoPublicId) {
      const result = await deleteFromCloudinary(video.videoPublicId, 'video');
      if (!result.success) deletionErrors.push(`Video: ${result.error}`);
    }
    if (video.thumbnail && video.thumbnail.includes('cloudinary.com')) {
      let publicId = video.thumbnail.split('/').pop().split('.')[0];
      const match = video.thumbnail.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
      if (match) publicId = match[1];
      const result = await deleteFromCloudinary(publicId, 'image');
      if (!result.success) deletionErrors.push(`Miniatura: ${result.error}`);
    }

    // Eliminar el video de la BD
    await video.deleteOne();

    // Actualizar contador de videos del canal
    const channel = await Channel.findById(video.channel._id);
    if (channel) {
      channel.totalVideos = await Video.countDocuments({
        channel: channel._id,
        pendiente: false,
        isActive: true
      });
      await channel.save();
    }

    // Actualizar contador de la categoría
    if (video.category) {
      await Category.findByIdAndUpdate(video.category, { $inc: { videoCount: -1 } });
    }

    const message = deletionErrors.length
      ? `Video eliminado de BD, pero con problemas en Cloudinary: ${deletionErrors.join(', ')}`
      : 'Video eliminado correctamente';

    res.json({ success: true, message, warnings: deletionErrors.length ? deletionErrors : undefined });
  } catch (error) {
    console.error('❌ Error deleteVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const validateAndGetCategory = async (categoryIdOrSlug) => {
  if (!categoryIdOrSlug) return null;
  
  let category = null;
  
  // Si es ObjectId válido, buscar por ID
  if (mongoose.Types.ObjectId.isValid(categoryIdOrSlug)) {
    category = await Category.findById(categoryIdOrSlug);
  }
  
  // Si no se encontró por ID, buscar por slug
  if (!category && typeof categoryIdOrSlug === 'string') {
    category = await Category.findOne({ slug: categoryIdOrSlug });
  }
  
  // Si no se encontró por slug, buscar por nombre
  if (!category && typeof categoryIdOrSlug === 'string') {
    category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryIdOrSlug}$`, 'i') } });
  }
  
  return category;
};


const JAMENDO_CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '9dee24cd';
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0/tracks/';


const getMusicLibrary = async (req, res) => {
  const query = req.query.q || 'background';
  const limit = parseInt(req.query.limit) || 20;
  const perPage = Math.min(limit, 50);

  try {
    const response = await axios.get(JAMENDO_API_URL, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: perPage,
        search: query,
        include: 'musicinfo'
      },
      timeout: 10000
    });

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      return res.json({ success: true, hits: [], message: 'Aucun résultat' });
    }

    const hits = response.data.results.map(track => ({
      id: track.id,
      title: track.name,
      user: track.artist_name,
      duration: track.duration,
      audio: track.audio,
      thumbnail: track.album_image || '',
      genre: track.genre || '',
      tags: track.tags || ''
    }));

    res.json({ success: true, hits });
  } catch (error) {
    console.error('❌ Error al buscar en Jamendo:', error.message);
    res.status(200).json({ success: true, hits: [], message: 'Servicio de música no disponible momentáneamente' });
  }
};

// backend/controllers/videoController.js
// backend/controllers/videoController.js - CORREGIDO

const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Canal no encontrado' });
    }

    const match = { channel: channel._id, pendiente: false, isActive: true };
    const isOwnerOrAdmin = req.user && (channel.owner.toString() === req.user._id.toString() || req.user.role === 'admin');
    if (!isOwnerOrAdmin) match.pendiente = false;

    // ✅ CORREGIDO: Usar aggregate para transformar el avatar del canal
    const videos = await Video.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      // ✅ Populate user
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      // ✅ Populate channel
      {
        $lookup: {
          from: 'channels',
          localField: 'channel',
          foreignField: '_id',
          as: 'channelData'
        }
      },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      // ✅ TRANSFORMAR AVATAR DEL CANAL (array a string)
      {
        $addFields: {
          user: {
            _id: '$userData._id',
            username: '$userData.username',
            avatar: '$userData.avatar'
          },
          channel: {
            _id: '$channelData._id',
            name: '$channelData.name',
            isVerified: '$channelData.isVerified',
            // ✅ Extraer la primera URL del avatar del array
            avatar: {
              $cond: {
                if: { $isArray: '$channelData.avatar' },
                then: { $arrayElemAt: ['$channelData.avatar.url', 0] },
                else: '$channelData.avatar'
              }
            }
          }
        }
      },
      {
        $project: {
          userData: 0,
          channelData: 0
        }
      }
    ]);

    const total = await Video.countDocuments(match);

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    console.error('❌ Error en getChannelVideos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
  
// ============================================
// 🗑️ ELIMINAR VIDEO (CORREGIDO USANDO videoPublicId)
// ============================================
 

const getCategoriesForSlider = async (req, res) => {
  try {
    console.log('🎠 Obteniendo categorías para slider...');
    
    const categories = await Category.find({ isActive: true })
      .select('_id name slug icon iconType iconColor bgColor order videoCount')
      .sort({ order: 1 })
      .lean();
    
    console.log(`🎠 Slider: ${categories.length} categorías encontradas`);
    
    res.json({
      success: true,
      categories,
      total: categories.length
    });
    
  } catch (error) {
    console.error('❌ Error en getCategoriesForSlider:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar categorías para slider',
      error: error.message
    });
  }
};
 

const filterCommercialVideos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      wilaya,
      commune,
      wholesale,
      minPrice,
      maxPrice,
      searchTerm,
      sortBy = 'recent'
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query
    const query = { 
      isCommercial: true, 
      pendiente: false, 
      isActive: true 
    };
    
    if (category && category !== 'all') query.category = category;
    if (wilaya) query.wilaya = wilaya;
    if (commune) query.commune = commune;
    if (wholesale !== undefined && wholesale !== '') query.wholesale = wholesale === 'true';
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { wilaya: { $regex: searchTerm, $options: 'i' } },
        { commune: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    // Ordenamiento
    let sort = {};
    switch(sortBy) {
      case 'price_asc': sort = { price: 1 }; break;
      case 'price_desc': sort = { price: -1 }; break;
      case 'popular': sort = { views: -1 }; break;
      case 'recent': sort = { createdAt: -1 }; break;
      default: sort = { createdAt: -1 };
    }
    
    const [videos, total] = await Promise.all([
      Video.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'username avatar isPro'),
      Video.countDocuments(query)
    ]);
    
    // Estadísticas de filtro
    const stats = await Video.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        avgPrice: { $avg: '$price' },
        minPriceFound: { $min: '$price' },
        maxPriceFound: { $max: '$price' },
        totalCommercial: { $sum: 1 }
      }}
    ]);
    
    res.json({
      success: true,
      videos,
      filters: { category, wilaya, commune, wholesale, minPrice, maxPrice, searchTerm },
      stats: stats[0] || { avgPrice: 0, minPriceFound: 0, maxPriceFound: 0, totalCommercial: total },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + videos.length < total
      }
    });
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
    const { longitude, latitude } = req.query;
    const { maxDistance = 10000, limit = 20 } = req.query; // 10km por defecto
    
    if (!longitude || !latitude) {
      return res.status(400).json({ 
        success: false, 
        message: 'Longitude et latitude sont requises' 
      });
    }
    
    const videos = await Video.findNearby(
      parseFloat(longitude), 
      parseFloat(latitude), 
      parseInt(maxDistance), 
      parseInt(limit)
    );
    
    res.json({
      success: true,
      videos,
      center: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
      maxDistance: parseInt(maxDistance)
    });
  } catch (error) {
    console.error('Error getVideosNearby:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 
const getVideoByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 getVideoByIdPublic llamado con ID:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de vidéo invalide' 
      });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro')
      .lean();

    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vidéo non trouvée' 
      });
    }

    console.log('📹 Video encontrado:', { 
      id: video._id, 
      pendiente: video.pendiente, 
      title: video.title 
    });

    // ✅ Si está pendiente - devolver el video con su campo pendiente=true
    if (video.pendiente === true) {
      return res.status(200).json({ 
        success: false,
        video: video,  // Enviamos el video COMPLETO con su campo pendiente
        message: '📹 Votre vidéo a été envoyée aux administrateurs pour validation. Vous serez notifié dès qu\'elle sera publiée.'
      });
    }

    // ✅ Solo incrementar views si está aprobado
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    const videoData = { ...video, liked: false };
    res.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Error getVideoByIdPublic:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du chargement de la vidéo' 
    });
  }
};
// ✅ Para ADMIN/DUEÑO - Puede ver videos pendientes
const getVideoByIdPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro')
      .lean();

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    const isOwner = video.user._id.toString() === req.user._id.toString();

    // ✅ Verificar permisos
    if (video.pendiente === true && !isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous n\'avez pas la permission de voir cette vidéo' 
      });
    }

    // ✅ Mensaje especial para el dueño si está pendiente
    if (video.pendiente === true && isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '📹 Votre vidéo est en attente d\'approbation par un administrateur. Vous serez notifié dès qu\'elle sera publiée.',
        pending: true
      });
    }

    // ✅ Incrementar views (solo si no es admin viendo pendiente)
    if (!video.pendiente || isAdmin) {
      Video.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
      Video.findByIdAndUpdate(id, { $addToSet: { uniqueViews: req.user._id } }).exec();
    }

    let liked = false;
    if (req.user && req.user._id && video.likes) {
      const userIdStr = req.user._id.toString();
      liked = video.likes.some(likeId => likeId && likeId.toString() === userIdStr);
    }

    const videoData = { ...video, liked };
    res.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Error getVideoByIdPrivate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Obtener video por ID
// ✅ Versión corregida de getVideoById
// ============================================
// 👁️ OBTENER VIDEO POR ID (SIN DEPENDER DE req.user)
// ============================================
// backend/controllers/videoController.js
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    
    // ✅ CORREGIDO: Poblar channel
    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro')
      .populate('channel', 'name avatar isVerified _id owner wilaya commune phone email')  // ← Poblar canal
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

// ✅ Videos destacados
const getFeaturedVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.find({ 
      isFeatured: true, 
      pendiente: false, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username avatar isPro');
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getFeaturedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Videos populares
const getPopularVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.aggregate([
      { $match: { pendiente: false, isActive: true } },
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

 
 
const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('📤 shareVideo llamado para ID:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de vidéo invalide' 
      });
    }

    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vidéo non trouvée' 
      });
    }

    // ✅ Debug: verificar que el método existe
    console.log('✅ Video encontrado, tipo de share:', typeof video.share);
    console.log('✅ Métodos disponibles:', Object.keys(video.__proto__));

    if (typeof video.share !== 'function') {
      console.error('❌ ERROR: video.share NO es una función');
      return res.status(500).json({ 
        success: false, 
        message: 'Error interno: método share no disponible' 
      });
    }

    const { shared, sharesCount } = await video.share(req.user._id);
    
    console.log(`📤 Video ${id} - ${shared ? 'Compartido' : 'Dejó de compartir'}`);
    console.log(`📊 Total shares: ${sharesCount}`);

    res.json({ 
      success: true, 
      shares: sharesCount, 
      shared 
    });
    
  } catch (error) {
    console.error('❌ Error en shareVideo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getUserVideoStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false } },
      { $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } },
        totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } },
        avgEngagement: { $avg: '$engagementScore' },
        totalWatchTime: { $sum: { $ifNull: ['$watchTime', 0] } },
        // ✅ NUEVOS: Estadísticas comerciales
        commercialVideos: { $sum: { $cond: ['$isCommercial', 1, 0] } },
        totalSalesValue: { $sum: { $cond: ['$isCommercial', '$price', 0] } },
        avgPrice: { $avg: { $cond: ['$isCommercial', '$price', null] } }
      }}
    ]);
    
    const videosByCategory = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false } },
      { $group: { 
        _id: '$category', 
        count: { $sum: 1 }, 
        totalViews: { $sum: '$views' } 
      }},
      { $sort: { count: -1 } }
    ]);
    
    // ✅ NUEVO: Videos por wilaya
    const videosByWilaya = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false, isCommercial: true } },
      { $group: { 
        _id: '$wilaya', 
        count: { $sum: 1 },
        totalValue: { $sum: '$price' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      stats: stats[0] || { 
        totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0, 
        totalShares: 0, avgEngagement: 0, totalWatchTime: 0,
        commercialVideos: 0, totalSalesValue: 0, avgPrice: 0
      },
      videosByCategory,
      videosByWilaya: videosByWilaya.filter(w => w._id) // Filtrar nulls
    });
  } catch (error) {
    console.error('Error getUserVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== FUNCIONES DE ADMIN ==========

// ✅ Obtener videos pendientes (ADMIN)
const getVideosPendientesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, commercialOnly = false } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const match = { pendiente: true, isActive: true };
    if (commercialOnly === 'true') {
      match.isCommercial = true;
    }
    
    // Ejecutar consultas en paralelo
    const [videos, total, commercialStats, normalStats] = await Promise.all([
      Video.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'username email avatar isPro')
        .lean(),
      Video.countDocuments(match),
      Video.countDocuments({ ...match, isCommercial: true }),
      Video.countDocuments({ ...match, isCommercial: false })
    ]);
    
    console.log('📊 Estadísticas pendientes:', { 
      commercial: commercialStats, 
      normal: normalStats, 
      total 
    });
    
    res.json({
      success: true,
      videos,
      stats: {
        commercial: commercialStats,
        normal: normalStats,
        total
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getVideosPendientesAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Aprobar video (ADMIN)
// En videoCtrl.js - aprobarVideoAdmin
const aprobarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('user', 'username email avatar');
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    video.pendiente = false;
    await video.save();
    
    // ✅ Devolver el video con el usuario poblado para las notificaciones
    res.json({ success: true, message: 'Video aprobado correctamente', video });
  } catch (error) {
    console.error('Error aprobarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar video (ADMIN)
const eliminarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    if (video.videoType === 'local' && video.videoId) {
      await cloudinary.uploader.destroy(video.videoId, { resource_type: 'video' });
    }
    if (video.thumbnail && video.thumbnail.includes('cloudinary.com')) {
      let publicId = video.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
    
    await video.deleteOne();
    res.json({ success: true, message: 'Video eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Ya existe en tu controlador
const trackWatchTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    await video.updateWatchTime(req.user._id, watchTime);
    res.json({ success: true, averageWatchTime: video.averageWatchTime });
  } catch (error) {
    console.error('Error trackWatchTime:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ CORREGIDO - deleteCommentCtrl
 
// ✅ NUEVO - Editar comentario
 

// controllers/videoCtrl.js - AGREGAR ESTAS FUNCIONES

// ✅ Obtener perfil completo de usuario con estadísticas (estilo TikTok)
const getUserProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    
    // Obtener información del usuario
    const user = await User.findById(userId)
      .select('username avatar bio fullname isPro role followers following');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    // Contar seguidores y siguiendo
    const followersCount = user.followers.length || 0;
    const followingCount = user.following.length || 0;
    
    // Verificar si el usuario actual sigue a este usuario
    let isFollowing = false;
    if (currentUserId && currentUserId.toString() !== userId) {
      isFollowing = user.followers.some(
        follower => follower.toString() === currentUserId.toString()
      ) || false;
    }
    
    // Obtener estadísticas de videos del usuario
    const videoStats = await Video.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          pendiente: false,
          isActive: true 
        } 
      },
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
    
    // Para videos guardados (favoritos) - necesitas un modelo de favoritos
    // Por ahora simulamos con la colección de favoritos del usuario
    let savedVideosCount = 0;
    if (user.savedVideos) {
      savedVideosCount = user.savedVideos.length;
    }
    
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
        followersCount,
        followingCount,
        isFollowing,
        videoStats: {
          totalVideos: videoStats[0].totalVideos || 0,
          totalLikes: videoStats[0].totalLikes || 0,
          totalViews: videoStats[0].totalViews || 0,
          totalComments: videoStats[0].totalComments || 0,
          totalShares: videoStats[0].totalShares || 0
        },
        savedVideosCount
      }
    });
  } catch (error) {
    console.error('Error getUserProfileStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos guardados/favoritos del usuario
const getUserSavedVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const currentUserId = req.user._id;
    
    // Verificar permisos: solo el dueño puede ver videos guardados
    if (!currentUserId || currentUserId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez pas voir les vidéos sauvegardées d\'un autre utilisateur' 
      });
    }
    
    const user = await User.findById(userId).select('savedVideos');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    const savedVideoIds = user.savedVideos || [];
    const total = savedVideoIds.length;
    
    // Obtener videos paginados
    const paginatedIds = savedVideoIds.slice(skip, skip + parseInt(limit));
    
    const videos = await Video.find({ 
      _id: { $in: paginatedIds },
      pendiente: false,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar isPro')
      .lean();
    
    // Reordenar según el orden original
    const orderedVideos = paginatedIds.map(id => 
      videos.find(v => v._id.toString() === id.toString())
    ).filter(v => v);
    
    res.json({
      success: true,
      videos: orderedVideos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + orderedVideos.length < total
    });
  } catch (error) {
    console.error('Error getUserSavedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos que le han dado like al usuario (videos liked por el usuario)
const getUserLikedVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const currentUserId = req.user._id;
    
    // Verificar permisos
    if (!currentUserId || currentUserId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez pas voir les vidéos aimées d\'un autre utilisateur' 
      });
    }
    
    // Buscar videos donde el usuario haya dado like
    const videos = await Video.find({
      likes: { $in: [new mongoose.Types.ObjectId(userId)] },
      pendiente: false,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar isPro')
      .lean();
    
    const total = await Video.countDocuments({
      likes: { $in: [new mongoose.Types.ObjectId(userId)] },
      pendiente: false,
      isActive: true
    });
    
    // Marcar que el usuario ya dio like a estos videos
    const videosWithLiked = videos.map(v => ({
      ...v,
      liked: true
    }));
    
    res.json({
      success: true,
      videos: videosWithLiked,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total
    });
  } catch (error) {
    console.error('Error getUserLikedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Seguir/Dejar de seguir usuario
// controllers/videoCtrl.js - CORREGIR toggleFollowUser

// ✅ Seguir/Dejar de seguir usuario
const toggleFollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'No puedes seguirte a ti mismo' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const currentUser = await User.findById(currentUserId);

    // ✅ CORREGIDO: Asegurar que followers y following existen
    const followersList = userToFollow.followers || [];
    const followingList = currentUser.following || [];

    const isFollowing = followersList.some(id => id && id.toString() === currentUserId.toString());

    if (isFollowing) {
      // Dejar de seguir
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId }
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId }
      });
    } else {
      // Seguir
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId }
      });
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId }
      });
    }

    // Obtener el nuevo conteo
    const updatedUser = await User.findById(userId);
    const followersCount = (updatedUser.followers || []).length;

    res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount
    });
  } catch (error) {
    console.error('Error toggleFollowUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Guardar/Quitar video de favoritos
const toggleSaveVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const user = await User.findById(userId);
    const isSaved = user.savedVideos.includes(videoId);
    
    if (isSaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { savedVideos: videoId }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedVideos: videoId }
      });
    }
    
    res.json({
      success: true,
      isSaved: !isSaved
    });
  } catch (error) {
    console.error('Error toggleSaveVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✏️ ACTUALIZAR VIDEO (SOLO DUEÑO O ADMIN)
// ============================================
// ============================================
// ✏️ ACTUALIZAR VIDEO (CON MEZCLA DE AUDIO)
// ============================================
// ============================================
// ✏️ ACTUALIZAR VIDEO (CON REGENERACIÓN DE AUDIO)
// ============================================
// ============================================
// ✏️ ACTUALIZAR VIDEO (CON REGENERACIÓN DE AUDIO)
// ============================================
 
const getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`📹 Buscando video con ID: ${id}`);
    console.log(`📹 Usuario autenticado:`, req.user ? req.user.username : 'No autenticado');
    
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID de video inválido' });
    }
    
    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role bio')
      .populate('comments.user', 'username avatar');
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    // ✅ MANEJO SEGURO - Verificar si req.user existe
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    const isOwner = req.user && video.user._id.toString() === req.user._id.toString();
    
    console.log(`📹 Video: ${video.title}`);
    console.log(`📹 Pendiente: ${video.pendiente}`);
    console.log(`📹 isAdmin: ${isAdmin}`);
    console.log(`📹 isOwner: ${isOwner}`);
    
    // Si el video está pendiente y no es admin ni dueño
    if (video.pendiente === true && !isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'Este video está pendiente de aprobación' 
      });
    }
    
    // Incrementar vista solo si hay usuario autenticado y no es el dueño
    if (req.user && !isOwner) {
      video.views = (video.views || 0) + 1;
      await video.save();
    }
    
    res.json({ success: true, video });
  } catch (error) {
    console.error('❌ Error en getVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Filtrar videos - SIN categorías obligatorias
// controllers/videoCtrl.js

// backend/controllers/videoController.js
// backend/controllers/videoController.js - filterVideos
const filterVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12, searchTerm, sortBy = 'recent', category, wilaya } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let match = { pendiente: false, isActive: true };
    if (searchTerm) match.title = { $regex: searchTerm, $options: 'i' };
    if (category && mongoose.Types.ObjectId.isValid(category)) match.category = category;
    if (wilaya) match.wilaya = wilaya;

    let sort = {};
    if (sortBy === 'popular') sort = { views: -1 };
    else if (sortBy === 'liked') sort = { likesCount: -1 };
    else sort = { createdAt: -1 };

    // ✅ USAR AGGREGATE CORREGIDO
    const videos = await Video.aggregate([
      { $match: match },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sort },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'channels',
          localField: 'channel',
          foreignField: '_id',
          as: 'channelData'
        }
      },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: {
            _id: '$userData._id',
            username: '$userData.username',
            avatar: '$userData.avatar'
          },
          channel: {
            _id: '$channelData._id',
            name: '$channelData.name',
            isVerified: '$channelData.isVerified',
            // ✅ Extraer avatar del array
            avatar: {
              $cond: {
                if: { $isArray: '$channelData.avatar' },
                then: { $arrayElemAt: ['$channelData.avatar.url', 0] },
                else: '$channelData.avatar'
              }
            }
          }
        }
      },
      {
        $project: {
          userData: 0,
          channelData: 0
        }
      }
    ]);

    const total = await Video.countDocuments(match);
    
    res.json({ 
      success: true, 
      videos, 
      total, 
      page: parseInt(page), 
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total
    });
  } catch (err) {
    console.error('Error en filterVideos:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// backend/controllers/categoryController.js (o donde tengas esta función)
// Asegúrate que ESTA es la función que se está llamando

// backend/controllers/categoryCtrl.js
// BUSCA Y CORRIGE esta función:

const getVideosByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12, sortBy = 'recent' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const category = await Category.findOne({ slug: slug, isActive: true });
    if (!category) {
      return res.json({ success: true, videos: [], total: 0, categoryInfo: null });
    }
    
    let filter = { category: category._id, pendiente: false, isActive: true };
    let sort = {};
    
    switch (sortBy) {
      case 'views': sort = { views: -1 }; break;
      case 'likes': sort = { likesCount: -1 }; break;
      default: sort = { createdAt: -1 };
    }
    
    // ✅ USAR AGGREGATE CON TRANSFORMACIÓN DE AVATAR
    const videos = await Video.aggregate([
      { $match: filter },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sort },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userData'
        }
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'channels',
          localField: 'channel',
          foreignField: '_id',
          as: 'channelData'
        }
      },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user: {
            _id: '$userData._id',
            username: '$userData.username',
            avatar: '$userData.avatar'
          },
          channel: {
            _id: '$channelData._id',
            name: '$channelData.name',
            isVerified: '$channelData.isVerified',
            // ✅ Extraer avatar del array
            avatar: {
              $cond: {
                if: { $isArray: '$channelData.avatar' },
                then: { $arrayElemAt: ['$channelData.avatar.url', 0] },
                else: '$channelData.avatar'
              }
            }
          }
        }
      },
      {
        $project: {
          userData: 0,
          channelData: 0
        }
      }
    ]);
    
    const total = await Video.countDocuments(filter);
    
    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total,
      categoryInfo: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        iconColor: category.iconColor
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getVideosByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ============================================
// 🆕 OBTENER MIS VIDEOS COMERCIALES
// ============================================
const getMyCommercialVideos = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userId = req.user._id;
    
    const videos = await Video.find({ 
      user: userId, 
      isCommercial: true,
      pendiente: false 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar');
    
    const total = await Video.countDocuments({ 
      user: userId, 
      isCommercial: true 
    });
    
    // Estadísticas de ventas comerciales
    const salesStats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), isCommercial: true } },
      { $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        totalInventoryValue: { $sum: { $multiply: ['$price', '$stock.available'] } },
        wholesaleCount: { $sum: { $cond: ['$wholesale', 1, 0] } }
      }}
    ]);
    
    res.json({
      success: true,
      videos,
      stats: salesStats[0] || { totalProducts: 0, averagePrice: 0, totalInventoryValue: 0, wholesaleCount: 0 },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error getMyCommercialVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 TOGGLE VENTA AL MAYOR
// ============================================
const toggleWholesale = async (req, res) => {
  try {
    const { id } = req.params;
    const { wholesale, minQuantity } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    
    if (!video.isCommercial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta funcionalidad solo está disponible para videos comerciales' 
      });
    }
    
    if (wholesale !== undefined) video.wholesale = wholesale;
    if (minQuantity !== undefined && video.wholesale) video.minQuantity = minQuantity;
    
    await video.save();
    
    res.json({
      success: true,
      message: video.wholesale ? 'Venta al mayor activada' : 'Venta al mayor desactivada',
      video: {
        wholesale: video.wholesale,
        minQuantity: video.minQuantity
      }
    });
  } catch (error) {
    console.error('Error toggleWholesale:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 ACTUALIZAR STOCK
// ============================================
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { total, available, reserved, operation } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    
    if (!video.isCommercial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta funcionalidad solo está disponible para videos comerciales' 
      });
    }
    
    // Operaciones de stock
    if (operation === 'add') {
      video.stock.available += (total || 0);
      video.stock.total += (total || 0);
    } else if (operation === 'remove') {
      const quantity = total || 0;
      if (video.stock.available < quantity) {
        return res.status(400).json({ 
          success: false, 
          message: 'Stock insuficiente' 
        });
      }
      video.stock.available -= quantity;
      video.stock.total -= quantity;
    } else {
      if (total !== undefined) video.stock.total = total;
      if (available !== undefined) video.stock.available = available;
      if (reserved !== undefined) video.stock.reserved = reserved;
    }
    
    await video.save();
    
    res.json({
      success: true,
      message: 'Stock actualizado correctamente',
      stock: video.stock
    });
  } catch (error) {
    console.error('Error updateStock:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 ACTUALIZAR UBICACIÓN DEL VIDEO
// ============================================
const updateVideoLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { wilaya, commune, longitude, latitude, address } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    
    if (!video.isCommercial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Esta funcionalidad solo está disponible para videos comerciales' 
      });
    }
    
    if (wilaya) video.wilaya = wilaya;
    if (commune) video.commune = commune;
    
    if (longitude && latitude) {
      video.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address: address || `${commune || video.commune}, ${wilaya || video.wilaya}`,
        googleMapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
      };
    }
    
    await video.save();
    
    res.json({
      success: true,
      message: 'Ubicación actualizada correctamente',
      location: {
        wilaya: video.wilaya,
        commune: video.commune,
        coordinates: video.location.coordinates,
        mapUrl: video.location.googleMapsUrl
      }
    });
  } catch (error) {
    console.error('Error updateVideoLocation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 ESTADÍSTICAS COMERCIALES PARA ADMIN
// ============================================
const getCommercialStats = async (req, res) => {
  try {
    const stats = await Video.aggregate([
      { $match: { isCommercial: true } },
      { $group: {
        _id: null,
        totalCommercialVideos: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        totalInventoryValue: { $sum: { $multiply: ['$price', '$stock.available'] } },
        wholesaleCount: { $sum: { $cond: ['$wholesale', 1, 0] } },
        pickupOnlyCount: { $sum: { $cond: ['$pickupOnly', 1, 0] } },
        deliveryCount: { $sum: { $cond: ['$delivery.available', 1, 0] } }
      }}
    ]);
    
    const topWilayas = await Video.aggregate([
      { $match: { isCommercial: true, wilaya: { $ne: null, $ne: '' } } },
      { $group: {
        _id: '$wilaya',
        count: { $sum: 1 },
        totalValue: { $sum: '$price' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    const topCategories = await Video.aggregate([
      { $match: { isCommercial: true, category: { $ne: null, $ne: '' } } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' }
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      stats: stats[0] || {
        totalCommercialVideos: 0,
        averagePrice: 0,
        totalInventoryValue: 0,
        wholesaleCount: 0,
        pickupOnlyCount: 0,
        deliveryCount: 0
      },
      topWilayas,
      topCategories
    });
  } catch (error) {
    console.error('Error getCommercialStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 DESTACAR VIDEO COMERCIAL (ADMIN)
// ============================================
const featureCommercialVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    if (!video.isCommercial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Solo se pueden destacar videos comerciales' 
      });
    }
    
    video.isFeatured = isFeatured !== undefined ? isFeatured : !video.isFeatured;
    await video.save();
    
    res.json({
      success: true,
      message: video.isFeatured ? 'Video destacado correctamente' : 'Video eliminado de destacados',
      isFeatured: video.isFeatured
    });
  } catch (error) {
    console.error('Error featureCommercialVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// 🆕 ESTADÍSTICAS GLOBALES PARA ADMIN
// ============================================
const getAdminVideoStats = async (req, res) => {
  try {
    const totalVideos = await Video.countDocuments();
    const pendingVideos = await Video.countDocuments({ pendiente: true });
    const commercialVideos = await Video.countDocuments({ isCommercial: true });
    const activeVideos = await Video.countDocuments({ isActive: true });
    
    const viewsThisMonth = await Video.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    const topVideos = await Video.find({ pendiente: false, isActive: true })
      .sort({ views: -1 })
      .limit(10)
      .populate('user', 'username');
    
    res.json({
      success: true,
      stats: {
        totalVideos,
        pendingVideos,
        commercialVideos,
        activeVideos,
        viewsThisMonth: viewsThisMonth[0].totalViews || 0,
        pendingPercentage: totalVideos ? ((pendingVideos / totalVideos) * 100).toFixed(1) : 0,
        commercialPercentage: totalVideos ? ((commercialVideos / totalVideos) * 100).toFixed(1) : 0
      },
      topVideos
    });
  } catch (error) {
    console.error('Error getAdminVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/categoryController.js
// backend/controllers/videoController.js
// Agrega esta función antes del module.exports

// ============================================
// 📹 OBTENER VIDEOS DEL USUARIO (CON FILTROS)
// ============================================
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { filter = 'all', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Verificar autenticación
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    
    const currentUserId = req.user._id;
    const isAdmin = req.user.role === 'admin';
    const isOwner = currentUserId.toString() === userId;
    
    // Construir query base
    let query = { user: new mongoose.Types.ObjectId(userId) };
    
    // Solo dueño o admin pueden ver videos pendientes
    if (!isOwner && !isAdmin) {
      query.pendiente = false;
    }
    
    // Aplicar filtro de estado
    if (filter === 'pending') {
      query.pendiente = true;
    } else if (filter === 'approved') {
      query.pendiente = false;
    }
    // 'all' no añade filtro adicional
    
    console.log('🔍 getUserVideos:', { userId, filter, isOwner, isAdmin });
    console.log('📊 Query:', JSON.stringify(query));
    
    // Obtener videos con paginación
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('channel', 'name avatar isVerified _id')
      .populate('user', 'username avatar')
      .lean();
    
    // Contar totales para estadísticas
    const total = await Video.countDocuments(query);
    const pendingCount = await Video.countDocuments({ 
      user: new mongoose.Types.ObjectId(userId), 
      pendiente: true 
    });
    const approvedCount = await Video.countDocuments({ 
      user: new mongoose.Types.ObjectId(userId), 
      pendiente: false 
    });
    
    console.log(`📹 Encontrados: ${videos.length} videos (Total: ${total}, Pendientes: ${pendingCount}, Aprobados: ${approvedCount})`);
    
    res.json({
      success: true,
      videos,
      total,
      pendingCount,
      approvedCount,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total
    });
    
  } catch (error) {
    console.error('❌ Error getUserVideos:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
 // ============================================
// 🔥 VIDEOS EN TENDENCIA (PÚBLICO)
// ============================================
const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 20, days = 7 } = req.query;
    
    // Calcular fecha límite (últimos 'days' días)
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - parseInt(days));
    
    console.log(`📊 Buscando videos en tendencia desde: ${sinceDate.toISOString()}`);
    
    const videos = await Video.aggregate([
      // 1. Filtrar videos activos y aprobados
      { 
        $match: { 
          pendiente: false, 
          isActive: true,
          createdAt: { $gte: sinceDate }  // Solo videos recientes
        } 
      },
      
      // 2. Calcular métricas de engagement
      { 
        $addFields: { 
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
          sharesCount: { $size: { $ifNull: ['$shares', []] } },
          uniqueViewsCount: { $size: { $ifNull: ['$uniqueViews', []] } }
        } 
      },
      
      // 3. Calcular trending score (fórmula ponderada)
      { 
        $addFields: {
          // Fórmula de trending:
          // - Views: 1 punto
          // - Likes: 2 puntos
          // - Comments: 3 puntos  
          // - Shares: 4 puntos
          // - Mayor peso a interacciones recientes
          trendingScore: {
            $add: [
              { $multiply: ['$views', 1] },
              { $multiply: ['$likesCount', 2] },
              { $multiply: ['$commentsCount', 3] },
              { $multiply: ['$sharesCount', 4] },
              { $multiply: ['$uniqueViewsCount', 1.5] }  // Usuarios únicos tienen más peso
            ]
          },
          
          // Calcular engagement rate (%)
          engagementRate: {
            $cond: {
              if: { $eq: ['$views', 0] },
              then: 0,
              else: {
                $multiply: [
                  {
                    $divide: [
                      { $add: ['$likesCount', '$commentsCount', '$sharesCount'] },
                      '$views'
                    ]
                  },
                  100
                ]
              }
            }
          }
        } 
      },
      
      // 4. Ordenar por trending score
      { $sort: { trendingScore: -1, createdAt: -1 } },
      
      // 5. Limitar resultados
      { $limit: parseInt(limit) },
      
      // 6. Poblar datos del usuario
      { 
        $lookup: { 
          from: 'users', 
          localField: 'user', 
          foreignField: '_id', 
          as: 'userData' 
        } 
      },
      { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
      
      // 7. Poblar datos del canal
      { 
        $lookup: { 
          from: 'channels', 
          localField: 'channel', 
          foreignField: '_id', 
          as: 'channelData' 
        } 
      },
      { $unwind: { path: '$channelData', preserveNullAndEmptyArrays: true } },
      
      // 8. Poblar categoría
      { 
        $lookup: { 
          from: 'categories', 
          localField: 'category', 
          foreignField: '_id', 
          as: 'categoryData' 
        } 
      },
      { $unwind: { path: '$categoryData', preserveNullAndEmptyArrays: true } },
      
      // 9. Transformar y limpiar datos
      {
        $addFields: {
          user: {
            _id: '$userData._id',
            username: '$userData.username',
            avatar: '$userData.avatar',
            isPro: '$userData.isPro'
          },
          channel: {
            _id: '$channelData._id',
            name: '$channelData.name',
            avatar: {
              $cond: {
                if: { $isArray: '$channelData.avatar' },
                then: { $arrayElemAt: ['$channelData.avatar.url', 0] },
                else: '$channelData.avatar'
              }
            },
            isVerified: '$channelData.isVerified'
          },
          category: {
            _id: '$categoryData._id',
            name: '$categoryData.name',
            slug: '$categoryData.slug',
            icon: '$categoryData.icon'
          }
        }
      },
      
      // 10. Proyectar campos finales
      {
        $project: {
          userData: 0,
          channelData: 0,
          categoryData: 0
        }
      }
    ]);
    
    // Calcular estadísticas adicionales
    const stats = {
      totalTrending: videos.length,
      timeRange: `${days} días`,
      averageEngagement: videos.reduce((acc, v) => acc + (v.engagementRate || 0), 0) / (videos.length || 1),
      topCategory: getMostFrequentCategory(videos)
    };
    
    console.log(`✅ Encontrados ${videos.length} videos en tendencia`);
    console.log(`📊 Engagement promedio: ${stats.averageEngagement.toFixed(2)}%`);
    
    res.json({ 
      success: true, 
      videos,
      stats,
      metadata: {
        limit: parseInt(limit),
        days: parseInt(days),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getTrendingVideos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al cargar videos en tendencia',
      error: error.message 
    });
  }
};

// Función auxiliar para obtener la categoría más frecuente
function getMostFrequentCategory(videos) {
  const categoryCount = {};
  videos.forEach(video => {
    if (video.category && video.category._id) {
      const catId = video.category._id.toString();
      categoryCount[catId] = (categoryCount[catId] || 0) + 1;
    }
  });
  
  let maxCount = 0;
  let topCategory = null;
  
  for (const [catId, count] of Object.entries(categoryCount)) {
    if (count > maxCount) {
      maxCount = count;
      const videoWithCat = videos.find(v => v.category && v.category._id.toString() === catId);
      topCategory = videoWithCat.category || null;
    }
  }
  
  return topCategory;
}


const toggleLikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    // ✅ Usar findOneAndUpdate en lugar de find + save para evitar conflictos de versión
    const video = await Video.findById(id);
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const userId = req.user._id;
    const userIdStr = userId.toString();
    
    // Verificar si ya existe el like
    const likeIndex = video.likes.findIndex(likeId => likeId && likeId.toString() === userIdStr);
    let liked = false;
    
    if (likeIndex === -1) {
      // Dar like
      video.likes.push(userId);
      liked = true;
    } else {
      // Quitar like
      video.likes.splice(likeIndex, 1);
      liked = false;
    }
    
    // Actualizar engagement score
    video.updateEngagementScore();
    
    // ✅ Usar save con opciones para manejar conflictos
    await video.save({ 
      validateBeforeSave: true,
      session: null 
    });
    
    // Actualizar estadísticas del canal
    const Channel = mongoose.model('Channel');
    const channel = await Channel.findById(video.channel);
    if (channel) await channel.updateStats();
    
    res.json({ 
      success: true, 
      likes: video.likes.length, 
      liked 
    });
    
  } catch (error) {
    console.error('Error toggleLikeVideo:', error);
    
    // ✅ Manejar error de versión
    if (error.name === 'VersionError') {
      // Reintentar una vez
      try {
        const video = await Video.findById(req.params.id);
        if (!video) {
          return res.status(404).json({ success: false, message: 'Video no encontrado' });
        }
        
        const userId = req.user._id;
        const userIdStr = userId.toString();
        const likeIndex = video.likes.findIndex(likeId => likeId && likeId.toString() === userIdStr);
        let liked = false;
        
        if (likeIndex === -1) {
          video.likes.push(userId);
          liked = true;
        } else {
          video.likes.splice(likeIndex, 1);
          liked = false;
        }
        
        video.updateEngagementScore();
        await video.save();
        
        return res.json({ 
          success: true, 
          likes: video.likes.length, 
          liked 
        });
      } catch (retryError) {
        console.error('Error en reintento:', retryError);
        return res.status(500).json({ 
          success: false, 
          message: 'Error al procesar el like, intenta de nuevo' 
        });
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}






// ============================================
// 📤 EXPORTACIÓN CORREGIDA
// ============================================
module.exports = {
  // ✅ PÚBLICAS
  getCategoriesForSlider,
  getVideoById,
  getVideoByIdPublic,
  getVideoByIdPrivate,
  filterVideos,
  getVideosByCategory,        // ← ¡ESTA ES LA QUE FALTA! ✅
  getFeaturedVideos,
  getPopularVideos,
   
  
  filterCommercialVideos,
  getVideosNearby,
  
  // ✅ PROTEGIDAS
  createVideo,
  updateVideo,
  deleteVideo,
  toggleLikeVideo,
  shareVideo,
  trackWatchTime,
  getUserVideoStats,
  
  // ✅ COMERCIALES PROTEGIDAS
  getMyCommercialVideos,
  toggleWholesale,
  updateStock,
  updateVideoLocation,
  
  // ✅ MÚSICA
  getMusicLibrary,
  shareVideo,
  // ✅ ADMIN
  getVideosPendientesAdmin,
  aprobarVideoAdmin,
  eliminarVideoAdmin,
  getCommercialStats,
  featureCommercialVideo,
  getAdminVideoStats,
  getChannelVideos,
  
  // ✅ PERFIL DE USUARIO
  getUserProfileStats,
  getUserSavedVideos,
  getUserLikedVideos,
  toggleFollowUser,
  toggleSaveVideo,
  getTrendingVideos,
  getUserVideos
};
 