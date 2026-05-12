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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    
    // ============ INFORMACIÓN COMERCIAL ============
    isCommercial: { type: Boolean, default: false, index: true },
    
    // 🔥 NUEVO: Tipo de venta (detalle, mayor, ambos)
    saleType: {
        type: String,
        enum: ['retail', 'wholesale', 'both'],
        required: false,  // Opcional, solo si el video es comercial
        default: null
    },
    
    // ============ UBICACIÓN DE LA TIENDA (opcional) ============
    address: { type: String, default: '' },        // Dirección física
    mapUrl: { type: String, default: '' },         // URL de Google Maps o embed
    
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
    conversionRate: { type: Number, default: 0 }
    
}, { timestamps: true });

// Índices (eliminado el índice de price)
videoSchema.index({ channel: 1, createdAt: -1 });
videoSchema.index({ category: 1, isCommercial: 1 });
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ saleType: 1 }); // útil para filtrar por tipo de venta

// Métodos (sin referencias a stock/price)
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

// Métodos que podrías necesitar (watchTime, share, etc.) se mantienen igual
// ... (agrega aquí los que ya tenías, sin tocar precio/stock)

// Pre-save: eliminado el ajuste de stock
videoSchema.pre('save', function(next) {
    if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
        this.updateEngagementScore();
    }
    next();
});

module.exports = mongoose.model('Video', videoSchema);