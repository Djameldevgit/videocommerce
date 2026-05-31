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
  getPendingChannels
} = require('../controllers/channelCtrl');

// ========== RUTAS PÚBLICAS (sin auth) ==========
router.get('/channels/:channelId', getChannelProfile);
router.get('/channels/:channelId/videos', getChannelVideos); 
// ========== RUTAS CON AUTENTICACIÓN ==========
router.post('/channels', auth, createChannel);
router.get('/my-channels', auth, getMyChannels);           // ✅ Esta funciona
router.get('/users/my-channels', auth, getMyChannels);     // ✅ También agregar esta para compatibilidad
router.patch('/channels/:channelId/follow', auth, toggleFollowChannel);
router.patch('/channels/:channelId', auth, updateChannel);  // ← Debe ser :channelId
//router.get('/channels/:channelId/stats', auth, getChannelStats);
//router.delete('/channels/:channelId', auth, deleteChannel);

// ========== RUTAS SOLO ADMIN ==========
router.get('/admin/channels/pending', auth, getPendingChannels);
router.patch('/admin/channels/:channelId/approve', auth, approveChannel);
router.patch('/admin/channels/:channelId/reject', auth, rejectChannel);

module.exports = router;