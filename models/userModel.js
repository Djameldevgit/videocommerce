const mongoose = require('mongoose');

 

const userSchema = new mongoose.Schema({
    // ============ INFORMACIÓN BÁSICA ============
    fullname: { type: String, trim: true, maxlength: 25 },
    username: { type: String, required: true, trim: true, maxlength: 25, unique: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    
    // ============ ROLES Y PERMISOS ============
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'admin'
    },
    assignedCategories: { type: [String], default: [], index: true },
    assignedSubCategories: { type: [String], default: [], index: true },
    
    // ============ PERFIL PERSONAL ============
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dfjipgj2o/image/upload/v1777859039/avatar_cvr2e3.jpg'
    },
    language: { type: String, enum: ['fr', 'ar', 'en'], default: 'fr' },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    story: { type: String, default: '', maxlength: 200 },
    website: { type: String, default: '' },
    bio: { type: String, default: '' },
    
    // ============ ESTADO ============
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isPro: { type: Boolean, default: false },
    proExpiryDate: { type: Date, default: null },
    blockDetails: {
        reason: { type: String, default: null },
        description: { type: String, default: null },
        blockDate: { type: Date, default: null },
        blockExpiryDate: { type: Date, default: null },
        blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null }
    },
    
    // ============ ESTADÍSTICAS DE PERFIL ============
    profileViews: [{
        user: { type: mongoose.Types.ObjectId, ref: 'user' },
        viewedAt: { type: Date, default: Date.now }
    }],
    profileViewsCount: { type: Number, default: 0 },
    
    // ============ INTERACCIONES ============
    savedVideos: [{ type: mongoose.Types.ObjectId, ref: 'Video' }],  // ✅ único campo para guardados
    followingChannels: [{ type: mongoose.Types.ObjectId, ref: 'Channel' }],  // ✅ canales que sigue
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    // Opcional: si quieres red social entre usuarios (amigos)
    followingUsers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    followersUsers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    
}, { timestamps: true });

// Índices
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ assignedCategories: 1 });
userSchema.index({ assignedSubCategories: 1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// Métodos existentes (canModerate, getAssignedData) se mantienen igual
userSchema.methods.canModerate = function(categorySlug, subCategorySlug = null) {
    if (this.role === 'admin') return true;
    if (this.role === 'moderator') {
        if (subCategorySlug && this.assignedSubCategories.includes(subCategorySlug)) return true;
        if (categorySlug && this.assignedCategories.includes(categorySlug)) return true;
    }
    return false;
};

userSchema.methods.getAssignedData = function() {
    return {
        categories: this.assignedCategories,
        subCategories: this.assignedSubCategories
    };
};

module.exports = mongoose.model('user', userSchema);