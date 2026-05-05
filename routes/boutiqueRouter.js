// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');

// ============================================
// 1️⃣ RUTAS ESTÁTICAS (sin parámetros)
// ============================================
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/user/me', auth, boutiqueCtrl.getUserBoutiques);

// ============================================
// 2️⃣ RUTAS DE ADMIN (fijas, antes que parámetros)
// ============================================
router.get('/admin/boutiques/pendientes', auth, boutiqueCtrl.getBoutiquesPendientes);
router.get('/boutiques/admin/pendientes/count', auth, boutiqueCtrl.getBoutiquesPendientesCount);
router.get('/admin/boutiques/aprobadas', auth, boutiqueCtrl.getBoutiquesAprobadas);
router.patch('/admin/boutiques/aprobar/:id', auth, boutiqueCtrl.aprobarBoutique);
router.delete('/admin/boutiques/rechazar/:id', auth, boutiqueCtrl.rechazarBoutique);
router.patch('/admin/activar-pago/:id', auth, boutiqueCtrl.activarBoutiquePago);
router.patch('/admin/boutiques/status/:id', auth, boutiqueCtrl.updateAdminBoutiqueStatus);

// ============================================
// 3️⃣ RUTAS DE VERIFICACIÓN (check)
// ============================================
router.get('/boutique/:boutiqueId/follow/check', auth, boutiqueCtrl.checkFollowBoutique);
router.get('/boutique/:boutiqueId/like/check', auth, boutiqueCtrl.checkLikeBoutique);

// ============================================
// 4️⃣ RUTAS DE LISTAS (followers, likes, viewers)
// ============================================
router.get('/boutique/:boutiqueId/followers', boutiqueCtrl.getBoutiqueFollowers);
router.get('/boutique/:boutiqueId/likes', boutiqueCtrl.getBoutiqueLikes);
router.get('/boutique/:boutiqueId/viewers', boutiqueCtrl.getViewersList);
router.get('/boutique/:boutiqueId/followers/list', boutiqueCtrl.getFollowersList);
router.get('/boutique/:boutiqueId/likes/list', boutiqueCtrl.getLikesList);

// ============================================
// 5️⃣ RUTAS CRUD (crear, actualizar, eliminar)
// ============================================
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);

// ============================================
// 6️⃣ RUTAS DE IMÁGENES DE CABECERA
// ============================================
router.patch('/boutique/:boutiqueId/headerimages', auth, boutiqueCtrl.updateBoutiqueHeaderImages);
router.delete('/boutique/:boutiqueId/headerimages/:imageId', auth, boutiqueCtrl.deleteBoutiqueHeaderImage);

// ============================================
// 7️⃣ RUTAS DE INTERACCIÓN (follow, like, view)
// ============================================
router.patch('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.post('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.patch('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.post('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.patch('/boutique/:boutiqueId/view', boutiqueCtrl.addView);

// ============================================
// 8️⃣ RUTAS PÚBLICAS CON PARÁMETROS (al final)
// ============================================
router.get('/boutique/:id', boutiqueCtrl.getBoutique);

module.exports = router;