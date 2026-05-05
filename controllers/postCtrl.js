const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const Users = require('../models/userModel');
const Notify = require('../models/notifyModel'); // ✅ Agregar esta línea
const Comments = require('../models/commentModel');
const mongoose = require('mongoose');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dfjipgj2o',
  api_key: '213981915435275',
  api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});

// 🔥 Función auxiliar para filtrar posts según rol (SOLO pendiente)
const getPostFilter = (user, includeOwnPending = false) => {
  if (!user) {
    // Usuario no autenticado: solo posts aprobados
    return { pendiente: false };
  }
  
  if (user.role === 'admin' || user.role === 'moderator') {
    // Admin/Moderador: ver todo
    return {};
  }
  
  if (includeOwnPending) {
    // Usuario viendo sus propios posts: incluir sus pendientes
    return {
      $or: [
        { user: user._id, pendiente: true },
        { pendiente: false }
      ]
    };
  }
  
  // Usuario normal: solo aprobados
  return { pendiente: false };
};

const postCtrl = {
  // 📂 createPost - Guarda el post como pendiente
  createPost: async (req, res) => {
    try {
      const userId = req.user._id;
  
      const {
        categorie,
        subCategory,
        articleType,
        title,
        wilaya,
        commune,
        images,
        categorySpecificData
      } = req.body;
  
      if (!categorie || !subCategory || !wilaya || !commune || !images) {
        return res.status(400).json({ msg: "Champs requis manquants" });
      }
  
      if (!title || title.trim() === "") {
        return res.status(400).json({ msg: "Le titre est requis" });
      }
  
      const category = await Category.findOne({
        $or: [
          { slug: categorie },
          { slug: subCategory }
        ],
        isActive: true
      }).select('_id').lean();
  
      if (!category) {
        return res.status(404).json({ msg: "Catégorie non trouvée" });
      }
  
      const postData = {
        user: userId,
        categorie: categorie.trim(),
        subCategory: subCategory.trim(),
        articleType: (articleType || "").trim(),
        category: category._id,
        title: title.trim(),
        description: (req.body.description || "").trim(),
        price: parseFloat(req.body.price) || 0,
        etat: req.body.etat || "occasion",
        wilaya: wilaya.toString().trim(),
        commune: commune.toString().trim(),
        phone: (req.body.phone || "").trim(),
        email: (req.body.email || "").trim().toLowerCase(),
        address: (req.body.address || "").trim(),
        images: images,
        categorySpecificData: categorySpecificData || {},
        pendiente: true
      };
  
      const newPost = new Post(postData);
      await newPost.save();
  
      Category.findByIdAndUpdate(
        category._id,
        { $inc: { postCount: 1 } }
      ).catch(() => {});
  
      // ✅ Respuesta simple, las notificaciones se manejan en el frontend
      res.status(201).json({
        success: true,
        newPost: {
          _id: newPost._id,
          title: newPost.title,
          images: newPost.images,
          pendiente: newPost.pendiente,
          user: {
            _id: req.user._id,
            username: req.user.username,
            avatar: req.user.avatar
          }
        }
      });
  
    } catch (err) {
      console.error("❌ createPost error:", err.message);
      res.status(500).json({ msg: "Erreur serveur" });
    }
  },
 // 📂 controllers/postCtrl.js - CORREGIR getPostsPendientes

getPostsPendientes: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { categorie, subCategory } = req.query;
    
    console.log('📡 Parámetros recibidos:', { categorie, subCategory, page, limit });
    
    // Verificar que el usuario sea admin
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      return res.status(403).json({ msg: "Non autorisé. Admin requis." });
    }
    
    // Query base
    let query = { pendiente: true };
    
    // 🔥 CORREGIDO: Validar correctamente el valor de categorie
    if (categorie && typeof categorie === 'string' && categorie !== 'undefined' && categorie !== 'null' && categorie.trim() !== '') {
      query.categorie = categorie; // ✅ Usar la string directamente, no regex
      console.log('✅ Aplicando filtro por categoría:', categorie);
    }
    
    // Filtrar por subcategoría
    if (subCategory && typeof subCategory === 'string' && subCategory !== 'undefined' && subCategory !== 'null' && subCategory.trim() !== '') {
      query.subCategory = subCategory;
      console.log('✅ Aplicando filtro por subcategoría:', subCategory);
    }
    
    console.log('📡 Query final posts pendientes:', JSON.stringify(query));
    
    // Obtener posts con paginación
    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('user', 'username email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    
    console.log(`📡 Resultados: ${posts.length} posts encontrados de ${total} totales`);
    
    res.json({ 
      success: true,
      posts: posts || [], 
      total: total || 0,
      page: page,
      limit: limit,
      totalPages: totalPages || 1,
      hasMore: hasMore || false,
      appliedFilters: { categorie, subCategory }
    });
  } catch (err) {
    console.error('❌ Error en getPostsPendientes:', err);
    res.status(500).json({ error: err.message });
  }
},
  getAllPostsPendientesCounts: async (req, res) => {
    try {
      // Verificar permisos
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      // Obtener todas las categorías
      const categories = await Category.find({ level: 1, isActive: true }).lean();
      
      // Hacer un solo aggregate para contar todos los posts pendientes por categoría
      const counts = await Post.aggregate([
        { $match: { pendiente: true, isActive: true } },
        { $group: { _id: "$categorie", count: { $sum: 1 } } }
      ]);
      
      // Crear un mapa de counts
      const countMap = {};
      counts.forEach(item => {
        countMap[item._id] = item.count;
      });
      
      // Construir respuesta para todas las categorías
      const result = {};
      categories.forEach(cat => {
        result[cat.slug] = countMap[cat.name] || countMap[cat.slug] || 0;
      });
      
      console.log('📊 Counts por categoría:', result);
      
      res.json({ success: true, counts: result });
      
    } catch (err) {
      console.error('❌ Error en getAllPostsPendientesCounts:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
 
  // 📂 controllers/postCtrl.js - CORREGIR getPostsPendientesCount

getPostsPendientesCount: async (req, res) => {
  try {
    const { categorie } = req.query;
    
    console.log('📊 getPostsPendientesCount - Categoría recibida:', categorie, 'tipo:', typeof categorie);
    
    // Verificar permisos
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      return res.status(403).json({ success: false, message: "Non autorisé" });
    }
    
    // Construir query
    let query = { pendiente: true };
    
    // 🔥 CORREGIDO: Validar correctamente
    if (categorie && typeof categorie === 'string' && categorie !== 'undefined' && categorie !== 'null' && categorie.trim() !== '') {
      query.categorie = categorie;
      console.log('✅ Contando posts con categoría:', categorie);
    }
    
    console.log('📊 Query count:', JSON.stringify(query));
    
    const count = await Post.countDocuments(query);
    
    console.log(`📊 Count resultado: ${count}`);
    
    res.json({ success: true, count });
    
  } catch (err) {
    console.error('❌ Error en getPostsPendientesCount:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message
    });
  }
},
  aprobarPost: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({ msg: "Non autorisé. Admin requis." });
      }
      
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ msg: "Post non trouvé" });
      }
      
      if (!post.pendiente) {
        return res.status(400).json({ msg: "Ce post est déjà approuvé" });
      }
      
      post.pendiente = false;
      await post.save();
      
      res.json({
        success: true,
        msg: "Post approuvé avec succès",
        post: {
          _id: post._id,
          title: post.title,
          pendiente: post.pendiente
        }
      });
      
    } catch (err) {
      console.error("❌ aprobarPost error:", err);
      res.status(500).json({ msg: err.message });
    }
  },

  






  filterPosts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
  
      const {
        category: categorySlug,
        sub: subSlug,
        article: articleSlug,
        wilaya,
        commune,
        minPrice,
        maxPrice,
        sortBy = 'recent'
      } = req.query;
  
      if (!categorySlug) {
        return res.json({
          success: true,
          posts: [],
          total: 0,
          page,
          hasMore: false,
          message: 'Se requiere categoría'
        });
      }
  
      const categoryDoc = await Category.findOne({
        slug: categorySlug,
        level: 1,
        isActive: true
      }).lean();
  
      if (!categoryDoc) {
        return res.json({
          success: true,
          posts: [],
          total: 0,
          page,
          hasMore: false,
          message: 'Categoría no encontrada'
        });
      }
  
      const [allSubCategories, allArticles] = await Promise.all([
        Category.find({ parent: categoryDoc._id, level: 2, isActive: true }).lean(),
        Category.find({ level: 3, isActive: true }).lean()
      ]);
  
      // 🔥 FILTRO - Solo pendiente false para usuarios normales
      const user = req.user || null;
      let estadoFilter = { pendiente: false };
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        estadoFilter = {};
      }
  
      let filter = {
        ...estadoFilter,
        $and: [
          {
            $or: [
              { isFromBoutique: { $ne: true } },
              { isFromBoutique: { $exists: false } }
            ]
          },
          {
            $or: [
              { category: categoryDoc._id },
              { categorie: { $regex: new RegExp(categoryDoc.name, 'i') } }
            ]
          }
        ]
      };
  
      let andConditions = [];
  
      if (subSlug) {
        const subCategoryDoc = allSubCategories.find(
          sub => sub.slug === subSlug || sub.name.toLowerCase() === subSlug.toLowerCase()
        );
  
        if (subCategoryDoc) {
          const articlesOfSub = allArticles.filter(
            article => String(article.parent) === String(subCategoryDoc._id)
          );
  
          const searchSlugs = [
            subCategoryDoc.slug,
            ...articlesOfSub.map(a => a.slug)
          ];
  
          andConditions.push({
            $or: [
              { subCategory: { $in: searchSlugs } },
              { articleType: { $in: searchSlugs } }
            ]
          });
        }
      }
  
      if (articleSlug) {
        const articleDoc = allArticles.find(
          article => article.slug === articleSlug || article.name.toLowerCase() === articleSlug.toLowerCase()
        );
  
        if (articleDoc) {
          andConditions.push({
            $or: [
              { subCategory: articleDoc.slug },
              { articleType: articleDoc.slug }
            ]
          });
        }
      }
  
      if (wilaya) {
        andConditions.push({
          $or: [
            { 'location.wilaya': wilaya },
            { wilaya: wilaya }
          ]
        });
      }
  
      if (commune) {
        andConditions.push({
          $or: [
            { 'location.commune': new RegExp(commune, 'i') },
            { commune: new RegExp(commune, 'i') }
          ]
        });
      }
  
      if (minPrice !== undefined || maxPrice !== undefined) {
        let priceFilter = {};
        if (minPrice !== undefined && minPrice !== '') priceFilter.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') priceFilter.$lte = Number(maxPrice);
        andConditions.push({ price: priceFilter });
      }
  
      if (andConditions.length > 0) {
        filter.$and = [...filter.$and, ...andConditions];
      }
  
      let sort = {};
      switch (sortBy) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'score':
          sort = { score: -1, createdAt: -1 };
          break;
        case 'recent':
        default:
          sort = { createdAt: -1 };
          break;
      }
  
      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .select('_id title price images createdAt wilaya commune description etat views categorie subCategory articleType category location score')
          .populate('user', 'username avatar')
          .populate('boutique', 'nom_boutique images')
          .lean(),
        Post.countDocuments(filter)
      ]);
  
      const childrenWithArticles = allSubCategories.map(child => ({
        _id: child._id,
        name: child.name,
        slug: child.slug,
        level: child.level,
        icon: child.icon || '📦',
        iconType: child.iconType || 'emoji',
        iconColor: child.iconColor || '#667eea',
        bgColor: child.bgColor || '#f0f3ff',
        postCount: child.postCount || 0,
        articles: allArticles
          .filter(a => String(a.parent) === String(child._id))
          .map(article => ({
            _id: article._id,
            name: article.name,
            slug: article.slug,
            level: article.level,
            icon: article.icon || '📄',
            iconType: article.iconType || 'emoji',
            iconColor: article.iconColor || '#667eea',
            bgColor: article.bgColor || '#f0f3ff',
            postCount: article.postCount || 0
          })),
        isLeaf: false
      }));
  
      res.json({
        success: true,
        posts,
        total,
        page,
        limit,
        hasMore: page * limit < total,
        totalPages: Math.ceil(total / limit),
        categoryInfo: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          level: categoryDoc.level,
          emoji: categoryDoc.emoji || ''
        },
        children: childrenWithArticles,
        filterMetadata: {
          appliedFilters: {
            wilaya: wilaya || null,
            commune: commune || null,
            minPrice: minPrice || null,
            maxPrice: maxPrice || null,
            sortBy
          }
        }
      });
  
    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error al filtrar posts',
        error: error.message
      });
    }
  },

  getPosts: async (req, res) => {
    try {
      const { page = 1, limit = 9, category } = req.query;
      const skip = (page - 1) * limit;

      const user = req.user || null;
      let filter = { pendiente: false };
      
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        filter = {};
      }

      if (category && category !== 'all') {
        filter.categorie = category;
      }

      const posts = await Post.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt')
        .populate("user", "username avatar")
        .populate("categoryRef", "name slug");

      const total = await Post.countDocuments(filter);

      res.json({
        success: true,
        result: posts.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        posts
      });

    } catch (err) {
      console.error('❌ Error en getPosts:', err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const userRole = req.user.role;
      const updateData = req.body;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ msg: "Post non trouvé" });
      }

      const isAdmin = userRole === 'admin';
      const isOwner = post.user.toString() === userId.toString();

      if (!isAdmin && !isOwner) {
        return res.status(403).json({ 
          msg: "Non autorisé - Vous n'êtes pas le propriétaire de cette annonce" 
        });
      }

      const oldCategory = {
        categorie: post.categorie,
        subCategory: post.subCategory,
        articleType: post.articleType,
        category: post.category
      };

      const processedData = { ...updateData };

      if (updateData.category && typeof updateData.category === 'string') {
        if (!updateData.category.match(/^[0-9a-fA-F]{24}$/)) {
          const categoryDoc = await Category.findOne({ 
            $or: [
              { slug: updateData.category },
              { name: { $regex: new RegExp(updateData.category, 'i') } }
            ],
            level: 1 
          });
          if (categoryDoc) {
            processedData.category = categoryDoc._id;
            processedData.categorie = categoryDoc.name;
          }
        }
      }

      if (updateData.subCategory && typeof updateData.subCategory === 'string') {
        processedData.subCategory = updateData.subCategory;
      }

      if (updateData.articleType && typeof updateData.articleType === 'string') {
        processedData.articleType = updateData.articleType;
      }

      if (updateData.categorySpecificData) {
        processedData.categorySpecificData = {
          ...(post.categorySpecificData || {}),
          ...updateData.categorySpecificData
        };
      }

      if (updateData.images && Array.isArray(updateData.images)) {
        processedData.images = updateData.images.map(img => {
          if (typeof img === 'string') {
            return { url: img, public_id: null };
          }
          return {
            url: img.url,
            public_id: img.public_id || null
          };
        });
      }

      const fieldsToUpdate = [
        'categorie', 'subCategory', 'articleType', 'title', 'description',
        'price', 'etat', 'wilaya', 'commune', 'address', 'phone', 'email',
        'images', 'categorySpecificData', 'category'
      ];

      fieldsToUpdate.forEach(field => {
        if (processedData[field] !== undefined) {
          post[field] = processedData[field];
        }
      });

      if (!isAdmin) {
        post.pendiente = true;
      }

      await post.save();

      const updatedPost = await Post.findById(id)
        .populate('user', 'username avatar')
        .lean();

      const categoryChanged = 
        oldCategory.categorie !== post.categorie ||
        oldCategory.subCategory !== post.subCategory ||
        String(oldCategory.category) !== String(post.category);

      res.json({
        success: true,
        msg: "Post mis à jour",
        post: updatedPost,
        oldCategory: oldCategory,
        categoryChanged: categoryChanged
      });

    } catch (err) {
      console.error('❌ Error updatePost:', err);
      res.status(500).json({ msg: err.message });
    }
  },
// 📂 controllers/postCtrl.js - AÑADIR este método

// ============================================
// GET COUNT DE POSTS PENDIENTES POR CATEGORÍA
// ============================================
getPostsPendientesCount: async (req, res) => {
  try {
    const { categorie } = req.query;
    
    // Verificar permisos
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      return res.status(403).json({ success: false, message: "Non autorisé" });
    }
    
    let query = { pendiente: true, isActive: true };
    
    if (categorie && categorie !== 'undefined' && categorie !== 'null' && categorie.trim() !== '') {
      query.categorie = { $regex: new RegExp(`^${categorie}$`, 'i') };
    }
    
    const count = await Post.countDocuments(query);
    
    console.log(`📊 Count posts pendientes para ${categorie || 'todas'}: ${count}`);
    
    res.json({ success: true, count });
  } catch (err) {
    console.error('❌ Error en getPostsPendientesCount:', err);
    res.status(500).json({ success: false, error: err.message });
  }
},
  getPublicUserPosts: async (req, res) => {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const userExists = await Users.findById(userId).select('_id username');
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const currentUser = req.user || null;
    let filter = { user: userId, pendiente: false };
    
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
      filter = { user: userId };
    } else if (currentUser && currentUser._id.toString() === userId) {
      filter = { user: userId };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean(),
      Post.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    res.json({
      success: true,
      posts,
      pagination: { page, limit, total, totalPages, hasMore },
      user: { _id: userExists._id, username: userExists.username }
    });
  },

    deletePost : async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user._id;
      const userRole = req.user.role;
  
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ success: false, msg: 'Post no encontrado' });
      }
  
      // Verificar permisos
      if (post.user.toString() !== userId.toString() && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({ success: false, msg: 'No autorizado' });
      }
  
      // ✅ Eliminar imágenes de Cloudinary
      if (post.images && post.images.length > 0) {
        for (const image of post.images) {
          if (image.public_id) {
            try {
              await cloudinary.uploader.destroy(image.public_id);
              console.log(`✅ Imagen eliminada: ${image.public_id}`);
            } catch (err) {
              console.error(`❌ Error eliminando imagen ${image.public_id}:`, err.message);
            }
          }
        }
      }
  
      // ✅ Eliminar video de Cloudinary (si existe)
      if (post.videoPublicId) {
        try {
          await cloudinary.uploader.destroy(post.videoPublicId, { resource_type: 'video' });
          console.log(`✅ Video eliminado: ${post.videoPublicId}`);
        } catch (err) {
          console.error(`❌ Error eliminando video:`, err.message);
        }
      }
  
      // ✅ Eliminar comentarios
      if (post.comments && post.comments.length > 0) {
        await Comments.deleteMany({ _id: { $in: post.comments } });
      }
  
      // ✅ Limpiar referencias en usuarios
      await User.updateMany(
        { _id: { $in: post.likes || [] } },
        { $pull: { likes: postId } }
      );
      
      await User.updateMany(
        { saved: postId },
        { $pull: { saved: postId } }
      );
  
      // ✅ Eliminar post
      await Post.findByIdAndDelete(postId);
  
      res.json({
        success: true,
        msg: 'Post eliminado correctamente',
        deletedPostId: postId
      });
  
    } catch (err) {
      console.error('Error en deletePost:', err);
      return res.status(500).json({ success: false, msg: err.message });
    }
  },
  getFeaturedPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const filter = { isPromoted: true, pendiente: false };
      
      const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean();

      res.json({
        success: true,
        featuredPosts: posts
      });
    } catch (error) {
      console.error('Error en getFeaturedPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener destacados',
        error: error.message
      });
    }
  },

  getRecentPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const filter = { pendiente: false };
      
      const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title images price etat createdAt wilaya commune')
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean();

      res.json({
        success: true,
        recentPosts: posts,
        total: posts.length
      });
    } catch (error) {
      console.error('Error en getRecentPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener posts recientes',
        error: error.message
      });
    }
  },

  searchPosts: async (req, res) => {
    try {
      const { query } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const user = req.user || null;
      let estadoFilter = { pendiente: false };
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        estadoFilter = {};
      }

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { categorie: { $regex: query, $options: 'i' } },
          { subCategory: { $regex: query, $options: 'i' } }
        ],
        ...estadoFilter
      };

      const [posts, total] = await Promise.all([
        Post.find(searchQuery)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug')
          .lean(),
        Post.countDocuments(searchQuery)
      ]);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          hasMore: page * limit < total
        },
        query
      });
    } catch (error) {
      console.error('Error en searchPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda',
        error: error.message
      });
    }
  },

  markAsSold: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado'
        });
      }

      if (req.user && post.user && req.user._id && post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'sold',
            soldAt: new Date()
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Post marcado como vendido',
        post: updatedPost
      });

    } catch (error) {
      console.error('Error en markAsSold:', error);
      res.status(500).json({
        success: false,
        message: 'Error al marcar como vendido',
        error: error.message
      });
    }
  },

  getSimilarPosts: async (req, res) => {
    try {
      const {
        categorie,
        subCategory,
        excludeId,
        limit = 6,
        page = 1
      } = req.query;

      if (!categorie || !subCategory) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere categorie y subCategory'
        });
      }

      const user = req.user || null;
      let estadoFilter = { pendiente: false };
      if (user && (user.role === 'admin' || user.role === 'moderator')) {
        estadoFilter = {};
      }

      let query = {
        categorie: categorie.trim(),
        subCategory: subCategory.trim(),
        ...estadoFilter
      };

      if (excludeId && excludeId.match(/^[0-9a-fA-F]{24}$/)) {
        query._id = { $ne: excludeId };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const posts = await Post.find(query)
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Post.countDocuments(query);

      res.json({
        success: true,
        posts,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: page * limit < total
      });

    } catch (error) {
      console.error('❌ getSimilarPosts error:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: error.message
      });
    }
  },

  healthCheck: async (req, res) => {
    try {
      const dbStatus = mongoose.connection.readyState;
      const dbStatusText =
        dbStatus === 0 ? 'disconnected' :
          dbStatus === 1 ? 'connected' :
            dbStatus === 2 ? 'connecting' :
              dbStatus === 3 ? 'disconnecting' : 'unknown';

      res.json({
        success: true,
        message: 'API de posts funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: dbStatusText,
          connected: dbStatus === 1
        },
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en health check',
        error: error.message
      });
    }
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, likes: req.user._id })
      if (post.length > 0) return res.status(400).json({ msg: "You liked this post." })

      const like = await Post.findOneAndUpdate({ _id: req.params.id }, {
        $push: { likes: req.user._id }
      }, { new: true })

      if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

      res.json({ msg: 'Liked Post!' })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  unLikePost: async (req, res) => {
    try {
      const like = await Post.findOneAndUpdate({ _id: req.params.id }, {
        $pull: { likes: req.user._id }
      }, { new: true })

      if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

      res.json({ msg: 'UnLiked Post!' })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getUserPosts: async (req, res) => {
    try {
      const currentUser = req.user || null;
      let filter = { user: req.params.id, pendiente: false };
      
      if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator')) {
        filter = { user: req.params.id };
      } else if (currentUser && currentUser._id.toString() === req.params.id) {
        filter = { user: req.params.id };
      }
      
      const features = new APIfeatures(Post.find(filter), req.query).paginating()
      const posts = await features.query.sort("-createdAt")

      res.json({
        posts,
        result: posts.length
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  // 📂 controllers/postCtrl.js - CORREGIDO

 // 📂 backend/controllers/postCtrl.js - getPost

getPost: async (req, res) => {
  try {
      const post = await Post.findById(req.params.id)
          .populate("user likes", "avatar username fullname followers")
          .populate({
              path: "comments",
              populate: {
                  path: "user likes",
                  select: "-password"
              }
          });

      if (!post) {
          return res.status(404).json({ msg: 'This post does not exist.' });
      }

      // ✅ Asegurar que comments sea un array
      const postData = post.toObject();
      if (!postData.comments) {
          postData.comments = [];
      }

      // ... resto igual
      res.json({ post: postData });
  } catch (err) {
      return res.status(500).json({ msg: err.message });
  }
},
  getPostById: async (req, res) => {
    try {
      // ✅ Buscar SOLO posts aprobados (pendiente: false)
      const post = await Post.findOne({ 
        _id: req.params.id,
        pendiente: false  // ✅ Solo posts aprobados
      }).populate('category', 'name slug level parent');
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found or pending approval' });
      }
  
      // ✅ Sin verificaciones de admin/dueño - es ruta pública
      res.json({ success: true, post });
      
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: error.message });
    }
  },

  addView: async (req, res) => {
    try {
      await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } }
      )
      res.json({ msg: "view counted" })
    } catch (err) {
      res.status(500).json({ msg: err.message })
    }
  },

  savePost: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.user._id, saved: req.params.id })
      if (user.length > 0) return res.status(400).json({ msg: "You saved this post." })

      const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
        $push: { saved: req.params.id }
      }, { new: true })

      if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

      res.json({ msg: 'Saved Post!' })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  unSavePost: async (req, res) => {
    try {
      const save = await Users.findOneAndUpdate({ _id: req.user._id }, {
        $pull: { saved: req.params.id }
      }, { new: true })

      if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

      res.json({ msg: 'unSaved Post!' })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getSavePosts: async (req, res) => {
    try {
      const filter = {
        _id: { $in: req.user.saved },
        pendiente: false
      };
      
      const features = new APIfeatures(Post.find(filter), req.query).paginating()
      const savePosts = await features.query.sort("-createdAt")

      res.json({
        savePosts,
        result: savePosts.length
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getFilterOptions: async (req, res) => {
    try {
      const { category: categorySlug, sub: subSlug, article: articleSlug } = req.query;
      if (!categorySlug) {
        return res.status(400).json({ msg: "Se requiere categoría" });
      }

      const categoryDoc = await Category.findOne({ slug: categorySlug, level: 1, isActive: true }).lean();
      if (!categoryDoc) {
        return res.status(404).json({ msg: "Categoría no encontrada" });
      }

      const [allSubCategories, allArticles] = await Promise.all([
        Category.find({ parent: categoryDoc._id, level: 2, isActive: true }).lean(),
        Category.find({ level: 3, isActive: true }).lean()
      ]);

      const childrenWithArticles = allSubCategories.map(sub => ({
        _id: sub._id,
        name: sub.name,
        slug: sub.slug,
        level: sub.level,
        icon: sub.icon || '📦',
        iconType: sub.iconType || 'emoji',
        iconColor: sub.iconColor || '#667eea',
        bgColor: sub.bgColor || '#f0f3ff',
        postCount: sub.postCount || 0,
        articles: allArticles
          .filter(a => String(a.parent) === String(sub._id))
          .map(article => ({
            _id: article._id,
            name: article.name,
            slug: article.slug,
            level: article.level,
            icon: article.icon || '📄',
            iconType: article.iconType || 'emoji',
            iconColor: article.iconColor || '#667eea',
            bgColor: article.bgColor || '#f0f3ff',
            postCount: article.postCount || 0
          }))
      }));

      const filterBase = {
        pendiente: false,
        $or: [
          { category: categoryDoc._id },
          { categorie: { $regex: new RegExp(categoryDoc.name, 'i') } }
        ]
      };

      if (subSlug) {
        const subDoc = allSubCategories.find(s => s.slug === subSlug);
        if (subDoc) {
          const articleSlugs = allArticles.filter(a => String(a.parent) === String(subDoc._id)).map(a => a.slug);
          filterBase.$and = [{
            $or: [
              { subCategory: { $in: [subDoc.slug, ...articleSlugs] } },
              { articleType: { $in: [subDoc.slug, ...articleSlugs] } }
            ]
          }];
        }
      }

      const [wilayasResult, priceRangeResult] = await Promise.all([
        Post.aggregate([
          { $match: filterBase },
          { $group: { _id: "$wilaya" } },
          { $sort: { _id: 1 } }
        ]),
        Post.aggregate([
          { $match: filterBase },
          { $group: { _id: null, minPrice: { $min: "$price" }, maxPrice: { $max: "$price" } } }
        ])
      ]);

      const wilayas = wilayasResult.map(w => ({ value: w._id, label: w._id })).filter(w => w.value);
      const priceRange = priceRangeResult[0] || { minPrice: 0, maxPrice: 1000000 };

      res.json({
        success: true,
        categoryInfo: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          emoji: categoryDoc.emoji
        },
        children: childrenWithArticles,
        wilayas,
        priceRange: {
          min: priceRange.minPrice,
          max: priceRange.maxPrice
        }
      });

    } catch (error) {
      console.error('❌ getFilterOptions error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

// 📂 backend/controllers/postCtrl.js - CORREGIR getPost

getPost: async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user likes", "avatar username fullname followers")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password"
        }
      });

    if (!post) {
      return res.status(404).json({ msg: 'This post does not exist.' });
    }

    // ✅ GARANTIZAR que comments sea un array (incluso si es null o undefined)
    const postData = post.toObject ? post.toObject() : { ...post };
    
    // ✅ Asegurar que comments siempre sea un array
    if (!postData.comments) {
      postData.comments = [];
    }
    
    // ✅ También asegurar que cada comentario tenga sus campos necesarios
    postData.comments = postData.comments.map(comment => ({
      ...comment,
      likes: comment.likes || [],
      reply: comment.reply || null
    }));

    const user = req.user || null;
    const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');
    const isOwner = user && postData.user && postData.user._id.toString() === user._id.toString();
    
    if (postData.pendiente) {
      if (isAdmin || isOwner) {
        return res.json({ 
          post: postData,
          pendiente: true,
          isAdmin: isAdmin,
          isOwner: isOwner
        });
      }
      
      return res.status(403).json({ 
        msg: 'Ce post est en attente de validation.',
        pendiente: true
      });
    }

    res.json({ post: postData });

  } catch (err) {
    console.error('❌ Error en getPost:', err);
    return res.status(500).json({ msg: err.message });
  }
},



};

module.exports = postCtrl;