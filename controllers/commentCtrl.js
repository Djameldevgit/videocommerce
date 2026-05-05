// 📂 backend/controllers/commentCtrl.js
// SOLO PARA VIDEOS - Eliminado todo lo relacionado con posts y boutiques

const mongoose = require('mongoose');
const Comments = require('../models/commentModel');
const Video = require('../models/videoModel');

const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const { targetId, content, tag, reply, targetUserId } = req.body;

            console.log('📝 Creando comentario en video:', { targetId, content, targetUserId });

            // Verificar que el video existe
            const video = await Video.findById(targetId);
            if (!video) {
                return res.status(400).json({ msg: "Este video no existe." });
            }

            if (reply) {
                const cm = await Comments.findById(reply);
                if (!cm) {
                    return res.status(400).json({ msg: "Este comentario no existe." });
                }
            }

            const newComment = new Comments({
                user: req.user._id,
                content,
                tag,
                reply: reply || null,
                videoId: targetId,  // Cambiado: específico para video
                targetUserId
            });

            // Agregar referencia al video
            await Video.findByIdAndUpdate(targetId, {
                $push: { comments: newComment._id }
            }, { new: true });

            await newComment.save();
            
            // Populate user data
            await newComment.populate('user', 'username avatar email');
            if (tag && tag._id) {
                await newComment.populate('tag', 'username avatar');
            }

            res.json({ newComment });

        } catch (err) {
            console.error('❌ Error createComment:', err);
            return res.status(500).json({ msg: err.message });
        }
    },

    updateComment: async (req, res) => {
        try {
            const { content } = req.body;
            
            const comment = await Comments.findOneAndUpdate({
                _id: req.params.id,
                user: req.user._id
            }, { content }, { new: true });

            if (!comment) {
                return res.status(400).json({ msg: "Comentario no encontrado o no autorizado" });
            }

            res.json({ msg: '¡Actualización exitosa!', comment });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    likeComment: async (req, res) => {
        try {
            const comment = await Comments.find({ _id: req.params.id, likes: req.user._id });
            if (comment.length > 0) {
                return res.status(400).json({ msg: "Ya te gusta este comentario." });
            }

            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.user._id }
            }, { new: true });

            res.json({ msg: '¡Comentario marcado como me gusta!' });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    unLikeComment: async (req, res) => {
        try {
            await Comments.findOneAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.user._id }
            }, { new: true });

            res.json({ msg: '¡Me gusta eliminado del comentario!' });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ msg: "Comentario no encontrado" });
            }

            // Verificar permisos
            const isAuthor = comment.user.toString() === req.user._id.toString();
            const isVideoOwner = comment.targetUserId.toString() === req.user._id.toString();
            const isAdmin = req.user.role === 'admin';
            
            if (!isAuthor && !isVideoOwner && !isAdmin) {
                return res.status(403).json({ msg: "No autorizado para eliminar este comentario" });
            }

            // Eliminar referencia del video
            await Video.findByIdAndUpdate(comment.videoId, {
                $pull: { comments: req.params.id }
            });

            // Eliminar comentarios que son respuestas a este
            await Comments.deleteMany({ reply: req.params.id });
            
            // Eliminar el comentario
            await Comments.findByIdAndDelete(req.params.id);

            res.json({ msg: '¡Comentario eliminado!' });

        } catch (err) {
            console.error('❌ Error deleteComment:', err);
            return res.status(500).json({ msg: err.message });
        }
    },

    getComments: async (req, res) => {
        try {
            const { videoId, limit = 50, page = 1 } = req.query;
            
            // Validar parámetros
            if (!videoId) {
                return res.status(400).json({ 
                    msg: "Se requiere el parámetro videoId" 
                });
            }

            const limitNum = parseInt(limit);
            const skip = (parseInt(page) - 1) * limitNum;

            // Verificar que el video existe
            const video = await Video.findById(videoId);
            if (!video) {
                return res.status(404).json({ msg: "Video no encontrado" });
            }

            // Obtener comentarios principales
            const comments = await Comments.find({ 
                videoId,
                reply: null
            })
            .populate('user', 'username avatar email')
            .populate('tag', 'username avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

            // Obtener replies
            const replies = await Comments.find({
                videoId,
                reply: { $ne: null }
            })
            .populate('user', 'username avatar email')
            .populate('tag', 'username avatar')
            .sort({ createdAt: 1 });

            // Total de comentarios
            const totalComments = await Comments.countDocuments({
                videoId,
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
    },

    // Nuevo: Obtener comentarios de un usuario específico
    getUserComments: async (req, res) => {
        try {
            const { userId } = req.params;
            const { limit = 50, page = 1 } = req.query;

            const limitNum = parseInt(limit);
            const skip = (parseInt(page) - 1) * limitNum;

            const comments = await Comments.find({ user: userId })
                .populate('user', 'username avatar email')
                .populate('tag', 'username avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum);

            const totalComments = await Comments.countDocuments({ user: userId });

            res.json({
                success: true,
                data: {
                    comments,
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
            console.error("Error in getUserComments:", err);
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = commentCtrl;