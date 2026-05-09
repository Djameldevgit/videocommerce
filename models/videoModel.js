// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    // ============ INFORMACIÓN BÁSICA ============
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
    
    // ============ VIDEO Y MULTIMEDIA ============
    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, default: '' },
    videoType: { type: String, enum: ['youtube', 'vimeo', 'local'], default: 'local' },
    videoId: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    duration: { type: Number, default: 0, min: 0 },
    
    // ============ RELACIONES ============
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // opcional: owner directo
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    
    // ============ INFORMACIÓN COMERCIAL (específica del video/producto) ============
    isCommercial: { type: Boolean, default: false, index: true },
    price: { type: Number, default: 0, min: 0 },
    wholesale: { type: Boolean, default: false },
    minQuantity: { type: Number, default: 1, min: 1 },
    stock: {
        total: { type: Number, default: 0, min: 0 },
        available: { type: Number, default: 0, min: 0 },
        reserved: { type: Number, default: 0, min: 0 }
    },
    
    // ============ UBICACIÓN O INFO EXTRA (si el video es un evento puntual) ============
    // Opcional: puedes añadir campos de ubicación temporal si un video necesita mostrar una dirección diferente a la del canal
    // Pero por ahora no los incluyo para mantener limpio.
    
    // ============ ESTADÍSTICAS ============
    views: { type: Number, default: 0, min: 0 },
    uniqueViews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    watchTime: { type: Number, default: 0 },
    averageWatchTime: { type: Number, default: 0 },
    
    // ============ ESTADO ============
    pendiente: { type: Boolean, default: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    
    // ============ TAGS Y SEO ============
    tags: [{ type: String }],
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    
    // ============ SCORES ============
    engagementScore: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    
    // ============ PRODUCTOS RELACIONADOS ============
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
    
}, { timestamps: true });

// Índices
videoSchema.index({ channel: 1, createdAt: -1 });
videoSchema.index({ category: 1, isCommercial: 1 });
videoSchema.index({ price: 1 });
videoSchema.index({ title: 'text', description: 'text' });

// Métodos (los conservamos, ajustando donde haga falta)
videoSchema.methods.isCommercialVideo = function() {
    return this.isCommercial === true;
};

videoSchema.methods.incrementViews = async function(userId = null) {
    this.views = (this.views || 0) + 1;
    if (userId) {
        const userIdStr = userId.toString();
        const exists = this.uniqueViews.some(id => id && id.toString() === userIdStr);
        if (!exists) this.uniqueViews.push(userId);
    }
    await this.save();
    // Opcional: actualizar estadísticas del canal
    const Channel = mongoose.model('Channel');
    const channel = await Channel.findById(this.channel);
    if (channel) await channel.updateStats();
    return this;
};

videoSchema.methods.toggleLike = async function(userId) {
    const userIdStr = userId.toString();
    const index = this.likes.findIndex(id => id && id.toString() === userIdStr);
    let liked = false;
    if (index === -1) {
        this.likes.push(userId);
        liked = true;
    } else {
        this.likes.splice(index, 1);
        liked = false;
    }
    this.updateEngagementScore();
    await this.save();
    // Actualizar estadísticas del canal (totalLikes)
    const Channel = mongoose.model('Channel');
    const channel = await Channel.findById(this.channel);
    if (channel) await channel.updateStats();
    return { liked, likesCount: this.likes.length };
};

videoSchema.methods.updateEngagementScore = function() {
    const likesCount = this.likes.length || 0;
    const commentsCount = this.comments.length || 0;
    const sharesCount = this.shares.length || 0;
    const totalViews = this.views || 1;
    const totalEngagement = (likesCount * 2) + (commentsCount * 3) + (sharesCount * 4);
    this.engagementScore = Math.min((totalEngagement / totalViews) * 100, 100);
};

// ... (el resto de métodos como updateWatchTime, share, incrementConversion, etc. se mantienen igual pero referenciando this.channel si necesitan actualizar el canal)

videoSchema.pre('save', function(next) {
    if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
        this.updateEngagementScore();
    }
    // Asegurar stock
    if (this.stock && this.stock.total !== undefined && this.stock.available === undefined) {
        this.stock.available = this.stock.total;
    }
    next();
});

module.exports = mongoose.model('Video', videoSchema);