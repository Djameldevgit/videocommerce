// scripts/seedCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
//const Category = require('../models/categoryModel'); // ← mismo modelo
 

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VideoCommerce';
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// Lista de categorías (mismo orden que en categoriesData2.js)
const categoriesData = [
  { slug: 'agence', name: 'Agence', order: 1 },
  { slug: 'alimentaires', name: 'Alimentaires', order: 2 },
  { slug: 'art', name: 'Art', order: 3 },
  { slug: 'boutiques', name: 'Boutiques', order: 4 },
  { slug: 'electromenager', name: 'Électroménager', order: 5 },
  { slug: 'electronique', name: 'Électronique', order: 6 },
  { slug: 'emploi', name: 'Emploi', order: 7 },
  { slug: 'immobilier', name: 'Immobilier', order: 8 },
  { slug: 'informatique', name: 'Informatique', order: 9 },
  { slug: 'loisirs-divertissements', name: 'Loisirs & Divertissements', order: 10 },
  { slug: 'materiaux-equipement', name: 'Matériaux & Équipement', order: 11 },
  { slug: 'meubles-maison', name: 'Meubles & Maison', order: 12 },
  { slug: 'pieces-detachees', name: 'Pièces détachées', order: 13 },
  { slug: 'publicite', name: 'Publicité', order: 14 },
  { slug: 'sante-beaute', name: 'Santé & Beauté', order: 15 },
  { slug: 'services', name: 'Services', order: 16 },
  { slug: 'sport', name: 'Sport', order: 17 },
  { slug: 'telephones', name: 'Téléphones', order: 18 },
  { slug: 'vehicules', name: 'Véhicules', order: 19 },
  { slug: 'vetements-mode', name: 'Vêtements & Mode', order: 20 },
  { slug: 'voyages', name: 'Voyages', order: 21 }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log('✅ Conectado a MongoDB');

    // Opcional: eliminar primero (si quieres empezar limpio)
    // await Category.deleteMany({});
    // console.log('🗑️ Categorías anteriores eliminadas');

    let created = 0;
    for (const cat of categoriesData) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (!existing) {
        const newCat = new Category({
          name: cat.name,
          slug: cat.slug,
          imageUrl: `/categories/${cat.slug}/${cat.slug}.png`, // ← CLAVE: ruta del icono
          order: cat.order,
          isActive: true,
          videoCount: 0
        });
        await newCat.save();
        created++;
        console.log(`✅ Creada: ${cat.name} (${cat.slug}) - imageUrl: ${newCat.imageUrl}`);
      } else {
        console.log(`⏭️ Ya existe: ${cat.name}`);
      }
    }
    console.log(`\n🎉 Categorías insertadas: ${created} / ${categoriesData.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar categorías:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();