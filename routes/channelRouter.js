// backend/routes/channelRoutes.js
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
  deleteChannel,
  approveChannel,
  rejectChannel,
  getPendingChannels,
  // NUEVAS FUNCIONES IMPORTADAS
  reportChannel,
  blockChannel,
  registerShare,
  getContactInfo
} = require('../controllers/channelCtrl');

// ========== RUTAS PÚBLICAS (sin auth) ==========
router.get('/channels/:channelId', getChannelProfile);
router.get('/channels/:channelId/videos', getChannelVideos); 

// ========== RUTAS CON AUTENTICACIÓN ==========
router.post('/channels', auth, createChannel);
router.get('/my-channels', auth, getMyChannels);
router.get('/users/my-channels', auth, getMyChannels);
router.patch('/channels/:channelId/follow', auth, toggleFollowChannel);
router.patch('/channels/:channelId', auth, updateChannel);
router.delete('/channels/:channelId', auth, deleteChannel); // ❌ DESCOMENTADA

// ========== NUEVAS RUTAS PARA DROPDOWN ==========
// Reportar canal
router.post('/channels/:channelId/report', auth, reportChannel);

// Bloquear/Desbloquear canal
router.patch('/channels/:channelId/block', auth, blockChannel);

// Registrar compartido (analytics)
router.post('/channels/:channelId/share', auth, registerShare);

// Obtener información de contacto
router.get('/channels/:channelId/contact', auth, getContactInfo);

// ========== RUTAS SOLO ADMIN ==========
router.get('/admin/channels/pending', auth, getPendingChannels);
router.patch('/admin/channels/:channelId/approve', auth, approveChannel);
router.patch('/admin/channels/:channelId/reject', auth, rejectChannel);

module.exports = router;