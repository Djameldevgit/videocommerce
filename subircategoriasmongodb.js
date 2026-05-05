// seedCategories.js - VERSIÓN SIMPLIFICADA PARA VideoCommerce
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category'); // Tu nuevo modelo simplificado

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/videocommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión a MongoDB:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB exitosamente');
  await seedCategories();
});

// Función para crear slug
const createSlug = (name) => {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// 📋 CATEGORÍAS PRINCIPALES PARA VideoCommerce
// Solo las esenciales para un marketplace de videos comerciales
const mainCategories = [
  {
    name: 'Vehículos',
    icon: '🚗',
    iconType: 'emoji',
    iconColor: '#3B82F6',
    bgColor: '#EFF6FF',
    order: 1,
    description: 'Autos, motos, camiones y más'
  },
  {
    name: 'Inmobiliaria',
    icon: '🏠',
    iconType: 'emoji',
    iconColor: '#10B981',
    bgColor: '#ECFDF5',
    order: 2,
    description: 'Venta y alquiler de propiedades'
  },
  {
    name: 'Electrodomésticos',
    icon: '🔌',
    iconType: 'emoji',
    iconColor: '#F59E0B',
    bgColor: '#FFFBEB',
    order: 3,
    description: 'Lavadoras, neveras, TVs y más'
  },
  {
    name: 'Electrónica',
    icon: '📱',
    iconType: 'emoji',
    iconColor: '#EF4444',
    bgColor: '#FEF2F2',
    order: 4,
    description: 'Celulares, computadoras, tablets'
  },
  {
    name: 'Moda',
    icon: '👕',
    iconType: 'emoji',
    iconColor: '#EC4899',
    bgColor: '#FDF2F8',
    order: 5,
    description: 'Ropa, calzado, accesorios'
  },
  {
    name: 'Hogar',
    icon: '🛋️',
    iconType: 'emoji',
    iconColor: '#8B5CF6',
    bgColor: '#F5F3FF',
    order: 6,
    description: 'Muebles, decoración, jardín'
  },
  {
    name: 'Deportes',
    icon: '⚽',
    iconType: 'emoji',
    iconColor: '#06B6D4',
    bgColor: '#ECFEFF',
    order: 7,
    description: 'Equipamiento y accesorios deportivos'
  },
  {
    name: 'Salud & Belleza',
    icon: '💄',
    iconType: 'emoji',
    iconColor: '#F43F5E',
    bgColor: '#FFF1F2',
    order: 8,
    description: 'Cosméticos, cuidado personal'
  },
  {
    name: 'Alimentos',
    icon: '🍕',
    iconType: 'emoji',
    iconColor: '#F97316',
    bgColor: '#FFF7ED',
    order: 9,
    description: 'Productos alimenticios y bebidas'
  },
  {
    name: 'Servicios',
    icon: '🔧',
    iconType: 'emoji',
    iconColor: '#64748B',
    bgColor: '#F1F5F9',
    order: 10,
    description: 'Servicios profesionales'
  },
  {
    name: 'Mascotas',
    icon: '🐕',
    iconType: 'emoji',
    iconColor: '#A855F7',
    bgColor: '#FAF5FF',
    order: 11,
    description: 'Productos y accesorios para mascotas'
  },
  {
    name: 'Juguetes',
    icon: '🧸',
    iconType: 'emoji',
    iconColor: '#FB923C',
    bgColor: '#FFF7ED',
    order: 12,
    description: 'Juguetes y juegos'
  },
  {
    name: 'Arte',
    icon: '🎨',
    iconType: 'emoji',
    iconColor: '#D946EF',
    bgColor: '#FAF5FF',
    order: 13,
    description: 'Obras de arte, artesanías'
  },
  {
    name: 'Libros',
    icon: '📚',
    iconType: 'emoji',
    iconColor: '#14B8A6',
    bgColor: '#F0FDFA',
    order: 14,
    description: 'Libros, revistas, material educativo'
  },
  {
    name: 'Música',
    icon: '🎵',
    iconType: 'emoji',
    iconColor: '#A855F7',
    bgColor: '#FAF5FF',
    order: 15,
    description: 'Instrumentos, equipos de audio'
  }
];

const seedCategories = async () => {
  try {
    // Eliminar categorías existentes
    await Category.deleteMany({});
    console.log('🗑️  Categorías antiguas eliminadas');

    // Insertar categorías principales
    const categoriesToInsert = mainCategories.map(cat => ({
      ...cat,
      slug: createSlug(cat.name),
      isActive: true,
      videoCount: 0
    }));

    await Category.insertMany(categoriesToInsert);
    
    console.log('\n🎉 SEED COMPLETADO CON ÉXITO');
    console.log('📊 Resumen:');
    console.log(`   • ${categoriesToInsert.length} categorías principales insertadas`);
    console.log('\n📋 Lista de categorías:');
    categoriesToInsert.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (/${cat.slug}) - ${cat.icon}`);
    });
    console.log('\n✨ VideoCommerce está listo para usar!');
    console.log('💡 Las categorías ahora solo tienen nivel principal, sin subcategorías');
    console.log('🎬 Los videos se asociarán directamente a estas categorías');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};