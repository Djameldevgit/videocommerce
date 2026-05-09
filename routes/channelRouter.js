const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createChannel,
  getChannelById,
  updateChannel
  ,getChannelProfile,

  toggleFollowChannel,
  getChannelVideos,
  getMyChannels,
  getChannelStats,
  deleteChannel
} = require('../controllers/channelCtrl');

// Todas las rutas requieren autenticación
 

router.post('/channels',auth, createChannel);
router.get('/users/my-channels', auth,getMyChannels);
router.get('/channels/:channelId',auth, getChannelById);
router.get('/:channelId', auth, getChannelProfile);  // o getChannelById según prefieras
router.patch('/channels/:channelId',auth, updateChannel);
router.post('/channel/:channelId/follow',auth, toggleFollowChannel);
router.get('/channel/:channelId/videos',auth, getChannelVideos);
router.get('/channel/:channelId/stats',auth, getChannelStats);
router.delete('/channel/:channelId',auth, deleteChannel);

module.exports = router;