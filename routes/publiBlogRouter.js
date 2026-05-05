const router = require('express').Router();
 
const publiBLOG = require('../controllers/publiBlogCtrl');
const auth = require('../middleware/auth');

// Usar post en blog
router.post('/posts/admin', auth, publiBLOG.cratePostPubliBlog);

// Usar post como publicidad
router.get('/posts/admin', auth, publiBLOG.getPostspubliblog);

module.exports = router;
