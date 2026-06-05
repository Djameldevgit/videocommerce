// routes/videoRoutes.js - VERSIÓN CORREGIDA
const router = require('express').Router();
const videoCtrl = require('../controllers/videoCtrl');
const auth = require('../middleware/auth');

// ============================================
// 🎵 RUTAS DE MÚSICA (PÚBLICAS)
// ============================================
router.get('/music', videoCtrl.getMusicLibrary);

// ============================================
// 🔍 RUTAS DE FILTROS Y LISTADOS (PÚBLICAS)
// ============================================
router.get('/videos/filter', videoCtrl.filterVideos);
router.get('/videos/featured', videoCtrl.getFeaturedVideos);
router.get('/videos/popular', videoCtrl.getPopularVideos);
router.get('/videos/category/:categorySlug', videoCtrl.getVideosByCategory);
router.get('/videos/trending', videoCtrl.getTrendingVideos);

// ============================================
// 🏪 RUTAS COMERCIALES PÚBLICAS
// ============================================
router.get('/videos/commercial/filter', videoCtrl.filterCommercialVideos);
router.get('/videos/commercial/nearby', videoCtrl.getVideosNearby);

// ============================================
// 👁️ RUTAS DE VIDEO POR ID (PÚBLICAS Y PRIVADAS)
// ============================================
router.get('/videos/public/:id', videoCtrl.getVideoByIdPublic);
router.get('/videos/private/:id', auth, videoCtrl.getVideoByIdPrivate);
router.get('/videos/:id', videoCtrl.getVideoById);

// ============================================
// ✏️ RUTAS PROTEGIDAS DE CRUD
// ============================================
router.post('/videos', auth, videoCtrl.createVideo);
router.patch('/videos/:id', auth, videoCtrl.updateVideo);
router.delete('/videos/:id', auth, videoCtrl.deleteVideo);

// ============================================
// ❤️ RUTAS DE INTERACCIÓN (PROTEGIDAS)
// ============================================
router.patch('/videos/:id/like', auth, videoCtrl.toggleLikeVideo);
router.patch('/videos/:id/share', auth, videoCtrl.shareVideo);
router.post('/videos/:id/watch-time', auth, videoCtrl.trackWatchTime);

// ============================================
// 🆕 RUTAS COMERCIALES PROTEGIDAS (USUARIO)
// ============================================
router.get('/videos/commercial/my-videos', auth, videoCtrl.getMyCommercialVideos);
router.patch('/videos/commercial/toggle-wholesale/:id', auth, videoCtrl.toggleWholesale);
router.patch('/videos/commercial/update-stock/:id', auth, videoCtrl.updateStock);
router.patch('/videos/commercial/update-location/:id', auth, videoCtrl.updateVideoLocation);

// ============================================
// 👤 RUTAS DE PERFIL DE USUARIO (PROTEGIDAS)
// ============================================
router.get('/videos/user/stats', auth, videoCtrl.getUserVideoStats);
router.get('/users/:userId/videos', auth, videoCtrl.getChannelVideos);

// ============================================
// 📱 RUTAS DE PERFIL ESTILO TIKTOK (PROTEGIDAS)
// ============================================
router.get('/user/:userId/profile', auth, videoCtrl.getUserProfileStats);
router.get('/user/:userId/videos', auth, videoCtrl.getUserVideos);

// ============================================
// 👑 RUTAS DE ADMIN (PROTEGIDAS)
// ============================================
router.get('/admin/videos/pendientes', auth, videoCtrl.getVideosPendientesAdmin);
router.patch('/admin/videos/:id/approve', auth, videoCtrl.aprobarVideoAdmin);
router.delete('/admin/videos/:id', auth, videoCtrl.eliminarVideoAdmin);
router.get('/admin/videos/stats/overview', auth, videoCtrl.getAdminVideoStats);
router.get('/admin/videos/commercial/stats', auth, videoCtrl.getCommercialStats);
router.patch('/admin/videos/commercial/:id/feature', auth, videoCtrl.featureCommercialVideo);

module.exports = router;