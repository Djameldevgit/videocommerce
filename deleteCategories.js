//  deleteCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');

// ✅ Importa tu modelo de categoría (exportación por defecto)
const Category = require('../models/categoryModel'); // ← Ruta correcta

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VideoCommerce';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const confirmDelete = () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question('⚠️  ¿Eliminar TODAS las categorías? (escribe "SI"): ', (answer) => {
      rl.close();
      resolve(answer === 'SI');
    });
  });
};

const deleteAllCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ Conectado a MongoDB');

    const count = await Category.countDocuments();
    if (count === 0) {
      console.log('ℹ️  No hay categorías para eliminar.');
      process.exit(0);
    }

    console.log(`📊 Se encontraron ${count} categorías.`);
    const confirmed = await confirmDelete();
    if (!confirmed) {
      console.log('❌ Cancelado.');
      process.exit(0);
    }

    const result = await Category.deleteMany({});
    console.log(`✅ Eliminadas ${result.deletedCount} categorías.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

deleteAllCategories();