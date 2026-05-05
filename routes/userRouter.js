const router = require('express').Router()
const auth = require("../middleware/auth")
const userCtrl = require('../controllers/userCtrl')

// ============================================
// 1️⃣ RUTAS ESTÁTICAS (sin parámetros dinámicos)
// ============================================
//router.get('/users', auth, userCtrl.getUsers)
router.get('/users', auth, userCtrl.getUsersAction)
router.get('/users/admins', auth, userCtrl.getAdmins)
router.get('/users/search', auth, userCtrl.searchUser)
 
router.get('/inactive-users', auth, userCtrl.getInactiveUsers)
 
// ============================================
// 2️⃣ RUTAS DE CONTACTO Y SOPORTE
// ============================================
router.post('/contact-support', auth, userCtrl.contactMailSupport)
router.post('/contact-support-block', auth, userCtrl.contactBlockedSupport)
router.post('/contact-activation-request', auth, userCtrl.contactForActivation)

// ============================================
// 3️⃣ RUTAS DE MODERADORES
// ============================================
router.get('/users/:id/moderator-categories', auth, userCtrl.getModeratorCategories)
router.put('/users/:id/assign-categories', auth, userCtrl.assignCategoriesToModerator)

// ============================================
// 4️⃣ RUTAS DE USUARIO (con parámetros)
// ============================================
router.get('/user/:id', auth, userCtrl.getUser)
router.patch('/user', auth, userCtrl.updateUser)
router.delete('/user/:id', auth, userCtrl.deleteUser)

// ============================================
// 5️⃣ RUTAS DE SEGUIDORES (FOLLOW/UNFOLLOW)
// ============================================
router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)
// ============================================
// 6️⃣ RUTAS DE ACTIVACIÓN/DESACTIVACIÓN (cuenta normal)
// ============================================
router.patch('/toggle_active/:id', auth, userCtrl.toggleActiveStatus)
router.patch('/user/:id/activate', auth, userCtrl.activateUser)
router.patch('/user/:id/deactivate', auth, userCtrl.deactivateUser)

// ============================================
// 7️⃣ RUTAS DE BLOQUEO/DESBLOQUEO
// ============================================
router.patch('/user/:id/block', auth, userCtrl.blockUser)
router.patch('/user/:id/unblock', auth, userCtrl.unblockUser)

// ============================================
// 8️⃣ RUTAS DE USUARIO PRO
// ============================================
router.patch('/user/:userId/activate-pro', auth, userCtrl.activatePro)
router.patch('/user/:userId/deactivate-pro', auth, userCtrl.deactivatePro)

router.get('/user/:userId/followers', auth, userCtrl.getFollowers);
router.get('/user/:userId/following', auth, userCtrl.getFollowing);
router.get('/user/:userId/profile-views', auth, userCtrl.getProfileViews);
//router.post('/user/:userId/profile-view', auth, userCtrl.registerProfileView);
router.get('/user/:userId/profile', auth, userCtrl.getUserProfile);
router.patch('/user/:userId/profile-view', auth, userCtrl.registerProfileView);
router.get('/user/:userId/profile-stats', auth, userCtrl.getProfileStats);
router.get('/user/:userId/profile-views', auth, userCtrl.getProfileViews); // Y
router.patch('/user/save-video/:videoId', auth, userCtrl.saveVideo);
router.get('/user/check-saved/:videoId', auth, userCtrl.checkSavedVideo);
router.get('/user/saved-videos', auth, userCtrl.getSavedVideos);
module.exports = router

 