// seedCategories.js - VERSIÓN FRANCÉS PARA VideoCommerce (Argelia)
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/videocommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Erreur de connexion à MongoDB:'));
db.once('open', async () => {
  console.log('✅ Connecté à MongoDB avec succès');
  await seedCategories();
});

// Fonction pour créer un slug
const createSlug = (name) => {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 📋 CATÉGORIES PRINCIPALES POUR VideoCommerce (Version Français)
// Les catégories essentielles pour un marketplace de vidéos commerciales en Algérie
const mainCategories = [
  {
    name: 'Véhicules',
    icon: '🚗',
    iconType: 'emoji',
    iconColor: '#3B82F6',
    bgColor: '#EFF6FF',
    order: 1,
    description: 'Voitures, motos, camions et plus'
  },
  {
    name: 'Immobilier',
    icon: '🏠',
    iconType: 'emoji',
    iconColor: '#10B981',
    bgColor: '#ECFDF5',
    order: 2,
    description: 'Vente et location de propriétés'
  },
  {
    name: 'Électroménager',
    icon: '🔌',
    iconType: 'emoji',
    iconColor: '#F59E0B',
    bgColor: '#FFFBEB',
    order: 3,
    description: 'Lave-linge, réfrigérateurs, TVs et plus'
  },
  {
    name: 'Électronique',
    icon: '📱',
    iconType: 'emoji',
    iconColor: '#EF4444',
    bgColor: '#FEF2F2',
    order: 4,
    description: 'Téléphones, ordinateurs, tablettes'
  },
  {
    name: 'Mode',
    icon: '👕',
    iconType: 'emoji',
    iconColor: '#EC4899',
    bgColor: '#FDF2F8',
    order: 5,
    description: 'Vêtements, chaussures, accessoires'
  },
  {
    name: 'Maison',
    icon: '🛋️',
    iconType: 'emoji',
    iconColor: '#8B5CF6',
    bgColor: '#F5F3FF',
    order: 6,
    description: 'Meubles, décoration, jardin'
  },
  {
    name: 'Sports',
    icon: '⚽',
    iconType: 'emoji',
    iconColor: '#06B6D4',
    bgColor: '#ECFEFF',
    order: 7,
    description: 'Équipements et accessoires sportifs'
  },
  {
    name: 'Santé & Beauté',
    icon: '💄',
    iconType: 'emoji',
    iconColor: '#F43F5E',
    bgColor: '#FFF1F2',
    order: 8,
    description: 'Cosmétiques, soins personnels'
  },
  {
    name: 'Alimentation',
    icon: '🍕',
    iconType: 'emoji',
    iconColor: '#F97316',
    bgColor: '#FFF7ED',
    order: 9,
    description: 'Produits alimentaires et boissons'
  },
  {
    name: 'Services',
    icon: '🔧',
    iconType: 'emoji',
    iconColor: '#64748B',
    bgColor: '#F1F5F9',
    order: 10,
    description: 'Services professionnels'
  },
  {
    name: 'Animaux',
    icon: '🐕',
    iconType: 'emoji',
    iconColor: '#A855F7',
    bgColor: '#FAF5FF',
    order: 11,
    description: 'Produits et accessoires pour animaux'
  },
  {
    name: 'Jouets',
    icon: '🧸',
    iconType: 'emoji',
    iconColor: '#FB923C',
    bgColor: '#FFF7ED',
    order: 12,
    description: 'Jouets et jeux'
  },
  {
    name: 'Art',
    icon: '🎨',
    iconType: 'emoji',
    iconColor: '#D946EF',
    bgColor: '#FAF5FF',
    order: 13,
    description: 'Œuvres d\'art, artisanat'
  },
  {
    name: 'Livres',
    icon: '📚',
    iconType: 'emoji',
    iconColor: '#14B8A6',
    bgColor: '#F0FDFA',
    order: 14,
    description: 'Livres, magazines, matériel éducatif'
  },
  {
    name: 'Musique',
    icon: '🎵',
    iconType: 'emoji',
    iconColor: '#A855F7',
    bgColor: '#FAF5FF',
    order: 15,
    description: 'Instruments, équipements audio'
  }
];

const seedCategories = async () => {
  try {
    // Supprimer les catégories existantes
    await Category.deleteMany({});
    console.log('🗑️  Anciennes catégories supprimées');

    // Insérer les catégories principales
    const categoriesToInsert = mainCategories.map(cat => ({
      ...cat,
      slug: createSlug(cat.name),
      isActive: true,
      videoCount: 0
    }));

    await Category.insertMany(categoriesToInsert);
    
    console.log('\n🎉 SEED COMPLÉTÉ AVEC SUCCÈS');
    console.log('📊 Résumé:');
    console.log(`   • ${categoriesToInsert.length} catégories principales insérées`);
    console.log('\n📋 Liste des catégories:');
    categoriesToInsert.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (/${cat.slug}) - ${cat.icon}`);
    });
    console.log('\n✨ VideoCommerce est prêt à être utilisé!');
    console.log('💡 Les catégories sont maintenant au niveau principal, sans sous-catégories');
    console.log('🎬 Les vidéos seront directement associées à ces catégories');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};