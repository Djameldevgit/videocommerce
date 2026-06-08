// backend/models/Video.js

const mongoose = require('mongoose');
const { applyReviewableMixin } =  require('./mixins/reviewableFields');

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
    saleType: {
        type: String,
        enum: ['retail', 'wholesale', 'both'],
        default: null
    },
    
    // ============ UBICACIÓN DE LA TIENDA ============
    address: { type: String, default: '' },
    mapUrl: { type: String, default: '' },
    
    // ============ ESTADÍSTICAS ============
    views: { type: Number, default: 0, min: 0 },
    uniqueViews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
    watchTime: { type: Number, default: 0 },
    averageWatchTime: { type: Number, default: 0 },
    
    // ============ ESTADO (ALGUNOS CAMPOS LOS APORTA EL MIXIN) ============
    // pendiente, isActive, status, etc. vienen del mixin
    isFeatured: { type: Boolean, default: false },
    
    // ============ TAGS Y SEO ============
    tags: [{ type: String }],
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    
    // ============ SCORES ============
    engagementScore: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
    
}, { timestamps: true });

// ✅ APLICAR MIXIN DE REVISIÓN
applyReviewableMixin(videoSchema, { addIndexes: true });

// ============================================
// 🔧 ÍNDICES ADICIONALES
// ============================================
videoSchema.index({ channel: 1, createdAt: -1 });
videoSchema.index({ category: 1, isCommercial: 1 });
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ saleType: 1 });
videoSchema.index({ tags: 1 });

// ============================================
// 📌 MÉTODOS DEL VIDEO
// ============================================

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

videoSchema.methods.share = async function(userId) {
    const userIdStr = userId.toString();
    const index = this.shares.findIndex(id => id && id.toString() === userIdStr);
    let shared = false;
    
    if (index === -1) {
        this.shares.push(userId);
        shared = true;
    } else {
        this.shares.splice(index, 1);
        shared = false;
    }
    
    this.updateEngagementScore();
    await this.save();
    return { shared, sharesCount: this.shares.length };
};

videoSchema.methods.updateWatchTime = async function(userId, watchTimeSeconds) {
    if (!userId) return;
    
    this.watchTime = (this.watchTime || 0) + watchTimeSeconds;
    
    if (this.views > 0) {
        this.averageWatchTime = this.watchTime / this.views;
    }
    
    await this.save();
    return { watchTime: this.watchTime, averageWatchTime: this.averageWatchTime };
};

// Pre-save: actualizar engagement score
videoSchema.pre('save', function(next) {
    if (this.isModified('views') || this.isModified('likes') || 
        this.isModified('comments') || this.isModified('shares')) {
        this.updateEngagementScore();
    }
    next();
});

module.exports = mongoose.model('Video', videoSchema);