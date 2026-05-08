// models/Video.js - VERSIÓN CON VALIDACIONES RELAJADAS (para Argelia)

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
 
  nom_entreprise: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  activite: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  
  // Reemplazamos el campo `category` (single) por `categories` (array)
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },





  description: { 
    type: String, 
    trim: true, 
    maxlength: 2000,
    default: '' 
  },
  shortDescription: { 
    type: String, 
    trim: true, 
    maxlength: 300, 
    default: '' 
  },
  
  // ========== VIDEO Y MULTIMEDIA ==========
  videoUrl: { type: String, required: true },
  videoPublicId: { type: String, default: '' },
  videoType: { 
    type: String, 
    enum: ['youtube', 'vimeo', 'local'], 
    default: 'local' 
  },
  videoId: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  duration: { type: Number, default: 0, min: 0 },
  
  // ========== USUARIO ==========
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  
  // ========== CATEGORÍA ==========
  
  // ========== INFORMACIÓN COMERCIAL ==========
  isCommercial: { 
    type: Boolean, 
    default: false,
    index: true 
  },
  
  price: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  wholesale: { 
    type: Boolean, 
    default: false 
  },
  
  minQuantity: { 
    type: Number, 
    default: 1,
    min: 1 
  },
  
  // ✅ VALIDACIONES RELAJADAS (sin regex estrictos)
  phone: { 
    type: String, 
    trim: true,
    default: '',
    // ❌ Eliminamos la validación estricta
    // Solo validamos que sea string y que tenga algún valor si se envía
    validate: {
      validator: function(v) {
        // Si está vacío, es válido (opcional)
        if (!v || v === '') return true;
        // Si tiene valor, al menos debe tener 2 caracteres
        return v.length >= 2;
      },
      message: 'Le numéro de téléphone doit avoir au moins 2 chiffres'
    }
  },
  
  phoneHidden: { 
    type: Boolean, 
    default: false 
  },
  
  // ✅ EMAIL OPCIONAL SIN VALIDACIÓN ESTRICTA
  email: { 
    type: String, 
    trim: true, 
    lowercase: true,
    default: '',
    // ❌ Eliminamos la validación regex estricta
    validate: {
      validator: function(v) {
        // Si está vacío, es válido (opcional)
        if (!v || v === '') return true;
        // Validación muy básica: debe tener @ y algo después
        return v.includes('@') && v.length > 3;
      },
      message: 'Format d\'email invalide (ex: nom@domaine.com)'
    }
  },
  
  website: { type: String, trim: true, default: '' },
  
  // ========== UBICACIÓN ==========
  wilaya: { 
    type: String, 
    trim: true,
    index: true,
    default: ''
  },
  
  commune: { 
    type: String, 
    trim: true,
    default: ''
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' }
  },
  
  // ========== ENTREGA ==========
  delivery: {
    available: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    estimatedDays: { type: Number, default: 0 },
    zones: [{ type: String }]
  },
  
  pickupOnly: { type: Boolean, default: false },
  
  // ========== HORARIO (opcional) ==========
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  
  // ========== MÚSICA (opcional) ==========
  music: {
    id: { type: String, default: null },
    title: { type: String, default: null },
    artist: { type: String, default: null },
    audioUrl: { type: String, default: null },
    volume: { type: Number, default: 70 }
  },
  
  // ========== ESTADÍSTICAS ==========
  views: { type: Number, default: 0, min: 0 },
  uniqueViews: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  shares: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  watchTime: { type: Number, default: 0 },
  averageWatchTime: { type: Number, default: 0 },
  
  // ========== STOCK ==========
  stock: {
    total: { type: Number, default: 0, min: 0 },
    available: { type: Number, default: 0, min: 0 },
    reserved: { type: Number, default: 0, min: 0 }
  },
  
  // ========== ESTADO ==========
  pendiente: { 
    type: Boolean, 
    default: true, 
    index: true 
  },
  isActive: { 
    type: Boolean, 
    default: true,
    index: true 
  },
  isFeatured: { 
    type: Boolean, 
    default: false 
  },
  
  // ========== TAGS Y SEO ==========
  tags: [{ type: String }],
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  
  // ========== SCORES ==========
  engagementScore: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  
  // ========== PRODUCTOS RELACIONADOS ==========
  relatedProducts: [{ type: mongoose.Types.ObjectId, ref: 'Video' }]
  
}, { 
  timestamps: true 
});

// ========== ÍNDICES ==========
videoSchema.index({ location: '2dsphere' });
videoSchema.index({ wilaya: 1, commune: 1 });
videoSchema.index({ category: 1, wholesale: 1 });
videoSchema.index({ price: 1, createdAt: -1 });
videoSchema.index({ isCommercial: 1, pendiente: 1 });
videoSchema.index({ user: 1, createdAt: -1 });
videoSchema.index({ title: 'text', description: 'text' });

// ========== MÉTODOS ==========
videoSchema.methods.isCommercialVideo = function() {
  return this.isCommercial === true;
};

videoSchema.methods.getFormattedLocation = function() {
  return `${this.wilaya}${this.commune ? ', ' + this.commune : ''}`;
};

videoSchema.methods.canViewPhone = function(userId) {
  if (!this.phoneHidden) return true;
  // Si el usuario es el dueño del video, puede ver el teléfono
  if (userId && this.user && String(this.user) === String(userId)) return true;
  return false;
};

videoSchema.methods.incrementViews = async function(userId = null) {
  this.views = (this.views || 0) + 1;
  if (userId) {
    const userIdStr = userId.toString();
    const exists = this.uniqueViews.some(id => id && id.toString() === userIdStr);
    if (!exists) this.uniqueViews.push(userId);
  }
  await this.save();
  return this;
};

videoSchema.methods.updateWatchTime = async function(userId, watchTimeSeconds) {
  this.watchTime += watchTimeSeconds;
  this.averageWatchTime = this.uniqueViews.length > 0 
    ? this.watchTime / this.uniqueViews.length 
    : 0;
  this.updateEngagementScore();
  await this.save();
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
  return { liked, likesCount: this.likes.length };
};

videoSchema.methods.share = async function(userId) {
  const userIdStr = userId.toString();
  const exists = this.shares.some(id => id && id.toString() === userIdStr);
  let shared = false;
  
  if (!exists) {
    this.shares.push(userId);
    shared = true;
    this.updateEngagementScore();
    await this.save();
  }
  
  return { shared, sharesCount: this.shares.length };
};

videoSchema.methods.updateEngagementScore = function() {
  const likesCount = this.likes.length || 0;
  const commentsCount = this.comments.length || 0;
  const sharesCount = this.shares.length || 0;
  const totalViews = this.views || 1;
  const totalEngagement = (likesCount * 2) + (commentsCount * 3) + (sharesCount * 4);
  this.engagementScore = Math.min((totalEngagement / totalViews) * 100, 100);
};

videoSchema.methods.incrementConversion = async function() {
  const totalEngagement = (this.likes.length * 2) + (this.comments.length * 3) + (this.shares.length * 4);
  const totalViews = this.views || 1;
  this.conversionRate = Math.min((totalEngagement / totalViews) * 100, 100);
  await this.save();
};

// ========== MÉTODOS ESTÁTICOS ==========
videoSchema.statics.findNearby = async function(longitude, latitude, maxDistance = 5000, limit = 20) {
  return this.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true,
        query: { isCommercial: true, pendiente: false, isActive: true }
      }
    },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.filterCommercial = async function(filters = {}, page = 1, limit = 20) {
  const query = { isCommercial: true, pendiente: false, isActive: true };
  
  if (filters.wilaya) query.wilaya = filters.wilaya;
  if (filters.commune) query.commune = filters.commune;
  if (filters.category) query.category = filters.category;
  if (filters.wholesale !== undefined) query.wholesale = filters.wholesale;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  
  const skip = (page - 1) * limit;
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: query },
      { $sort: filters.sortBy === 'price' ? { price: filters.sortOrder || 1 } : { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments(query)
  ]);
  
  return { videos, total, page, totalPages: Math.ceil(total / limit) };
};

videoSchema.statics.getTrendingVideos = async function(timeRange = 'week', limit = 20) {
  let dateFilter = {};
  const now = new Date();
  
  if (timeRange === 'day') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
  } else if (timeRange === 'week') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  } else if (timeRange === 'month') {
    dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
  }

  return this.aggregate([
    { $match: { pendiente: false, isActive: true, ...dateFilter } },
    { $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        sharesCount: { $size: { $ifNull: ['$shares', []] } }
    } },
    { $addFields: {
        totalEngagement: { $add: [
          { $multiply: ['$likesCount', 2] },
          { $multiply: ['$commentsCount', 3] },
          { $multiply: ['$sharesCount', 4] }
        ] }
    } },
    { $addFields: { 
      engagementScore: { 
        $min: [ 
          { $multiply: [ 
            { $divide: ['$totalEngagement', { $ifNull: ['$views', 1] }] }, 
            100 
          ] }, 
          100 
        ] 
      } 
    } },
    { $sort: { engagementScore: -1, views: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

// ========== MIDDLEWARE ==========
videoSchema.pre('save', function(next) {
  if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
    this.updateEngagementScore();
  }
  
  // Asegurar que el stock sea consistente
  if (this.stock && this.stock.total !== undefined && this.stock.available === undefined) {
    this.stock.available = this.stock.total;
  }
  
  // Si es comercial y no tiene ubicación, marcar como pendiente
  if (this.isCommercial && (!this.wilaya || this.wilaya === '')) {
    this.pendiente = true;
  }
  
  next();
});

module.exports = mongoose.model('Video', videoSchema);