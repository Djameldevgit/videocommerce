// models/BoutiqueProduct.js - VERSIÓN ÚNICA Y DEFINITIVA
const mongoose = require('mongoose');

const boutiqueProductSchema = new mongoose.Schema({
  // Relaciones
  boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique',  // ← Aquí referencia a la boutique
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },

  // Categorías
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  },
  categorie: {
    type: String,
    trim: true,
    index: true
  },
  subCategory: {
    type: String,
    trim: true,
    index: true
  },
  articleType: {
    type: String,
    trim: true,
    index: true
  },

  // Información básica
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Imágenes
  images: [{
    url: String,
    public_id: String,
    isMain: { type: Boolean, default: false }
  }],

  // Estado del producto
  etat: {
    type: String,
    enum: ['neuf', 'comme-neuf', 'bon-etat', 'correct'],
    default: 'neuf'
  },

  // Inventario
  stock: {
    type: Number,
    default: 1,
    min: 0
  },
  
  // Datos específicos por categoría
  categorySpecificData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Localización
  wilaya: String,
  commune: String,
  address: String,
  
  // Contacto
  phone: String,
  email: String,

  // Métricas
  views: {
    type: Number,
    default: 0
  },
  
  // Estado de aprobación
  isActive: {
    type: Boolean,
    default: true
  },
  pendiente: {
    type: Boolean,
    default: true,
    index: true
  }

}, { timestamps: true });

// Índices
boutiqueProductSchema.index({ boutique: 1, pendiente: 1, isActive: 1 });
boutiqueProductSchema.index({ boutique: 1, createdAt: -1 });
boutiqueProductSchema.index({ pendiente: 1, createdAt: -1 });
boutiqueProductSchema.index({ user: 1, pendiente: 1 });
boutiqueProductSchema.index({ user: 1, createdAt: -1 });
boutiqueProductSchema.index({ categorie: 1, pendiente: 1 });
boutiqueProductSchema.index({ price: 1 });
boutiqueProductSchema.index({ wilaya: 1 });

module.exports = mongoose.model('BoutiqueProduct', boutiqueProductSchema);