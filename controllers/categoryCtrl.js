// controllers/categoryController.js - VERSIÓN SIMPLIFICADA PARA VideoCommerce
const Category = require('../models/categoryModel');
const Video = require('../models/videoModel'); // 🔥 Cambiado: Post → Video
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// 🧠 Caché simple
let cacheCategories = null;
let cacheCategoriesTime = 0;

// ==================== 1. OBTENER TODAS LAS CATEGORÍAS (para slider) ====================
const getCategoriesForSlider = asyncHandler(async (req, res) => {
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
});

// ==================== 2. OBTENER CATEGORÍAS PRINCIPALES (con paginación) ====================
const getMainCategories = asyncHandler(async (req, res) => {
  const includeVideos = req.query.videos === 'true';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const now = Date.now();

  // Cache para primera página sin videos
  if (!includeVideos && page === 1 && cacheCategories && now - cacheCategoriesTime < 60000) {
    return res.json(cacheCategories);
  }

  // Obtener categorías paginadas
  const [categories, totalCategories] = await Promise.all([
    Category.find({ isActive: true })
      .select('_id name slug icon iconType iconColor bgColor order videoCount description')
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments({ isActive: true })
  ]);

  // Si se solicitan videos destacados de cada categoría
  if (includeVideos && categories.length > 0) {
    for (let category of categories) {
      // Obtener videos recientes de esta categoría (máximo 6)
      const videos = await Video.find({
        category: category._id,
        isActive: true,
        pendiente: false
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('_id title thumbnail videoUrl views likes price')
        .lean();
      
      category.featuredVideos = videos;
    }
  }

  const totalPages = Math.ceil(totalCategories / limit);
  const response = {
    success: true,
    categories,
    pagination: {
      currentPage: page,
      totalPages,
      totalCategories,
      hasMore: page < totalPages,
      limit
    }
  };

  // Guardar en cache si es primera página sin videos
  if (!includeVideos && page === 1) {
    cacheCategories = response;
    cacheCategoriesTime = now;
  }

  res.json(response);
});
// controllers/categoryController.js - AÑADIR ESTA FUNCIÓN

// controllers/categoryController.js - CORREGIR getCategoriesWithVideos

// AÑADIR AL FINAL DEL ARCHIVO, antes de module.exports
const getCategoriesWithVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const videosPerCategory = parseInt(req.query.videosPerCategory) || 6;
    const skip = (page - 1) * limit;
    
    console.log(`📡 getCategoriesWithVideos - page: ${page}, limit: ${limit}, videosPerCategory: ${videosPerCategory}`);
    
    // Obtener total de categorías activas
    const total = await Category.countDocuments({ isActive: true });
    console.log(`📊 Total categorías activas: ${total}`);
    
    const hasMore = skip + limit < total;
    
    // Obtener categorías paginadas
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log(`📦 Categorías encontradas: ${categories.length}`);
    
    // Para cada categoría, obtener sus videos
    const categoriesWithVideos = await Promise.all(
      categories.map(async (category) => {
        // Buscar videos de esta categoría
        const videos = await Video.find({
          category: category._id,
          pendiente: false,
          isActive: true
        })
          .sort({ createdAt: -1 })
          .limit(videosPerCategory)
          .populate('user', 'username avatar isPro')
          .populate('category', 'slug name')
          .lean();
        
        console.log(`   📹 ${category.name}: ${videos.length} videos encontrados`);
        
        // Si hay videos, mostrar el primero como ejemplo
        if (videos.length > 0) {
          console.log(`      Ejemplo: ${videos[0].title}`);
        }
        
        return { ...category, videos };
      })
    );
    
    res.json({
      success: true,
      categories: categoriesWithVideos,
      currentPage: page,
      hasMore: hasMore,
      total: total,
      limit: limit,
      videosPerCategory: videosPerCategory
    });
    
  } catch (error) {
    console.error('❌ Error en getCategoriesWithVideos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías con videos',
      error: error.message
    });
  }
};
// Asegurar que module.exports incluya esta función
 
// ==================== 3. OBTENER CATEGORÍA POR ID O SLUG ====================
const getCategoryById = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const includeVideos = req.query.videos === 'true';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Buscar por ID o slug
  const query = mongoose.Types.ObjectId.isValid(identifier) 
    ? { _id: identifier, isActive: true } 
    : { slug: identifier, isActive: true };
  
  const category = await Category.findOne(query).lean();
  
  if (!category) {
    return res.status(404).json({ 
      success: false, 
      message: 'Categoría no encontrada' 
    });
  }

  const response = { success: true, category };

  // Incluir videos de esta categoría
  if (includeVideos) {
    const [videos, totalVideos] = await Promise.all([
      Video.find({
        category: category._id,
        isActive: true,
        pendiente: false
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title thumbnail videoUrl views likes price wilaya createdAt')
        .populate('user', 'username avatar')
        .lean(),
      Video.countDocuments({
        category: category._id,
        isActive: true,
        pendiente: false
      })
    ]);

    response.videos = videos;
    response.pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalVideos / limit),
      totalVideos,
      hasMore: page * limit < totalVideos,
      limit
    };
  }

  res.json(response);
});

// ==================== 4. OBTENER VIDEOS POR CATEGORÍA (con filtros) ====================
const getVideosByCategory = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Filtros adicionales
    const {
      wilaya,
      minPrice,
      maxPrice,
      sortBy = 'recent'
    } = req.query;

    if (!slug) {
      return res.json({
        success: true,
        videos: [],
        total: 0,
        page,
        hasMore: false,
        message: 'Se requiere categoría'
      });
    }

    // Buscar la categoría
    const category = await Category.findOne({ slug, isActive: true }).lean();

    if (!category) {
      return res.json({
        success: true,
        videos: [],
        total: 0,
        page,
        hasMore: false,
        message: 'Categoría no encontrada'
      });
    }

    // Construir filtro base
    let filter = {
      category: category._id,
      isActive: true,
      pendiente: false
    };

    // Filtros adicionales
    if (wilaya && wilaya !== '') {
      filter.wilaya = wilaya;
    }

    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }

    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }

    // Ordenamiento
    let sort = {};
    switch (sortBy) {
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      case 'views':
        sort = { views: -1 };
        break;
      case 'likes':
        sort = { likes: -1 };
        break;
      case 'recent':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Ejecutar consulta
    const [videos, total] = await Promise.all([
      Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('_id title thumbnail videoUrl views likes price wilaya commune createdAt isCommercial wholesale')
        .populate('user', 'username avatar')
        .lean(),
      Video.countDocuments(filter)
    ]);

    const hasMore = page * limit < total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      videos,
      total,
      page,
      limit,
      hasMore,
      totalPages,
      categoryInfo: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        iconColor: category.iconColor,
        bgColor: category.bgColor
      },
      filters: {
        wilaya: wilaya || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        sortBy
      }
    });

  } catch (error) {
    console.error('❌ Error en getVideosByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los videos',
      error: error.message
    });
  }
});

// ==================== 5. OBTENER CATEGORÍAS POPULARES ====================
const getPopularCategories = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const categories = await Category.find({ isActive: true })
    .sort({ videoCount: -1, order: 1 })
    .limit(limit)
    .select('_id name slug icon iconColor videoCount')
    .lean();
  
  res.json({
    success: true,
    categories,
    total: categories.length
  });
});

// ==================== 6. OBTENER ESTADÍSTICAS DE CATEGORÍAS ====================
const getCategoryStats = asyncHandler(async (req, res) => {
  const [totalCategories, totalVideos, categoriesWithVideos] = await Promise.all([
    Category.countDocuments({ isActive: true }),
    Video.countDocuments({ isActive: true, pendiente: false }),
    Category.countDocuments({ videoCount: { $gt: 0 } })
  ]);

  // Categorías con más videos
  const topCategories = await Category.find({ isActive: true, videoCount: { $gt: 0 } })
    .sort({ videoCount: -1 })
    .limit(10)
    .select('name slug icon videoCount')
    .lean();

  res.json({
    success: true,
    stats: {
      totalCategories,
      totalVideos,
      categoriesWithVideos,
      categoriesWithoutVideos: totalCategories - categoriesWithVideos
    },
    topCategories
  });
});

// ==================== 7. BUSCAR CATEGORÍAS ====================
const searchCategories = asyncHandler(async (req, res) => {
  const { query } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      categories: [],
      total: 0,
      message: 'La búsqueda debe tener al menos 2 caracteres'
    });
  }

  const categories = await Category.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { slug: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  })
    .limit(limit)
    .select('_id name slug icon iconColor videoCount description')
    .lean();

  res.json({
    success: true,
    categories,
    total: categories.length,
    searchTerm: query
  });
});

// ==================== 8. OBTENER FILTROS PARA CATEGORÍA ====================
const getCategoryFilters = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug, isActive: true }).lean();
  
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Categoría no encontrada'
    });
  }

  // Obtener wilayas únicas de videos en esta categoría
  const wilayas = await Video.distinct('wilaya', {
    category: category._id,
    isActive: true,
    pendiente: false,
    wilaya: { $ne: null, $ne: '' }
  });

  // Obtener rango de precios
  const priceStats = await Video.aggregate([
    {
      $match: {
        category: category._id,
        isActive: true,
        pendiente: false
      }
    },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);

  const priceRange = priceStats[0] || { minPrice: 0, maxPrice: 1000000 };

  // Verificar si hay videos comerciales
  const hasCommercial = await Video.exists({
    category: category._id,
    isCommercial: true,
    isActive: true,
    pendiente: false
  });

  res.json({
    success: true,
    categoryInfo: {
      _id: category._id,
      name: category.name,
      slug: category.slug
    },
    filters: {
      wilayas: wilayas.filter(w => w && w !== '').sort(),
      priceRange: {
        min: priceRange.minPrice || 0,
        max: priceRange.maxPrice || 1000000
      },
      hasCommercial: !!hasCommercial
    }
  });
});

// ==================== 9. ACTUALIZAR CONTADOR DE VIDEOS (admin) ====================
const updateVideoCounts = asyncHandler(async (req, res) => {
  // Actualizar contador de videos para cada categoría
  const categories = await Category.find({ isActive: true });
  
  for (const category of categories) {
    const videoCount = await Video.countDocuments({
      category: category._id,
      isActive: true,
      pendiente: false
    });
    
    await Category.findByIdAndUpdate(category._id, { videoCount });
  }
  
  res.json({
    success: true,
    message: 'Contadores de videos actualizados correctamente',
    updated: categories.length
  });
});
// AÑADIR AL FINAL DEL ARCHIVO, antes de module.exports
 

// Asegurar que module.exports incluya esta función
module.exports = {
  getCategoriesForSlider,
  getMainCategories,
  getCategoryById,
  getVideosByCategory,
  getPopularCategories,
  getCategoryStats,
  searchCategories,
  getCategoryFilters,
  updateVideoCounts,
  getCategoriesWithVideos, // ✅ AHORA SÍ está exportada correctamente
};