// 📂 backend/models/commentModel.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tag: Object,
    reply: { type: mongoose.Types.ObjectId, ref: 'comment' },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    
    // ✅ Estos son los campos que debe tener
    targetId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['post', 'boutique', 'video']  // ✅ Debe ser 'post' no 'Post'
    },
    targetUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true
});

// Índices
commentSchema.index({ targetId: 1, targetModel: 1, createdAt: -1 });
commentSchema.index({ targetUserId: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('comment', commentSchema);