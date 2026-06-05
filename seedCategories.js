// node seedCategories.js - VERSIÓN CON PRIORIDAD ALTA PARA TUTORIALES Y CANALES

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VideoCommerce';
const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// ✅ CATEGORÍAS CON ORDEN PRIORITARIO (importantes al principio)
const categoriesData = [
  // ============ 🎓 CATEGORÍAS ESPECIALES (Alta prioridad - Primeras en el slider) ============
  { 
    slug: 'tutorials', 
    name: 'Tutoriels', 
    nameFr: 'Tutoriels',
    nameAr: 'دروس تعليمية',
    order: 1,                    // ← PRIMERA posición
    icon: '🎓', 
    isPublic: true,              // ← Ahora visible para todos (para onboarding)
    isAdminOnly: false,          // ← Ya no es solo admin
    isSpecial: true,
    specialType: 'tutorials',
    priority: 'high'
  },
  { 
    slug: 'channels', 
    name: 'Chaînes', 
    nameFr: 'Chaînes',
    nameAr: 'قنوات',
    order: 2,                    // ← SEGUNDA posición
    icon: '📺', 
    isPublic: true, 
    isAdminOnly: false,
    isSpecial: true,
    specialType: 'channels',
    priority: 'high'
  },

  // ============ 🏪 CATEGORÍAS COMERCIALES (Prioridad media) ============
  { slug: 'agence', name: 'Agence', order: 3, icon: '🏢', isPublic: true, isAdminOnly: false },
  { slug: 'immobilier', name: 'Immobilier', order: 4, icon: '🏠', isPublic: true, isAdminOnly: false },
  { slug: 'vehicules', name: 'Automobiles & Véhicules', order: 5, icon: '🚗', isPublic: true, isAdminOnly: false },
  { slug: 'pieces-detachees', name: 'Pièces détachées', order: 6, icon: '🔧', isPublic: true, isAdminOnly: false },
  { slug: 'telephones', name: 'Téléphones & Accessoires', order: 7, icon: '📱', isPublic: true, isAdminOnly: false },
  { slug: 'informatique', name: 'Informatique', order: 8, icon: '💻', isPublic: true, isAdminOnly: false },
  { slug: 'electromenager', name: 'Électroménager & Électronique', order: 9, icon: '🔌', isPublic: true, isAdminOnly: false },
  { slug: 'vetements-mode', name: 'Vêtements & Mode', order: 10, icon: '👕', isPublic: true, isAdminOnly: false },
  { slug: 'sante-beaute', name: 'Santé & Beauté', order: 11, icon: '💄', isPublic: true, isAdminOnly: false },
  { slug: 'meubles-maison', name: 'Meubles & Maison', order: 12, icon: '🛋️', isPublic: true, isAdminOnly: false },
  { slug: 'loisirs-divertissements', name: 'Loisirs & Divertissements', order: 13, icon: '🎮', isPublic: true, isAdminOnly: false },
  { slug: 'sport', name: 'Sport', order: 14, icon: '⚽', isPublic: true, isAdminOnly: false },
  { slug: 'emploi', name: 'Emploi', order: 15, icon: '💼', isPublic: true, isAdminOnly: false },
  { slug: 'materiaux-equipement', name: 'Matériaux & Équipement', order: 16, icon: '🏗️', isPublic: true, isAdminOnly: false },
  { slug: 'alimentaires', name: 'Alimentaires', order: 17, icon: '🍎', isPublic: true, isAdminOnly: false },
  { slug: 'voyages', name: 'Voyages', order: 18, icon: '✈️', isPublic: true, isAdminOnly: false },
  { slug: 'services', name: 'Services', order: 19, icon: '🛠️', isPublic: true, isAdminOnly: false },
  { slug: 'art', name: 'Art', order: 20, icon: '🎨', isPublic: true, isAdminOnly: false },
];

// Colores para cada categoría
const categoryColors = {
  // Especiales (alta prioridad)
  'tutorials': '#F1C40F',        // Amarillo - llama la atención
  'channels': '#8E44AD',         // Púrpura - destaca canales
  
  // Comerciales
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
  'art': '#E84393',
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
        nameFr: cat.nameFr || cat.name,
        nameAr: cat.nameAr || cat.name,
        imageUrl: `/categories/${cat.slug}/${cat.slug}.png`,
        order: cat.order,
        isActive: true,
        icon: cat.icon,
        iconColor: categoryColors[cat.slug] || '#666666',
        bgColor: `${categoryColors[cat.slug] || '#666666'}15`,
        videoCount: 0,
        // ✅ NUEVOS CAMPOS
        isPublic: cat.isPublic !== undefined ? cat.isPublic : true,
        isAdminOnly: cat.isAdminOnly || false,
        isSpecial: cat.isSpecial || false,
        specialType: cat.specialType || null,
        priority: cat.priority || 'normal'
      };
      const newCat = new Category(categoryData);
      await newCat.save();
      created++;
      
      const priorityBadge = categoryData.priority === 'high' ? '🔥 ALTA' : '📌';
      const special = categoryData.isSpecial ? `✨ [${categoryData.specialType}]` : '';
      console.log(`✅ [${cat.order}] ${priorityBadge} CREADA: ${cat.name} ${special}`);
    }

    console.log(`\n📊 Resumen final: ${created} categorías creadas.`);

    // Mostrar todas las categorías ordenadas
    const allCategories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .select('name slug order videoCount isSpecial specialType priority')
      .lean();
    
    console.log('\n📋 ORDEN FINAL DE CATEGORÍAS (Prioridad alta primero):');
    allCategories.forEach((cat, idx) => {
      const priorityIcon = cat.priority === 'high' ? '🔥' : '  ';
      const specialIcon = cat.isSpecial ? `✨` : '  ';
      console.log(`   ${priorityIcon} ${specialIcon} ${idx + 1}. ${cat.name} (orden: ${cat.order})`);
    });

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n💡 NOTA: Las categorías "Tutoriels" y "Chaînes" aparecerán PRIMERO en el slider por su alta prioridad.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error al poblar categorías:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();