// 📂 backend/routes/commentRouter.js

const router = require('express').Router()
const commentCtrl = require('../controllers/commentCtrl')
const auth = require('../middleware/auth')

// Rutas existentes
router.post('/comment', auth, commentCtrl.createComment)
router.patch('/comment/:id', auth, commentCtrl.updateComment)
router.patch('/comment/:id/like', auth, commentCtrl.likeComment)
router.patch('/comment/:id/unlike', auth, commentCtrl.unLikeComment)
router.delete('/comment/:id', auth, commentCtrl.deleteComment)  // ✅ Esta línea
// 🆕 NUEVAS RUTAS GENÉRICAS
router.get('/comments', auth, commentCtrl.getComments)  // Obtener comentarios por target
//router.get('/comment/:id', auth, commentCtrl.getCommentById)  // Obtener comentario específico
//router.get('/user/:userId/comments', auth, commentCtrl.getUserComments)  // Comentarios de usuario

module.exports = router