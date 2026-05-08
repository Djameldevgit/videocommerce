//node addCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel'); // Ajusta la ruta a tu modelo

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/videocommerce';

const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const newCategories = [
  { name: 'Agence', displayName: 'Agence' },
  { name: 'Boutiques', displayName: 'Boutiques' }
];

const addCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    let added = 0;
    let skipped = 0;

    for (const cat of newCategories) {
      const slug = createSlug(cat.name);
      const imageUrl = `/categories/${slug}/${slug}.png`;

      // Verificar si ya existe por nombre o slug
      const exists = await Category.findOne({ $or: [{ name: cat.name }, { slug }] });
      if (exists) {
        console.log(`⚠️  Categoría "${cat.name}" ya existe (slug: ${exists.slug}). Se omite.`);
        skipped++;
        continue;
      }

      // Crear nueva categoría
      const newCategory = new Category({
        name: cat.name,
        slug,
        imageUrl
      });
      await newCategory.save();
      console.log(`✔️  Categoría "${cat.name}" agregada con slug: ${slug}`);
      added++;
    }

    console.log(`\n📊 Resumen: ${added} agregadas, ${skipped} existentes.`);
    const total = await Category.countDocuments();
    console.log(`📂 Total de categorías ahora: ${total}`);

    await mongoose.disconnect();
    console.log('🔌 Desconectado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addCategories();