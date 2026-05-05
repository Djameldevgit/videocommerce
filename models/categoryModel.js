// models/Category.js - NUEVA VERSIÓN SIMPLIFICADA PARA VideoCommerce
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // ========== IDENTIFICACIÓN BÁSICA ==========
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: 200
  },
  
  // ========== METADATA VISUAL ==========
  icon: { 
    type: String, 
    default: '📦'  // Emoji por defecto
  },
  iconType: { 
    type: String, 
    enum: ['emoji', 'image', 'svg'],
    default: 'emoji'
  },
  iconColor: { 
    type: String, 
    default: '#3B82F6'  // Color azul por defecto
  },
  bgColor: { 
    type: String, 
    default: '#EFF6FF'  // Fondo azul claro
  },
  order: { 
    type: Number, 
    default: 0,
    index: true
  },
  
  // ========== ESTADÍSTICAS ==========
  videoCount: { 
    type: Number, 
    default: 0,
    index: true
  },
  
  // ========== CONTROL ==========
  isActive: { 
    type: Boolean, 
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// ========== ÍNDICES OPTIMIZADOS ==========
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, order: 1 });
categorySchema.index({ videoCount: -1 });  // Para ordenar por popularidad
categorySchema.index({ name: 1 });

// ========== MÉTODOS DE INSTANCIA ==========
categorySchema.methods.incrementVideoCount = async function() {
  this.videoCount += 1;
  await this.save();
  return this.videoCount;
};

categorySchema.methods.decrementVideoCount = async function() {
  if (this.videoCount > 0) {
    this.videoCount -= 1;
    await this.save();
  }
  return this.videoCount;
};

// ========== MÉTODOS ESTÁTICOS ==========
categorySchema.statics.getActiveCategories = async function() {
  return this.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .select('name slug icon iconColor bgColor videoCount');
};

categorySchema.statics.getPopularCategories = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ videoCount: -1, order: 1 })
    .limit(limit)
    .select('name slug icon videoCount');
};

categorySchema.statics.findBySlug = async function(slug) {
  return this.findOne({ slug, isActive: true });
};

// ========== MIDDLEWARE ==========
// Auto-generar slug antes de guardar si no existe
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);