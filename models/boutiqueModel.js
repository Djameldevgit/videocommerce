const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },

  categorie: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  subCategory: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  articleType: {
    type: String,
    trim: true,
    index: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },

  nom_boutique: {
    type: String,
    required: true,
    trim: true
  },

  domaine_boutique: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  slug: {
    type: String,
    unique: true,
    index: true
  },

  slogan_boutique: String,

  description_boutique: {
    type: String,
    default: 'Description de la boutique'
  },

  images: [
    {
      url: String,
      public_id: String
    }
  ],

  plan: {
    type: String,
    enum: ['gratuit', 'basique', 'premium', 'entreprise'],
    default: 'gratuit'
  },

  duree_abonnement: {
    type: String,
    enum: ['1mois', '3mois', '6mois', '1an'],
    default: '1mois'
  },

  date_debut: {
    type: Date,
    default: Date.now
  },

  date_fin: Date,

  proprietaire: {
    nom: String,
    email: String,
    telephone: String,
    wilaya: String,
    adresse: String
  },

  reseaux_sociaux: {
    facebook: String,
    instagram: String,
    tiktok: String,
    whatsapp: String,
    website: String
  },

  couleur_theme: {
    type: String,
    default: '#2563eb'
  },
  
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  
  views: {
    type: Number,
    default: 0
  },
  
  viewHistory: [{
    viewerId: String,
    timestamp: Date,
    userAgent: String
  }],
  
  stats: {
    produits: { type: Number, default: 0 },
    notes: { type: Number, default: 0 },
    avis: { type: Number, default: 0 },
    vues: { type: Number, default: 0 }
  },
  logopordefecto: {
    type: String,
    default: 'https://res.cloudinary.com/dfjipgj2o/image/upload/v1777252420/tassili8_cqqk5n.png'
},
  header_images: [
    {
      url: String,
      public_id: String
    }
  ],

  isActive: {
    type: Boolean,
    default: false,
    index: true
  },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  // 🔥 CAMPO PARA APROBACIÓN (mismo que Post)
  pendiente: {
    type: Boolean,
    default: true,  // Por defecto espera aprobación
    index: true
  }

}, {
  timestamps: true
});

// 🔥 ÍNDICES OPTIMIZADOS PARA BOUTIQUES (con pendiente)
boutiqueSchema.index({ pendiente: 1, isActive: 1, createdAt: -1 });
boutiqueSchema.index({ categorie: 1, pendiente: 1, isActive: 1 });
boutiqueSchema.index({ subCategory: 1, pendiente: 1, isActive: 1 });
boutiqueSchema.index({ category: 1, pendiente: 1, isActive: 1 });
boutiqueSchema.index({ user: 1, pendiente: 1 });
boutiqueSchema.index({ 'proprietaire.wilaya': 1, pendiente: 1 });
boutiqueSchema.index({ slug: 1, pendiente: 1 });

module.exports = mongoose.model('Boutique', boutiqueSchema);