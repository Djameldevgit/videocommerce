const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createChannel,
  updateChannel,
  getChannelProfile,
  toggleFollowChannel,
  getChannelVideos,
  getMyChannels,
  getChannelStats,
  deleteChannel
} = require('../controllers/channelCtrl');

// ========== RUTAS PÚBLICAS (sin auth) ==========
// Obtener videos de un canal (paginado) – DEBE IR ANTES de /channels/:channelId
router.get('/channels/:channelId/videos', getChannelVideos);

// Obtener perfil público de un canal
router.get('/channels/:channelId', getChannelProfile);

// ========== RUTAS CON AUTENTICACIÓN ==========
// Crear canal
router.post('/channels', auth, createChannel);

// Obtener canales del usuario logueado
router.get('/users/my-channels', auth, getMyChannels);

// 🔥 Ruta para seguir/dejar de seguir (debe ser PATCH, y antes de la ruta genérica PATCH)
router.patch('/channels/:channelId/follow', auth, toggleFollowChannel);

// Actualizar canal (solo dueño/admin) – esta es genérica, debe ir DESPUÉS de las rutas específicas
router.patch('/channels/:channelId', auth, updateChannel);

// Estadísticas (solo dueño/admin)
router.get('/channels/:channelId/stats', auth, getChannelStats);

// Eliminar canal
router.delete('/channels/:channelId', auth, deleteChannel);

module.exports = router;