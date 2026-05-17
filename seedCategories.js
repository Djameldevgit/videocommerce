// node seedCategories.js - VERSIÓN QUE ELIMINA Y RECREA (con "Art" y "Social")
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VideoCommerce';
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// ✅ CATEGORÍAS EN EL ORDEN CORRECTO (con "Art" y "Réseaux sociaux" al final)
const categoriesData = [
  { slug: 'agence', name: 'Agence', order: 1, icon: '🏢' },
  { slug: 'immobilier', name: 'Immobilier', order: 2, icon: '🏠' },
  { slug: 'vehicules', name: 'Automobiles & Véhicules', order: 3, icon: '🚗' },
  { slug: 'pieces-detachees', name: 'Pièces détachées', order: 4, icon: '🔧' },
  { slug: 'telephones', name: 'Téléphones & Accessoires', order: 5, icon: '📱' },
  { slug: 'informatique', name: 'Informatique', order: 6, icon: '💻' },
  { slug: 'electromenager', name: 'Électroménager & Électronique', order: 7, icon: '🔌' },
  { slug: 'vetements-mode', name: 'Vêtements & Mode', order: 8, icon: '👕' },
  { slug: 'sante-beaute', name: 'Santé & Beauté', order: 9, icon: '💄' },
  { slug: 'meubles-maison', name: 'Meubles & Maison', order: 10, icon: '🛋️' },
  { slug: 'loisirs-divertissements', name: 'Loisirs & Divertissements', order: 11, icon: '🎮' },
  { slug: 'sport', name: 'Sport', order: 12, icon: '⚽' },
  { slug: 'emploi', name: 'Emploi', order: 13, icon: '💼' },
  { slug: 'materiaux-equipement', name: 'Matériaux & Équipement', order: 14, icon: '🏗️' },
  { slug: 'alimentaires', name: 'Alimentaires', order: 15, icon: '🍎' },
  { slug: 'voyages', name: 'Voyages', order: 16, icon: '✈️' },
  { slug: 'services', name: 'Services', order: 17, icon: '🛠️' },

  { slug: 'art', name: 'Art', order: 18, icon: '🎨' },
 ];

// Colores para cada categoría (incluyendo 'art' y 'reseaux-sociaux')
const categoryColors = {
  'agence': '#4A90E2',
  'immobilier': '#50B5A9',
  'vehicules': '#E67E22',
  'pieces-detachees': '#95A5A6',
  'telephones': '#2ECC71',
  'informatique': '#3498DB',
  'electromenager': '#E74C3C',
  'vetements-mode': '#9B59B6',
  'sante-beaute': '#FF6B9D',
  'meubles-maison': '#D35400',
  'loisirs-divertissements': '#F39C12',
  'sport': '#1ABC9C',
  'emploi': '#34495E',
  'materiaux-equipement': '#7F8C8D',
  'alimentaires': '#27AE60',
  'voyages': '#2980B9',
  'services': '#16A085',
    'art': '#E84393',        // Rosa/Magenta para arte
 };

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ Conectado a MongoDB');
    console.log('📂 Base de datos:', mongoose.connection.db.databaseName);

    // 🔥 ELIMINAR TODAS LAS CATEGORÍAS EXISTENTES
    const deleteResult = await Category.deleteMany({});
    console.log(`🗑️ Eliminadas ${deleteResult.deletedCount} categorías anteriores`);

    let created = 0;

    for (const cat of categoriesData) {
      const categoryData = {
        name: cat.name,
        slug: cat.slug,
        imageUrl: `/categories/${cat.slug}/${cat.slug}.png`,
        order: cat.order,
        isActive: true,
        icon: cat.icon,
        iconColor: categoryColors[cat.slug] || '#666666',
        bgColor: `${categoryColors[cat.slug] || '#666666'}15`,
        videoCount: 0
      };
      const newCat = new Category(categoryData);
      await newCat.save();
      created++;
      console.log(`✅ [${cat.order}] CREADA: ${cat.name} (${cat.slug})`);
    }

    console.log(`\n📊 Resumen final: ${created} categorías creadas.`);

    // Mostrar todas las categorías ordenadas
    const allCategories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .select('name slug order videoCount')
      .lean();
    
    console.log('\n📋 ORDEN FINAL DE CATEGORÍAS:');
    allCategories.forEach((cat, idx) => {
      console.log(`   ${idx + 1}. ${cat.name} (orden: ${cat.order}) - ${cat.videoCount} videos`);
    });

    console.log('\n🎉 Seed completado exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al poblar categorías:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();