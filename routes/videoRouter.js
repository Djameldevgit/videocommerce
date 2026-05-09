// routes/videoRoutes.js - VERSIÓN COMPLETA CON RUTAS COMERCIALES

const router = require('express').Router();
const videoCtrl = require('../controllers/videoCtrl');
const auth = require('../middleware/auth');
 
// ============================================
// ✅ RUTAS ESPECÍFICAS (DEBEN IR ANTES QUE :id)
// ============================================

// Música
router.get('/music', videoCtrl.getMusicLibrary);
 
// Filtros y listados
router.get('/videos/filter', videoCtrl.filterVideos);
router.get('/videos/featured', videoCtrl.getFeaturedVideos);
router.get('/videos/popular', videoCtrl.getPopularVideos);
router.get('/videos/trending', videoCtrl.getTrendingVideos);
router.get('/videos/category/:categorySlug', videoCtrl.getVideosByCategory);

// 🆕 RUTAS COMERCIALES PÚBLICAS (ESPECÍFICAS, ANTES DE :id)
router.get('/videos/commercial/filter', videoCtrl.filterCommercialVideos);
router.get('/videos/commercial/nearby', videoCtrl.getVideosNearby);

// Rutas públicas específicas (antes de :id)
router.get('/videos/public/:id', videoCtrl.getVideoByIdPublic);

// Rutas privadas específicas (antes de :id)
router.get('/videos/private/:id', auth, videoCtrl.getVideoByIdPrivate);

// 🆕 RUTAS COMERCIALES PROTEGIDAS (ESPECÍFICAS, ANTES DE :id)
router.get('/videos/commercial/my-videos', auth, videoCtrl.getMyCommercialVideos);
router.patch('/videos/commercial/toggle-wholesale/:id', auth, videoCtrl.toggleWholesale);
router.patch('/videos/commercial/update-stock/:id', auth, videoCtrl.updateStock);
router.patch('/videos/commercial/update-location/:id', auth, videoCtrl.updateVideoLocation);

// Rutas con :id (van después de las específicas)
router.get('/videos/:id/related', videoCtrl.getRelatedVideos);

// ⚠️ ESTA RUTA CAPTURA CUALQUIER /videos/:id - DEBE IR AL FINAL
router.get('/videos/:id', videoCtrl.getVideoById);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================
router.post('/videos', auth, videoCtrl.createVideo);
router.patch('/videos/:id', auth, videoCtrl.updateVideo);
router.delete('/videos/:id', auth, videoCtrl.deleteVideo);
router.patch('/videos/:id/like', auth, videoCtrl.toggleLikeVideo);
router.patch('/videos/:id/share', auth, videoCtrl.shareVideo);
router.post('/videos/:id/watch-time', auth, videoCtrl.trackWatchTime);

// ============================================
// RUTAS DE COMENTARIOS (si las tienes)
// ============================================
// router.post('/videos/:id/comments', auth, videoCtrl.addComment);
// router.delete('/videos/:id/comments/:commentId', auth, videoCtrl.deleteComment);

// ============================================
// RUTAS DE ESTADÍSTICAS Y PERFIL
// ============================================
router.get('/videos/user/stats', auth, videoCtrl.getUserVideoStats);
router.get('/users/:userId/videos', auth, videoCtrl.getChannelVideos);

// ============================================
// RUTAS DE PERFIL DE USUARIO (ESTILO TIKTOK)
// ============================================
router.get('/user/:userId/profile', auth, videoCtrl.getUserProfileStats);
router.get('/user/:userId/saved-videos', auth, videoCtrl.getUserSavedVideos);
router.get('/user/:userId/liked-videos', auth, videoCtrl.getUserLikedVideos);
router.post('/user/:userId/follow', auth, videoCtrl.toggleFollowUser);
router.post('/videos/:videoId/save', auth, videoCtrl.toggleSaveVideo);

// ============================================
// 👑 RUTAS DE ADMIN (requieren adminAuth)
// ============================================
// Gestión de videos pendientes
router.get('/admin/videos/pendientes', auth,  videoCtrl.getVideosPendientesAdmin);
router.patch('/admin/videos/:id/approve', auth,  videoCtrl.aprobarVideoAdmin);
router.delete('/admin/videos/:id', auth,  videoCtrl.eliminarVideoAdmin);

// 🆕 RUTAS COMERCIALES PARA ADMIN
router.get('/admin/videos/commercial/stats', auth,  videoCtrl.getCommercialStats);
router.get('/admin/videos/commercial/pending', auth,  (req, res, next) => {
  req.query.commercialOnly = 'true';
  next();
}, videoCtrl.getVideosPendientesAdmin);
router.patch('/admin/videos/commercial/:id/feature', auth,  videoCtrl.featureCommercialVideo);
router.get('/admin/videos/stats/overview', auth,  videoCtrl.getAdminVideoStats);

module.exports = router;