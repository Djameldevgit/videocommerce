const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // 👤 Autor
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },

    // ❌ ELIMINAR boutique - ya no se usa aquí
    // boutique: { ... }  ← ELIMINAR ESTE CAMPO

    // 🗂️ Categorías
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

    // 🔑 Categoría real
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    // ❤️ Interacciones
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],

    // 🧾 Info
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      maxlength: 3000
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000000000
    },

    etat: String,

    // 📍 Localización
    wilaya: {
      type: String,
      index: true
    },
    commune: String,
    address: String,

    // 📞 Contacto
    phone: String,
    email: {
      type: String,
      lowercase: true
    },

    // 🧩 Datos dinámicos
    categorySpecificData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 🖼️ Imágenes
    images: [
      {
        url: String,
        public_id: String
      }
    ],

    // 📊 Stats
    views: {
      type: Number,
      default: 0
    },

    score: {
      type: Number,
      default: 0,
      index: true
    },

    lastInteractionAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    // 🔗 SEO
    slug: {
      type: String,
      unique: true,
      index: true
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    pendiente: {
      type: Boolean,
      default: true,
      index: true
    },

    // 🔒 Estado
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// 🧠 MÉTODO SCORE
postSchema.methods.calculateScore = function () {
  const views = this.views || 0;
  const likes = this.likes.length || 0;
  const freshness = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return (likes * 3) + (views * 0.5) - freshness;
};

// ============================================
// 🔥 ÍNDICES OPTIMIZADOS (sin referencia a boutique)
// ============================================

// 1️⃣ Índice principal para filtrar posts aprobados
postSchema.index({ pendiente: 1, isActive: 1, createdAt: -1 });

// 2️⃣ Para la página principal - posts recientes aprobados
postSchema.index({ pendiente: 1, createdAt: -1 });

// 3️⃣ Para filtrar por categoría + aprobación
postSchema.index({ category: 1, pendiente: 1, createdAt: -1 });

// 4️⃣ Para filtrar por usuario + aprobación
postSchema.index({ user: 1, pendiente: 1, createdAt: -1 });

// 5️⃣ Para admin - ver posts pendientes
postSchema.index({ pendiente: 1, createdAt: -1 });

// 6️⃣ Para búsquedas con múltiples filtros
postSchema.index({ category: 1, wilaya: 1, pendiente: 1 });

// 7️⃣ Para ordenar por score (posts populares)
postSchema.index({ pendiente: 1, score: -1 });

// 8️⃣ Para filtros de precio + aprobación
postSchema.index({ pendiente: 1, price: 1, category: 1 });

// 9️⃣ Para búsqueda por texto
postSchema.index({ title: "text", description: "text", categorie: "text", subCategory: "text" });

// 🔟 Índices existentes útiles
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ wilaya: 1, category: 1 });
postSchema.index({ categorie: 1, subCategory: 1 });
postSchema.index({ score: -1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);