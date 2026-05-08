// seedCategories.js - Versión con imágenes PNG reales
// migrateAddImageUrl.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/videocommerce');

const createSlug = (name) => {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const updateCategories = async () => {
  try {
    const categories = await Category.find({});
    console.log(`✅ Encontradas ${categories.length} categorías`);

    for (const cat of categories) {
      const slug = cat.slug || createSlug(cat.name);
      const imageUrl = `/categories/${slug}/${slug}.png`;
      cat.imageUrl = imageUrl;
      await cat.save();
      console.log(`✔️ ${cat.name} -> ${imageUrl}`);
    }
    console.log('🎉 Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateCategories();