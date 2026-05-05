const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// ============================================
// 1️⃣ RUTAS ESTÁTICAS (sin parámetros)
// ============================================
router.get('/health', postCtrl.healthCheck);
router.get('/', postCtrl.getPosts);
router.get('/featured', postCtrl.getFeaturedPosts);
router.get('/recent', postCtrl.getRecentPosts);
router.get('/getSavePosts', auth, postCtrl.getSavePosts);

// ============================================
// 2️⃣ RUTAS CON QUERY PARAMS
// ============================================
router.get('/posts/filter', postCtrl.filterPosts);
router.get('/posts/similar', postCtrl.getSimilarPosts);
router.get('/posts/filters/options', postCtrl.getFilterOptions);

// ============================================
// 3️⃣ RUTAS DE ADMIN (fijas, antes que parámetros)
// ============================================
router.get('/posts/admin/pendientes/counts/all', auth, postCtrl.getAllPostsPendientesCounts);
router.get('/posts/admin/pendientes/count', auth, postCtrl.getPostsPendientesCount);
router.get('/posts/admin/pendientes', auth, postCtrl.getPostsPendientes);
router.patch('/post/:id/aprobar', auth, postCtrl.aprobarPost);
router.delete('/posts/admin/rechazar/:id', auth, postCtrl.deletePost);

// ============================================
// 4️⃣ RUTAS CON PARÁMETROS DE BÚSQUEDA
// ============================================
router.get('/search/:query', postCtrl.searchPosts);
router.get('/user_posts/:id', auth, postCtrl.getUserPosts);
router.get('/public/user_posts/:userId', postCtrl.getPublicUserPosts);

// ============================================
// 5️⃣ RUTAS DE CREACIÓN (POST)
// ============================================
router.post('/posts', auth, postCtrl.createPost);

// ============================================
// 6️⃣ RUTAS DE INTERACCIÓN (con parámetros)
// ============================================
router.patch('/post/:id/like', auth, postCtrl.likePost);
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost);
router.patch('/savePost/:id', auth, postCtrl.savePost);
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost);
router.patch('/post/:id/view', postCtrl.addView);

// ============================================
// 7️⃣ RUTAS CON ID (deben ir al final)
// ============================================
router.get('/post/:id',  postCtrl.getPost);
router.get('/posts/:id', postCtrl.getPostById);

router.route('/post/:id')
  .patch(auth, postCtrl.updatePost)
  .delete(auth, postCtrl.deletePost);

module.exports = router;