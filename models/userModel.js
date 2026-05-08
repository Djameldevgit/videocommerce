const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // ============ INFORMACIÓN BÁSICA ============
    fullname: {
        type: String,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    
    // ============ ROLES Y PERMISOS ============
 // 📂 models/userModel.js - Actualizar el enum de role

role: {
    type: String,
    enum: ['user', 'moderator', 'admin', 'userpro'],  
    default: 'admin'
},
    // ✅ SIMPLIFICADO: Categorías asignadas como array de strings (slugs)
    assignedCategories: {
        type: [String],
        default: [],
        index: true
    },
    
    // ✅ SIMPLIFICADO: Subcategorías asignadas como array de strings
    assignedSubCategories: {
        type: [String],
        default: [],
        index: true
    },
    
    // ============ PERFIL ============
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/dfjipgj2o/image/upload/v1777859039/avatar_cvr2e3.jpg'
    },
    
    language: {
        type: String,
        enum: ['fr', 'ar', 'en'],
        default: 'fr'
    },
    
    mobile: {
        type: String,
        default: ''
    },
    
    address: {
        type: String,
        default: ''
    },
    
    story: {
        type: String,
        default: '',
        maxlength: 200
    },
    
    website: {
        type: String,
        default: ''
    },
    
    // ============ ESTADO ============
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: { type: Boolean, default: true },
  
    // Estado de bloqueo
    isBlocked: { type: Boolean, default: false },
    isPro: { type: Boolean, default: true },
    proExpiryDate: {
        type: Date,
        default: null
      },


    // Detalles del bloqueo
    blockDetails: {
      reason: { type: String, default: null },
      description: { type: String, default: null },
      blockDate: { type: Date, default: null },
      blockExpiryDate: { type: Date, default: null },
      blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null }
    },
    profileViews: [{
        user: { type: mongoose.Types.ObjectId, ref: 'user' },
        viewedAt: { type: Date, default: Date.now }
      }],
      profileViewsCount: { type: Number, default: 0 },
    // ============ INTERACCIONES ============
    // models/userModel.js - Verifica que tienes this campo
savedVideos: [{ type: mongoose.Types.ObjectId, ref: 'Video' }],
    
    followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'user'}],
    
    saved: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],

    savedVideos: [{ type: mongoose.Types.ObjectId, ref: 'video' }],
    bio: { type: String, default: '' }
    
}, {
    timestamps: true
});

// ============ ÍNDICES ============
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ assignedCategories: 1 });
userSchema.index({ assignedSubCategories: 1 });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

// ============ MÉTODO PARA VERIFICAR PERMISOS ============
userSchema.methods.canModerate = function(categorySlug, subCategorySlug = null) {
    // Admin puede todo
    if (this.role === 'admin') return true;
    
    // Moderador: verificar si tiene la categoría o subcategoría asignada
    if (this.role === 'moderator') {
        if (subCategorySlug && this.assignedSubCategories.includes(subCategorySlug)) {
            return true;
        }
        if (categorySlug && this.assignedCategories.includes(categorySlug)) {
            return true;
        }
    }
    
    return false;
};

// ============ MÉTODO PARA OBTENER CATEGORÍAS ASIGNADAS ============
userSchema.methods.getAssignedData = function() {
    return {
        categories: this.assignedCategories,
        subCategories: this.assignedSubCategories
    };
};

module.exports = mongoose.model('user', userSchema);