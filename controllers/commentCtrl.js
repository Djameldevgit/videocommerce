// 📂 backend/controllers/commentCtrl.js

const Comments = require('../models/commentModel')
const Posts = require('../models/postModel')
const Boutiques = require('../models/boutiqueModel')
const Videos = require('../models/videoModel')

// Helper para obtener el modelo correcto
const getModelByType = (targetType) => {
    const models = {
        'post': Posts,
        'boutique': Boutiques,
        'video': Videos
    }
    return models[targetType]
}

const commentCtrl = {
    createComment: async (req, res) => {
        try {
            // ✅ CAMBIAR targetType a targetModel para que coincida con el schema
            const { targetId, targetModel, content, tag, reply, targetUserId } = req.body

            console.log('📝 Creando comentario:', { targetId, targetModel, content, targetUserId });

            // Buscar el modelo correspondiente
            const Model = getModelByType(targetModel)
            if (!Model) return res.status(400).json({ msg: "Invalid target model" })

            const target = await Model.findById(targetId)
            if (!target) return res.status(400).json({ msg: `This ${targetModel} does not exist.` })

            if (reply) {
                const cm = await Comments.findById(reply)
                if (!cm) return res.status(400).json({ msg: "This comment does not exist." })
            }

            const newComment = new Comments({
                user: req.user._id,
                content,
                tag,
                reply: reply || null,
                targetId,
                targetModel,  // ✅ Usar targetModel en lugar de targetType
                targetUserId
            })

            // Agregar referencia al target si tiene array de comments
            if (target.comments) {
                await Model.findByIdAndUpdate(targetId, {
                    $push: { comments: newComment._id }
                }, { new: true })
            }

            await newComment.save()
            
            // Populate user data
            await newComment.populate('user', 'username avatar email')
            if (tag && tag._id) {
                await newComment.populate('tag', 'username avatar')
            }

            res.json({ newComment })

        } catch (err) {
            console.error('❌ Error createComment:', err);
            return res.status(500).json({ msg: err.message })
        }
    },

    updateComment: async (req, res) => {
        try {
            const { content } = req.body
            
            const comment = await Comments.findOneAndUpdate({
                _id: req.params.id,
                user: req.user._id
            }, { content }, { new: true })

            if (!comment) {
                return res.status(400).json({ msg: "Comment not found or unauthorized" })
            }

            res.json({ msg: 'Update Success!', comment })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    likeComment: async (req, res) => {
        try {
            const comment = await Comments.find({ _id: req.params.id, likes: req.user._id })
            if (comment.length > 0) return res.status(400).json({ msg: "You already liked this comment." })

            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true })

            res.json({ msg: 'Liked Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    unLikeComment: async (req, res) => {
        try {
            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true })

            res.json({ msg: 'UnLiked Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findById(req.params.id)
            if (!comment) return res.status(404).json({ msg: "Comment not found" })

            // Verificar permisos
            const isAuthor = comment.user.toString() === req.user._id.toString()
            const isTargetOwner = comment.targetUserId.toString() === req.user._id.toString()
            
            if (!isAuthor && !isTargetOwner) {
                return res.status(403).json({ msg: "Unauthorized to delete this comment" })
            }

            // Eliminar referencia del target
            const TargetModel = getModelByType(comment.targetModel)
            if (TargetModel) {
                await TargetModel.findByIdAndUpdate(comment.targetId, {
                    $pull: { comments: req.params.id }
                })
            }

            // Eliminar comentarios reply
            await Comments.deleteMany({ reply: req.params.id })
            
            // Eliminar el comentario
            await Comments.findByIdAndDelete(req.params.id)

            res.json({ msg: 'Deleted Comment!' })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getComments: async (req, res) => {
        try {
            const { targetId, targetModel, limit = 50, page = 1 } = req.query;
            
            // Validar parámetros
            if (!targetId || !targetModel) {
                return res.status(400).json({ 
                    msg: "Missing required parameters: targetId and targetModel" 
                });
            }

            // Validar targetModel
            const validTypes = ['post', 'boutique', 'video'];  // ✅ VIDEO INCLUIDO
            if (!validTypes.includes(targetModel)) {
                return res.status(400).json({ 
                    msg: "Invalid targetModel. Must be: post, boutique, or video" 
                });
            }

            const limitNum = parseInt(limit);
            const skip = (parseInt(page) - 1) * limitNum;

            // Obtener comentarios principales
            const comments = await Comments.find({ 
                targetId, 
                targetModel,
                reply: null
            })
            .populate('user', 'username avatar email')
            .populate('tag', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

            // Obtener replies
            const replies = await Comments.find({
                targetId,
                targetModel,
                reply: { $ne: null }
            })
            .populate('user', 'username avatar email')
            .populate('tag', 'username avatar')
            .sort({ createdAt: 1 });

            // Total de comentarios
            const totalComments = await Comments.countDocuments({
                targetId,
                targetModel,
                reply: null
            });

            res.json({
                success: true,
                data: {
                    comments,
                    replies,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(totalComments / limitNum),
                        totalComments,
                        limit: limitNum,
                        hasMore: skip + comments.length < totalComments
                    }
                }
            });

        } catch (err) {
            console.error("Error in getComments:", err);
            return res.status(500).json({ msg: err.message });
        }
    }
 
}

module.exports = commentCtrl