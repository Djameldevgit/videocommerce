// 📂 controllers/boutiqueCtrl.js - VERSIÓN DEFINITIVA LIMPIADA
const Boutique = require('../models/boutiqueModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

 
const cloudinary = require('cloudinary').v2;
 
 

// Configurar Cloudinary (si no está configurado globalmente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfjipgj2o',
  api_key: process.env.CLOUDINARY_API_KEY || '213981915435275',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
// Función para generar slug único (compatible con Node antiguo)
const generateUniqueSlug = function(base) {
  if (!base) base = 'boutique';
  
  var cleanBase = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  var finalBase = cleanBase || 'boutique';
  var timestamp = Date.now().toString().slice(-6);
  var random = Math.floor(Math.random() * 1000);
  return finalBase + '-' + timestamp + '-' + random;
};

const boutiqueCtrl = {
  
  // ============================================
  // CREATE BOUTIQUE (CORREGIDO)
  // ============================================
// ============ CREATE BOUTIQUE - LÓGICA CORREGIDA ============
createBoutique: async function(req, res) {
  try {
    console.log('🔵 Creando boutique');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));
    
    var boutiqueData = req.body;
    var user = req.user;
    
    // Validación de campos requeridos
    var requiredFields = ['nom_boutique', 'categorie'];
    var missingFields = [];
    
    for (var i = 0; i < requiredFields.length; i++) {
      var field = requiredFields[i];
      if (!boutiqueData[field]) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Champs requis manquants: ' + missingFields.join(', ')
      });
    }
    
    // Obtener USER ID
    var userId = user._id || boutiqueData.user;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Utilisateur non identifié' 
      });
    }
    
    // Manejo de imágenes según el plan
    var images = boutiqueData.images || [];
    var isFreePlan = (boutiqueData.plan === 'gratuit');
    
    // 🔥 LÓGICA CORREGIDA:
    // - TODAS las boutiques requieren aprobación (pendiente = true)
    // - Gratuitas: isActive = true (activadas automáticamente)
    // - De pago: isActive = false (esperan pago)
    var isPendiente = true;                    // SIEMPRE true - todas requieren aprobación
    var isActive = isFreePlan ? true : false;  // Gratis=true, Pago=false
    
    console.log('📊 Plan:', boutiqueData.plan, '| Gratuito:', isFreePlan);
    console.log('📊 Pendiente (requiere aprobación):', isPendiente);
    console.log('📊 Activo (visible al público):', isActive);
    console.log('📊 Explicación:', isFreePlan ? 
      'Gratuita → Aprobación requerida, pero activación automática (prueba 5 días)' : 
      'De pago → Aprobación requerida + espera pago para activación');
    
    // Logo por defecto para plan gratuito (si no hay imágenes)
    if (isFreePlan && (!images || images.length === 0)) {
      images = [{
        url: 'https://res.cloudinary.com/dfjipgj2o/image/upload/q_auto/f_auto/v1775747960/boutique_to7oea.jpg',
        public_id: 'default_logo_free'
      }];
      console.log('🖼️ Logo por defecto asignado para plan gratuito');
    }
    
    // Validar imágenes solo para planes pagos
    if (!isFreePlan && (!images || images.length === 0)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Au moins une image est requise pour les boutiques payantes' 
      });
    }
    
    // Verificar dominio único
    if (boutiqueData.domaine_boutique) {
      var existingBoutique = await Boutique.findOne({ 
        domaine_boutique: boutiqueData.domaine_boutique 
      });
      if (existingBoutique) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ce domaine est déjà utilisé' 
        });
      }
    }
    
    // Buscar o crear categoría Boutiques
    var boutiquesCategory = await Category.findOne({ slug: 'boutiques', level: 1 });
    if (!boutiquesCategory) {
      boutiquesCategory = await Category.create({
        name: 'Boutiques',
        slug: 'boutiques',
        level: 1,
        description: 'Toutes les boutiques du marketplace',
        isActive: true
      });
    }
    
    // Generar slug
    var slugBase = boutiqueData.domaine_boutique || boutiqueData.nom_boutique;
    var slug = generateUniqueSlug(slugBase);
    var domaine_boutique = boutiqueData.domaine_boutique || slug;
    
    // Generar subCategory
    var subCategory = 'boutique-' + boutiqueData.categorie
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[&]/g, 'et')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Asegurar que description_boutique tenga valor
    var descriptionValue = boutiqueData.description_boutique;
    if (!descriptionValue || descriptionValue.trim() === '') {
      descriptionValue = 'Description de la boutique';
    }
    
    // 🔥 Calcular fecha de expiración según plan y duración
    var dateExpiration = null;
    var dateDebut = boutiqueData.date_debut || new Date();
    
    if (isFreePlan) {
      // Plan gratuito: expira en 5 días por defecto
      var daysToAdd = 5;
      if (boutiqueData.duree_abonnement === '1mois') daysToAdd = 30;
      else if (boutiqueData.duree_abonnement === '3mois') daysToAdd = 90;
      else if (boutiqueData.duree_abonnement === '6mois') daysToAdd = 180;
      else if (boutiqueData.duree_abonnement === '1an') daysToAdd = 365;
      else daysToAdd = 5;
      
      dateExpiration = new Date(dateDebut);
      dateExpiration.setDate(dateExpiration.getDate() + daysToAdd);
    } else {
      // Plan de pago: usar fecha enviada o calcular
      dateExpiration = boutiqueData.date_expiration || null;
    }
    
    // Crear boutique
    var newBoutique = new Boutique({
      user: userId,
      categorie: boutiqueData.categorie,
      subCategory: boutiqueData.subCategory || subCategory,
      articleType: boutiqueData.articleType || '',
      category: boutiquesCategory._id,
      nom_boutique: boutiqueData.nom_boutique,
      domaine_boutique: domaine_boutique,
      slug: slug,
      slogan_boutique: boutiqueData.slogan_boutique || '',
      description_boutique: descriptionValue,
      images: images,
      header_images: boutiqueData.header_images || [],
      plan: boutiqueData.plan || 'gratuit',
      duree_abonnement: boutiqueData.duree_abonnement || '1mois',
      date_debut: dateDebut,
      date_expiration: dateExpiration,
      proprietaire: boutiqueData.proprietaire || {},
      reseaux_sociaux: boutiqueData.reseaux_sociaux || {},
      couleur_theme: boutiqueData.couleur_theme || '#2563eb',
      montant_initial: boutiqueData.montant_initial || 0,
      montant_ttc: boutiqueData.montant_ttc || 0,
      transaction_id: boutiqueData.transaction_id || 'TR-' + Date.now(),
      pendiente: isPendiente,     // 🔥 SIEMPRE true
      isActive: isActive           // 🔥 Gratis=true, Pago=false
    });
    
    await newBoutique.save();
    
    console.log('✅ Boutique creada exitosamente, ID:', newBoutique._id);
    console.log('📊 Estado final:');
    console.log('   - Pendiente (aprobación):', newBoutique.pendiente);
    console.log('   - Activo (visible):', newBoutique.isActive);
    console.log('   - Expira:', newBoutique.date_expiration);
    
    var successMessage = isFreePlan ?
      'Votre boutique gratuite a été créée. Elle sera visible après validation par un administrateur.' :
      'Votre boutique a été créée. Elle sera activée après validation et confirmation de paiement.';
    
    res.status(201).json({
      success: true,
      message: successMessage,
      boutique: {
        _id: newBoutique._id,
        nom_boutique: newBoutique.nom_boutique,
        domaine_boutique: newBoutique.domaine_boutique,
        slug: newBoutique.slug,
        images: newBoutique.images,
        plan: newBoutique.plan,
        isActive: newBoutique.isActive,
        pendiente: newBoutique.pendiente,
        date_expiration: newBoutique.date_expiration
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
},
  // ============================================
  // GET BOUTIQUE BY ID (con control de pendiente)
  // ============================================
// ============================================
// GET BOUTIQUE BY ID (con control de permisos)
// ============================================
getBoutique: async function(req, res) {
  try {
    var id = req.params.id;
    var userId = req.user ? req.user._id : null;
    var userRole = req.user ? req.user.role : null;
    
    console.log('🔍 Buscando boutique:', id);
    console.log('👤 Usuario:', { userId, userRole });
    
    var boutique = await Boutique.findById(id)
      .populate('user', 'name username avatar email mobile')
      .lean();
    
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }
    
    // 🔥 CONTROL DE PERMISOS
    var isAdmin = (userRole === 'admin' || userRole === 'moderator');
    var isOwner = userId && boutique.user && boutique.user._id.toString() === userId.toString();
    
    console.log('📊 Estado boutique:', {
      pendiente: boutique.pendiente,
      isActive: boutique.isActive,
      isAdmin,
      isOwner
    });
    
    // Caso 1: Boutique pendiente (esperando aprobación)
    if (boutique.pendiente === true) {
      // Solo admin o propietario pueden verla
      if (!isAdmin && !isOwner) {
        console.log('❌ Acceso denegado - Boutique pendiente');
        return res.status(403).json({ 
          success: false, 
          message: 'Cette boutique est en attente de validation.' 
        });
      }
    }
    
    // Caso 2: Boutique inactiva (isActive = false)
    if (boutique.isActive === false && boutique.pendiente === false) {
      // Solo admin puede ver boutiques inactivas (esperando pago)
      if (!isAdmin && !isOwner) {
        console.log('❌ Acceso denegado - Boutique inactive');
        return res.status(403).json({ 
          success: false, 
          message: 'Cette boutique n\'est pas encore active.' 
        });
      }
    }
    
    // Calcular contadores
    var followersCount = (boutique.followers || []).length;
    var likesCount = (boutique.likes || []).length;
    var produitsCount = (boutique.stats && boutique.stats.produits) || 0;
    
    // Estado de interacción
    var isFollowing = false;
    var isLiked = false;
    
    if (userId) {
      isFollowing = (boutique.followers || []).some(f => f.toString() === userId.toString());
      isLiked = (boutique.likes || []).some(l => l.toString() === userId.toString());
    }
    
    var boutiqueData = {
      ...boutique,
      followersCount: followersCount,
      likesCount: likesCount,
      stats: {
        ...(boutique.stats || {}),
        produits: produitsCount
      },
      isFollowing: isFollowing,
      isLiked: isLiked
    };
    
    console.log('✅ Acceso permitido a boutique:', boutique.nom_boutique);
    
    res.json({
      success: true,
      boutique: boutiqueData
    });
    
  } catch (error) {
    console.error('❌ Error en getBoutique:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération de la boutique', 
      error: error.message 
    });
  }
},
  // ============================================
  // GET BOUTIQUES PENDIENTES (Admin)
  // ============================================
  getBoutiquesPendientes: async function(req, res) {
    try {
      var page = parseInt(req.query.page) || 1;
      var limit = parseInt(req.query.limit) || 10;
      var skip = (page - 1) * limit;
      
      // Verificar permisos
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      var query = { pendiente: true };
      var total = await Boutique.countDocuments(query);
      var boutiques = await Boutique.find(query)
        .populate('user', 'username email name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean();
      
      res.json({
        success: true,
        boutiques: boutiques,
        total: total,
        page: page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + boutiques.length < total
      });
      
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // ============================================
  // COUNT BOUTIQUES PENDIENTES (Admin)
  // ============================================
  getBoutiquesPendientesCount: async function(req, res) {
    try {
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      var count = await Boutique.countDocuments({ pendiente: true });
      res.json({ success: true, count: count });
      
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // ============================================
  // APROBAR BOUTIQUE (Admin)
  // ============================================
  // ============================================
// APROBAR BOUTIQUE (Admin)
// ============================================
// ============================================
// APROBAR BOUTIQUE (Admin) - Solo quita pendiente
// ============================================
aprobarBoutique: async function(req, res) {
  try {
    var id = req.params.id;
    
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      return res.status(403).json({ success: false, message: "Non autorisé" });
    }
    
    var boutique = await Boutique.findById(id);
    if (!boutique) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée" });
    }
    
    if (!boutique.pendiente) {
      return res.status(400).json({ success: false, message: "Déjà approuvée" });
    }
    
    // 🔥 Solo quitamos pendiente, NO tocamos isActive
    boutique.pendiente = false;
    await boutique.save();
    
    var message = boutique.plan === 'gratuit' ?
      "Boutique gratuite approuvée. Elle est déjà active et visible." :
      "Boutique approuvée. En attente de paiement pour activation.";
    
    console.log(`✅ Boutique approuvée: ${boutique.nom_boutique} (${boutique.plan}) par ${req.user.username}`);
    
    res.json({
      success: true,
      message: message,
      boutique: {
        _id: boutique._id,
        nom_boutique: boutique.nom_boutique,
        plan: boutique.plan,
        pendiente: boutique.pendiente,
        isActive: boutique.isActive
      }
    });
    
  } catch (error) {
    console.error('❌ Error en aprobarBoutique:', error);
    res.status(500).json({ success: false, error: error.message });
  }
},
  // ============================================
  // RECHAZAR BOUTIQUE (Admin)
  // ============================================
  rechazarBoutique: async function(req, res) {
    try {
      var id = req.params.id;
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      var boutique = await Boutique.findByIdAndDelete(id);
      if (!boutique) {
        return res.status(404).json({ success: false, message: "Boutique non trouvée" });
      }
      
      res.json({ success: true, message: "Boutique rejetée et supprimée" });
      
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // ============================================
  // GET BOUTIQUES APROBADAS (Admin)
  // ============================================
  getBoutiquesAprobadas: async function(req, res) {
    try {
      var page = parseInt(req.query.page) || 1;
      var limit = parseInt(req.query.limit) || 10;
      var skip = (page - 1) * limit;
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      var query = { pendiente: false };
      var total = await Boutique.countDocuments(query);
      var boutiques = await Boutique.find(query)
        .populate('user', 'username email name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .lean();
      
      res.json({
        success: true,
        boutiques: boutiques,
        total: total,
        page: page,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + boutiques.length < total
      });
      
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // ============================================
  // UPDATE ADMIN BOUTIQUE STATUS
  // ============================================
  updateAdminBoutiqueStatus: async function(req, res) {
    try {
      var id = req.params.id;
      var isActive = req.body.isActive;
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      var boutique = await Boutique.findById(id);
      if (!boutique) {
        return res.status(404).json({ success: false, message: "Boutique non trouvée" });
      }
      
      boutique.isActive = isActive;
      await boutique.save();
      
      res.json({
        success: true,
        message: isActive ? "Boutique activée" : "Boutique désactivée",
        boutique: { _id: boutique._id, isActive: boutique.isActive }
      });
      
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
  
  // ============================================
  // GET USER BOUTIQUES
  // ============================================
  getUserBoutiques: async function(req, res) {
    try {
      var user = req.user;
      var boutiques = await Boutique.find({ user: user._id })
        .sort({ createdAt: -1 })
        .lean();
      
      res.json({ success: true, boutiques: boutiques });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // UPDATE BOUTIQUE
  // ============================================
  updateBoutique: async function(req, res) {
    try {
      var id = req.params.boutiqueId;
      var updateData = req.body;
      var user = req.user;
      
      var boutique = await Boutique.findById(id);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      }
      
      var updatedBoutique = await Boutique.findByIdAndUpdate(id, updateData, { new: true });
      
      res.json({ success: true, message: 'Boutique mise à jour', boutique: updatedBoutique });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // DELETE BOUTIQUE
  // ============================================
   deleteBoutique : async (req, res) => {
    try {
      const boutiqueId = req.params.boutiqueId;
      const userId = req.user._id;
      const userRole = req.user.role;
  
      console.log('🗑️ Eliminando boutique:', boutiqueId);
      console.log('👤 Usuario:', userId, 'Rol:', userRole);
  
      // Buscar la boutique
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }
  
      // Verificar permisos (dueño o admin)
      const isOwner = boutique.user.toString() === userId.toString();
      const isAdmin = userRole === 'admin' || userRole === 'moderator';
      
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ 
          success: false, 
          message: 'Non autorisé à supprimer cette boutique' 
        });
      }
  
      // Array para almacenar errores
      const deletionErrors = [];
  
      // ============================================
      // 1. ELIMINAR PRODUCTOS DE LA BOUTIQUE
      // ============================================
      const products = await BoutiqueProduct.find({ boutique: boutiqueId });
      
      if (products.length > 0) {
        console.log(`📦 Eliminando ${products.length} productos de la boutique...`);
        
        for (const product of products) {
          // Eliminar imágenes del producto de Cloudinary
          if (product.images && product.images.length > 0) {
            for (const image of product.images) {
              if (image.public_id) {
                try {
                  await cloudinary.uploader.destroy(image.public_id);
                  console.log(`  ✅ Imagen de producto eliminada: ${image.public_id}`);
                } catch (err) {
                  console.error(`  ❌ Error eliminando imagen ${image.public_id}:`, err.message);
                  deletionErrors.push(`Producto ${product._id} - Imagen: ${err.message}`);
                }
              }
            }
          }
          
          // Eliminar el producto de la base de datos
          await BoutiqueProduct.findByIdAndDelete(product._id);
        }
        console.log('✅ Todos los productos eliminados');
      }
  
      // ============================================
      // 2. ELIMINAR IMÁGENES DE LA BOUTIQUE DE CLOUDINARY
      // ============================================
      
      // Eliminar imágenes del logo/header
      if (boutique.images && boutique.images.length > 0) {
        console.log(`🖼️ Eliminando ${boutique.images.length} imágenes de boutique...`);
        
        for (const image of boutique.images) {
          if (image.public_id) {
            try {
              await cloudinary.uploader.destroy(image.public_id);
              console.log(`  ✅ Imagen de boutique eliminada: ${image.public_id}`);
            } catch (err) {
              console.error(`  ❌ Error eliminando imagen ${image.public_id}:`, err.message);
              deletionErrors.push(`Imagen boutique: ${err.message}`);
            }
          } else if (image.url && image.url.includes('cloudinary.com')) {
            // Intentar extraer public_id de la URL
            try {
              const cloudinaryUrlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.\w+$/;
              const match = image.url.match(cloudinaryUrlPattern);
              if (match) {
                const publicId = match[1];
                await cloudinary.uploader.destroy(publicId);
                console.log(`  ✅ Imagen eliminada por URL: ${publicId}`);
              }
            } catch (err) {
              console.error(`  ❌ Error eliminando imagen por URL:`, err.message);
            }
          }
        }
      }
  
      // Eliminar header_images
      if (boutique.header_images && boutique.header_images.length > 0) {
        console.log(`📸 Eliminando ${boutique.header_images.length} header images...`);
        
        for (const headerImage of boutique.header_images) {
          if (headerImage.public_id) {
            try {
              await cloudinary.uploader.destroy(headerImage.public_id);
              console.log(`  ✅ Header image eliminada: ${headerImage.public_id}`);
            } catch (err) {
              console.error(`  ❌ Error eliminando header image:`, err.message);
              deletionErrors.push(`Header image: ${err.message}`);
            }
          }
        }
      }
  
      // ============================================
      // 3. LIMPIAR REFERENCIAS EN USUARIOS
      // ============================================
      
      // Eliminar de followers
      if (boutique.followers && boutique.followers.length > 0) {
        try {
          await User.updateMany(
            { _id: { $in: boutique.followers } },
            { $pull: { followingBoutiques: boutiqueId } }
          );
          console.log('✅ Referencias de followers limpiadas');
        } catch (err) {
          console.error('❌ Error limpiando followers:', err.message);
          deletionErrors.push(`Followers: ${err.message}`);
        }
      }
  
      // Eliminar de likes
      if (boutique.likes && boutique.likes.length > 0) {
        try {
          await User.updateMany(
            { _id: { $in: boutique.likes } },
            { $pull: { likedBoutiques: boutiqueId } }
          );
          console.log('✅ Referencias de likes limpiadas');
        } catch (err) {
          console.error('❌ Error limpiando likes:', err.message);
          deletionErrors.push(`Likes: ${err.message}`);
        }
      }
  
      // ============================================
      // 4. ELIMINAR LA BOUTIQUE DE LA BASE DE DATOS
      // ============================================
      await Boutique.findByIdAndDelete(boutiqueId);
      console.log('✅ Boutique eliminada de la base de datos');
  
      // Respuesta final
      const message = deletionErrors.length > 0 
        ? `Boutique supprimée, mais avec quelques avertissements: ${deletionErrors.join(', ')}`
        : 'Boutique supprimée avec succès';
  
      res.json({ 
        success: true, 
        message: message,
        deletedBoutiqueId: boutiqueId,
        deletedProductsCount: products.length,
        warnings: deletionErrors.length > 0 ? deletionErrors : undefined
      });
  
    } catch (error) {
      console.error('❌ Error en deleteBoutique:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },
  // ============================================
  // FILTER BOUTIQUES (Home)
  // ============================================
  filterBoutiques: async function(req, res) {
    try {
      var page = parseInt(req.query.page) || 1;
      var limit = parseInt(req.query.limit) || 12;
      var skip = (page - 1) * limit;
      
      var user = req.user;
      var filter = { isActive: true };
      
      // 🔥 CLAVE: Solo mostrar boutiques aprobadas al público
      if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        filter.pendiente = false;
      }
      
      var boutiques = await Boutique.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name username avatar')
        .lean();
      
      var total = await Boutique.countDocuments(filter);
      
      res.json({
        success: true,
        boutiques: boutiques,
        total: total,
        page: page,
        hasMore: skip + boutiques.length < total
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // ADD VIEW
  // ============================================
  addView: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var userId = req.user ? req.user._id : null;
      var ip = req.ip || req.connection.remoteAddress;
      var sessionId = req.sessionID;
      var viewerId = userId ? userId.toString() : (sessionId || ip);
      
      var boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      if (!boutique.viewHistory) {
        boutique.viewHistory = [];
      }
      
      var oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      boutique.viewHistory = boutique.viewHistory.filter(function(view) {
        return view.timestamp && view.timestamp > oneDayAgo;
      });
      
      var existingView = null;
      for (var i = 0; i < boutique.viewHistory.length; i++) {
        if (boutique.viewHistory[i].viewerId === viewerId) {
          existingView = boutique.viewHistory[i];
          break;
        }
      }
      
      if (!existingView) {
        boutique.viewHistory.push({
          viewerId: viewerId,
          timestamp: new Date(),
          userAgent: req.headers['user-agent'] || 'unknown'
        });
        boutique.views = (boutique.views || 0) + 1;
        await boutique.save();
      }
      
      res.json({ success: true, views: boutique.views || 0 });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // FOLLOW BOUTIQUE
  // ============================================
  followBoutique: async function(req, res) {
    try {
      var userId = req.user._id;
      var boutiqueId = req.params.boutiqueId;
      
      var boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      if (!boutique.followers) {
        boutique.followers = [];
      }
      
      var alreadyFollowing = false;
      for (var i = 0; i < boutique.followers.length; i++) {
        if (boutique.followers[i].toString() === userId.toString()) {
          alreadyFollowing = true;
          break;
        }
      }
      
      if (alreadyFollowing) {
        boutique.followers = boutique.followers.filter(function(id) {
          return id.toString() !== userId.toString();
        });
      } else {
        boutique.followers.push(userId);
      }
      
      await boutique.save();
      
      res.json({
        success: true,
        following: !alreadyFollowing,
        followersCount: boutique.followers.length
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // LIKE BOUTIQUE
  // ============================================
  likeBoutique: async function(req, res) {
    try {
      var userId = req.user._id;
      var boutiqueId = req.params.boutiqueId;
      
      var boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      if (!boutique.likes) {
        boutique.likes = [];
      }
      
      var alreadyLiked = false;
      for (var i = 0; i < boutique.likes.length; i++) {
        if (boutique.likes[i].toString() === userId.toString()) {
          alreadyLiked = true;
          break;
        }
      }
      
      if (alreadyLiked) {
        boutique.likes = boutique.likes.filter(function(id) {
          return id.toString() !== userId.toString();
        });
      } else {
        boutique.likes.push(userId);
      }
      
      await boutique.save();
      
      res.json({
        success: true,
        liked: !alreadyLiked,
        likesCount: boutique.likes.length
      });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // GET BOUTIQUE FOLLOWERS COUNT
  // ============================================
  getBoutiqueFollowers: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var boutique = await Boutique.findById(boutiqueId).select('followers');
      
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      var followersCount = boutique.followers ? boutique.followers.length : 0;
      var userFollowing = false;
      
      if (req.user && req.user._id) {
        for (var i = 0; i < (boutique.followers || []).length; i++) {
          if (boutique.followers[i].toString() === req.user._id.toString()) {
            userFollowing = true;
            break;
          }
        }
      }
      
      res.json({ success: true, followersCount: followersCount, userFollowing: userFollowing });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  // ============================================
  // GET BOUTIQUE LIKES COUNT
  // ============================================
  getBoutiqueLikes: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var boutique = await Boutique.findById(boutiqueId).select('likes');
      
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      var likesCount = boutique.likes ? boutique.likes.length : 0;
      var userLiked = false;
      
      if (req.user && req.user._id) {
        for (var i = 0; i < (boutique.likes || []).length; i++) {
          if (boutique.likes[i].toString() === req.user._id.toString()) {
            userLiked = true;
            break;
          }
        }
      }
      
      res.json({ success: true, likesCount: likesCount, userLiked: userLiked });
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

 
// ============================================
// UPDATE BOUTIQUE HEADER IMAGES
// ============================================
updateBoutiqueHeaderImages: async function(req, res) {
  try {
    console.log('='.repeat(50));
    console.log('🖼️ INICIO updateBoutiqueHeaderImages');
    
    const boutiqueId = req.params.boutiqueId;
    // Aceptar tanto header_images como images (para compatibilidad)
    const headerImages = req.body.header_images || req.body.images || [];
    const user = req.user;

    console.log('📌 Datos recibidos:', {
      boutiqueId: boutiqueId,
      headerImagesLength: headerImages.length,
      userId: user._id,
      source: req.body.header_images ? 'header_images' : (req.body.images ? 'images' : 'ninguno')
    });

    // Validaciones básicas
    if (!user) {
      console.error('❌ Usuario no autenticado');
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    if (!boutiqueId) {
      console.error('❌ ID de boutique no proporcionado');
      return res.status(400).json({ 
        success: false, 
        message: 'ID de boutique requis' 
      });
    }

    // Buscar boutique
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      console.error('❌ Boutique no encontrada:', boutiqueId);
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    // Verificar propiedad
    if (boutique.user.toString() !== user._id.toString()) {
      console.error('❌ Usuario no autorizado:', {
        boutiqueUser: boutique.user.toString(),
        currentUser: user._id.toString()
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé' 
      });
    }

    // Validar que sea array
    if (!Array.isArray(headerImages)) {
      console.error('❌ header_images no es un array:', typeof headerImages);
      return res.status(400).json({ 
        success: false, 
        message: 'header_images doit être un tableau' 
      });
    }

    // Verificar si las imágenes tienen file (no debería pasar porque ya se subieron en el frontend)
    var hasFiles = false;
    for (var i = 0; i < headerImages.length; i++) {
      if (headerImages[i].file) {
        hasFiles = true;
        break;
      }
    }
    
    if (hasFiles) {
      console.warn('⚠️ Las imágenes tienen objetos file - esto debería haberse subido antes');
      return res.status(400).json({
        success: false,
        message: 'Les images doivent être téléchargées avant d\'être envoyées au serveur'
      });
    }

    // Asegurar que cada imagen tenga el formato correcto
    var finalHeaderImages = [];
    for (var j = 0; j < headerImages.length; j++) {
      var img = headerImages[j];
      if (typeof img === 'string') {
        finalHeaderImages.push({ url: img, public_id: null });
      } else {
        finalHeaderImages.push({
          url: img.url || img.secure_url,
          public_id: img.public_id || null,
          alt: img.alt || 'Header image'
        });
      }
    }

    console.log('📦 Guardando header_images:', finalHeaderImages.length);

    // ACTUALIZAR
    boutique.header_images = finalHeaderImages;
    boutique.updatedAt = Date.now();
    await boutique.save();

    console.log('✅ Guardado exitoso:', finalHeaderImages.length, 'imágenes');

    res.json({
      success: true,
      message: 'Images mises à jour',
      header_images: boutique.header_images
    });

  } catch (error) {
    console.error('❌ Error en updateBoutiqueHeaderImages:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
},

// ============================================
// DELETE BOUTIQUE HEADER IMAGE
// ============================================
deleteBoutiqueHeaderImage: async function(req, res) {
  try {
    var boutiqueId = req.params.boutiqueId;
    var imageId = req.params.imageId;
    var user = req.user;

    console.log('🗑️ Eliminando imagen de header:', { boutiqueId: boutiqueId, imageId: imageId });

    // Buscar la boutique
    var boutique = await Boutique.findById(boutiqueId);

    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    // Verificar propiedad
    if (boutique.user.toString() !== user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à modifier cette boutique' 
      });
    }

    // Buscar la imagen a eliminar
    var imageToDelete = null;
    var imageIndex = -1;
    for (var i = 0; i < boutique.header_images.length; i++) {
      var img = boutique.header_images[i];
      if (img._id && img._id.toString() === imageId) {
        imageToDelete = img;
        imageIndex = i;
        break;
      }
      if (img.public_id === imageId) {
        imageToDelete = img;
        imageIndex = i;
        break;
      }
    }

    if (!imageToDelete) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image non trouvée' 
      });
    }

    // Eliminar de Cloudinary si tiene public_id
    if (imageToDelete.public_id) {
      try {
        var cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.destroy(imageToDelete.public_id);
        console.log('✅ Imagen eliminada de Cloudinary:', imageToDelete.public_id);
      } catch (cloudinaryErr) {
        console.warn('⚠️ No se pudo eliminar de Cloudinary:', cloudinaryErr.message);
        // Continuamos aunque falle Cloudinary
      }
    }

    // Eliminar del array
    var newHeaderImages = [];
    for (var j = 0; j < boutique.header_images.length; j++) {
      if (j !== imageIndex) {
        newHeaderImages.push(boutique.header_images[j]);
      }
    }
    
    boutique.header_images = newHeaderImages;
    boutique.updatedAt = Date.now();
    await boutique.save();

    console.log('✅ Imagen eliminada correctamente');

    res.json({
      success: true,
      message: 'Image supprimée avec succès',
      header_images: boutique.header_images
    });

  } catch (error) {
    console.error('❌ Error en deleteBoutiqueHeaderImage:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ============================================
// CHECK IF USER FOLLOWS BOUTIQUE
// ============================================
checkFollowBoutique: async function(req, res) {
  try {
    const userId = req.user._id;
    const boutiqueId = req.params.boutiqueId;

    const boutique = await Boutique.findById(boutiqueId).select('followers');
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    var following = false;
    if (boutique.followers) {
      for (var i = 0; i < boutique.followers.length; i++) {
        if (boutique.followers[i].toString() === userId.toString()) {
          following = true;
          break;
        }
      }
    }
    
    res.json({ 
      success: true, 
      following: following 
    });
    
  } catch (error) {
    console.error('❌ Error en checkFollowBoutique:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ============================================
// CHECK IF USER LIKED BOUTIQUE
// ============================================
checkLikeBoutique: async function(req, res) {
  try {
    const userId = req.user._id;
    const boutiqueId = req.params.boutiqueId;

    const boutique = await Boutique.findById(boutiqueId).select('likes');
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    var liked = false;
    if (boutique.likes) {
      for (var i = 0; i < boutique.likes.length; i++) {
        if (boutique.likes[i].toString() === userId.toString()) {
          liked = true;
          break;
        }
      }
    }
    
    res.json({ 
      success: true, 
      liked: liked 
    });
    
  } catch (error) {
    console.error('❌ Error en checkLikeBoutique:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
 
  // ============================================
// GET VIEWERS LIST (Usuarios que han visto la boutique)
// ============================================
getViewersList: async function(req, res) {
  try {
    const boutiqueId = req.params.boutiqueId;
    
    console.log('📊 Obteniendo lista de viewers para boutique:', boutiqueId);
    
    const boutique = await Boutique.findById(boutiqueId).select('viewHistory');
    
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }
    
    // Obtener los IDs de los viewers únicos de las últimas 24 horas
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    var recentViews = [];
    
    if (boutique.viewHistory && boutique.viewHistory.length > 0) {
      for (var i = 0; i < boutique.viewHistory.length; i++) {
        if (boutique.viewHistory[i].timestamp && boutique.viewHistory[i].timestamp > oneDayAgo) {
          recentViews.push(boutique.viewHistory[i]);
        }
      }
    }
    
    // Obtener IDs únicos
    var viewerIds = [];
    var seenIds = {};
    
    for (var j = 0; j < recentViews.length; j++) {
      var viewerId = recentViews[j].viewerId;
      if (!seenIds[viewerId]) {
        seenIds[viewerId] = true;
        viewerIds.push(viewerId);
      }
    }
    
    // Obtener información de los usuarios
    var viewers = [];
    
    if (viewerIds.length > 0) {
      const User = require('../models/userModel');
      viewers = await User.find(
        { _id: { $in: viewerIds } },
        'name username avatar email'
      ).lean();
    }
    
    console.log(`✅ ${viewers.length} viewers encontrados para boutique ${boutiqueId}`);
    
    res.json({
      success: true,
      viewers: viewers,
      count: viewers.length
    });
    
  } catch (error) {
    console.error('❌ Error en getViewersList:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ============================================
// GET FOLLOWERS LIST (Usuarios que siguen la boutique)
// ============================================
getFollowersList: async function(req, res) {
  try {
    const boutiqueId = req.params.boutiqueId;
    
    console.log('📊 Obteniendo lista de followers para boutique:', boutiqueId);
    
    const boutique = await Boutique.findById(boutiqueId)
      .select('followers nom_boutique')
      .populate('followers', 'name username avatar email');
    
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }
    
    const followers = boutique.followers || [];
    
    console.log(`✅ ${followers.length} followers encontrados para boutique ${boutiqueId}`);
    
    res.json({
      success: true,
      followers: followers,
      count: followers.length,
      boutique: {
        id: boutique._id,
        nom: boutique.nom_boutique
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getFollowersList:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ============================================
// GET LIKES LIST (Usuarios que dieron like a la boutique)
// ============================================
getLikesList: async function(req, res) {
  try {
    const boutiqueId = req.params.boutiqueId;
    
    console.log('📊 Obteniendo lista de likes para boutique:', boutiqueId);
    
    const boutique = await Boutique.findById(boutiqueId)
      .select('likes nom_boutique')
      .populate('likes', 'name username avatar email');
    
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }
    
    const likes = boutique.likes || [];
    
    console.log(`✅ ${likes.length} likes encontrados para boutique ${boutiqueId}`);
    
    res.json({
      success: true,
      likes: likes,
      count: likes.length,
      boutique: {
        id: boutique._id,
        nom: boutique.nom_boutique
      }
    });
    
  } catch (error) {
    console.error('❌ Error en getLikesList:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ============================================
// ACTIVAR BOUTIQUE DE PAGO (Admin - después de confirmar pago)
// ============================================
activarBoutiquePago: async function(req, res) {
  try {
    var id = req.params.id;
    
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
      return res.status(403).json({ success: false, message: "Non autorisé" });
    }
    
    var boutique = await Boutique.findById(id);
    if (!boutique) {
      return res.status(404).json({ success: false, message: "Boutique non trouvée" });
    }
    
    // Solo se puede activar si no es plan gratuito
    if (boutique.plan === 'gratuit') {
      return res.status(400).json({ 
        success: false, 
        message: "Les boutiques gratuites sont automatiquement activées" 
      });
    }
    
    if (boutique.isActive === true) {
      return res.status(400).json({ success: false, message: "Déjà activée" });
    }
    
    // Activar boutique
    boutique.isActive = true;
    await boutique.save();
    
    console.log(`✅ Boutique de pago activée: ${boutique.nom_boutique} par ${req.user.username}`);
    
    res.json({
      success: true,
      message: "Boutique activée avec succès après confirmation du paiement",
      boutique: {
        _id: boutique._id,
        nom_boutique: boutique.nom_boutique,
        plan: boutique.plan,
        isActive: boutique.isActive
      }
    });
    
  } catch (error) {
    console.error('❌ Error en activarBoutiquePago:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

};

module.exports = boutiqueCtrl;