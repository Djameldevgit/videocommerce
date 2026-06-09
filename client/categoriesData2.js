// node categoriesData2.js
// Crea carpetas y placeholders de iconos para TODAS las categorías
// Incluye categorías especiales: tutorials (🎓) y channels (📺) al PRINCIPIO

const fs = require('fs');
const path = require('path');

// ✅ Ruta base - /public/categories/ (desde la raíz del proyecto)
const basePath = path.join(process.cwd(), 'public', 'categories');

console.log('📁 Ruta base calculada:', basePath);
console.log('📁 Directorio actual:', process.cwd());

// ============================================
// 📋 LISTA COMPLETA DE SLUGS - ORDEN PRIORITARIO
// ============================================
// 🔥 Las categorías especiales van PRIMERO (Tutoriels y Chaînes)
// Luego las categorías comerciales
// ============================================

const mainCategories = [
  // ============ 🎓 CATEGORÍAS ESPECIALES (ALTA PRIORIDAD) ============
  'tutorials',      // ← PRIMERA: Tutoriales para onboarding
  'channels',       // ← SEGUNDA: Canales destacados (Chaînes)
  
 
  'immobilier',
  'vehicules',
  'pieces-detachees',
  'telephones',
  'informatique',
  'electromenager',
  'vetements-mode',
  'sante-beaute',
  'meubles-maison',
  'loisirs-divertissements',
  'sport',
  'emploi',
  'materiaux-equipement',
  'alimentaires',
  'voyages',
  'services',
  'art'
];

// Mapeo de slug a nombre legible (con soporte multi-idioma)
const categoryNames = {
  // Especiales
  'tutorials': 'Tutoriels',
  'channels': 'Chaînes',
  
  // Comerciales
   
  'immobilier': 'Immobilier',
  'vehicules': 'Automobiles & Véhicules',
  'pieces-detachees': 'Pièces détachées',
  'telephones': 'Téléphones & Accessoires',
  'informatique': 'Informatique',
  'electromenager': 'Électroménager & Électronique',
  'vetements-mode': 'Vêtements & Mode',
  'sante-beaute': 'Santé & Beauté',
  'meubles-maison': 'Meubles & Maison',
  'loisirs-divertissements': 'Loisirs & Divertissements',
  'sport': 'Sport',
  'emploi': 'Emploi',
  'materiaux-equipement': 'Matériaux & Équipement',
  'alimentaires': 'Alimentaires',
  'voyages': 'Voyages',
  'services': 'Services',
  'art': 'Art'
};

// Nombres en francés
const categoryNamesFr = {
  'tutorials': 'Tutoriels',
  'channels': 'Chaînes',
   
  'immobilier': 'Immobilier',
  'vehicules': 'Automobiles & Véhicules',
  'pieces-detachees': 'Pièces détachées',
  'telephones': 'Téléphones & Accessoires',
  'informatique': 'Informatique',
  'electromenager': 'Électroménager & Électronique',
  'vetements-mode': 'Vêtements & Mode',
  'sante-beaute': 'Santé & Beauté',
  'meubles-maison': 'Meubles & Maison',
  'loisirs-divertissements': 'Loisirs & Divertissements',
  'sport': 'Sport',
  'emploi': 'Emploi',
  'materiaux-equipement': 'Matériaux & Équipement',
  'alimentaires': 'Alimentaires',
  'voyages': 'Voyages',
  'services': 'Services',
  'art': 'Art'
};

// Nombres en árabe (para futura implementación)
const categoryNamesAr = {
  'tutorials': 'دروس تعليمية',
  'channels': 'قنوات',
  
  'immobilier': 'عقارات',
  'vehicules': 'سيارات ومركبات',
  'pieces-detachees': 'قطع الغيار',
  'telephones': 'هواتف وإكسسوارات',
  'informatique': 'معلوماتية',
  'electromenager': 'أجهزة منزلية',
  'vetements-mode': 'ملابس وموضة',
  'sante-beaute': 'صحة وجمال',
  'meubles-maison': 'أثاث ومنزل',
  'loisirs-divertissements': 'ترفيه وتسلية',
  'sport': 'رياضة',
  'emploi': 'توظيف',
  'materiaux-equipement': 'مواد ومعدات',
  'alimentaires': 'مواد غذائية',
  'voyages': 'سفر',
  'services': 'خدمات',
  'art': 'فن'
};

// Iconos para cada categoría
const categoryIcons = {
  'tutorials': '🎓',
  'channels': '📺',
  
  'immobilier': '🏠',
  'vehicules': '🚗',
  'pieces-detachees': '🔧',
  'telephones': '📱',
  'informatique': '💻',
  'electromenager': '🔌',
  'vetements-mode': '👕',
  'sante-beaute': '💄',
  'meubles-maison': '🛋️',
  'loisirs-divertissements': '🎮',
  'sport': '⚽',
  'emploi': '💼',
  'materiaux-equipement': '🏗️',
  'alimentaires': '🍎',
  'voyages': '✈️',
  'services': '🛠️',
  'art': '🎨'
};

// Colores asociados a cada categoría
const categoryColors = {
  // Especiales (alta prioridad - colores llamativos)
  'tutorials': '#F1C40F',     // Amarillo - llama la atención
  'channels': '#8E44AD',       // Púrpura - destaca canales
  
  // Comerciales
  
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
  'art': '#E84393'
};

// Prioridad (high, normal, low)
const categoryPriority = {
  'tutorials': 'high',
  'channels': 'high',
 
  'immobilier': 'normal',
  'vehicules': 'normal',
  'pieces-detachees': 'normal',
  'telephones': 'normal',
  'informatique': 'normal',
  'electromenager': 'normal',
  'vetements-mode': 'normal',
  'sante-beaute': 'normal',
  'meubles-maison': 'normal',
  'loisirs-divertissements': 'normal',
  'sport': 'normal',
  'emploi': 'normal',
  'materiaux-equipement': 'normal',
  'alimentaires': 'normal',
  'voyages': 'normal',
  'services': 'normal',
  'art': 'normal'
};

// Tipo de categoría (commercial, special)
const categoryType = {
  'tutorials': 'special',
  'channels': 'special',
  
  'immobilier': 'commercial',
  'vehicules': 'commercial',
  'pieces-detachees': 'commercial',
  'telephones': 'commercial',
  'informatique': 'commercial',
  'electromenager': 'commercial',
  'vetements-mode': 'commercial',
  'sante-beaute': 'commercial',
  'meubles-maison': 'commercial',
  'loisirs-divertissements': 'commercial',
  'sport': 'commercial',
  'emploi': 'commercial',
  'materiaux-equipement': 'commercial',
  'alimentaires': 'commercial',
  'voyages': 'commercial',
  'services': 'commercial',
  'art': 'commercial'
};

// Función para crear carpetas y placeholders
function createCategoryIcons(basePath, slugs) {
  console.log('\n📁 Creando estructura en:', basePath);
  console.log('='.repeat(60));

  const publicPath = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicPath)) {
    console.log(`⚠️ La carpeta 'public' no existe, creándola...`);
    fs.mkdirSync(publicPath, { recursive: true });
    console.log(`✅ Creada carpeta: ${publicPath}`);
  }

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Creada carpeta base: ${basePath}\n`);
  }

  let totalIcons = 0;
  let orderNumber = 1;

  for (const slug of slugs) {
    const priorityIcon = categoryPriority[slug] === 'high' ? '🔥' : '📌';
    const specialIcon = categoryType[slug] === 'special' ? '✨' : '  ';
    console.log(`${orderNumber}. ${priorityIcon} ${specialIcon} Procesando: ${categoryNames[slug] || slug} (${slug})`);
    
    const categoryPath = path.join(basePath, slug);
    
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`      ✅ Creada carpeta: ${slug}/`);
    } else {
      console.log(`      📁 Carpeta existe: ${slug}/`);
    }

    const iconFile = `${slug}.png`;
    const iconPath = path.join(categoryPath, iconFile);
    
    if (!fs.existsSync(iconPath)) {
      const emptyPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const emptyPngBuffer = Buffer.from(emptyPngBase64, 'base64');
      fs.writeFileSync(iconPath, emptyPngBuffer);
      console.log(`      🖼️  Icono creado: ${slug}/${iconFile}`);
      totalIcons++;
    } else {
      console.log(`      ⏭️  Icono ya existe: ${slug}/${iconFile}`);
    }
    
    orderNumber++;
    console.log('');
  }

  return { totalIcons, totalCategories: slugs.length };
}

// Generar categories-config.json
function createCategoriesConfig(slugs) {
  const configPath = path.join(basePath, 'categories-config.json');
  
  const config = {
    version: '3.0.0',
    lastUpdated: new Date().toISOString(),
    totalCategories: slugs.length,
    categories: slugs.map((slug, index) => ({
      order: index + 1,
      slug: slug,
      name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      nameFr: categoryNamesFr[slug] || categoryNames[slug],
      nameAr: categoryNamesAr[slug] || categoryNames[slug],
      icon: categoryIcons[slug] || '📁',
      iconUrl: `/categories/${slug}/${slug}.png`,
      iconColor: categoryColors[slug] || '#666666',
      bgColor: `${categoryColors[slug] || '#666666'}15`,
      priority: categoryPriority[slug] || 'normal',
      type: categoryType[slug] || 'commercial',
      isActive: true,
      isPublic: true,
      isAdminOnly: (slug === 'tutorials') ? false : false,  // Tutorials visible para todos
      isSpecial: (slug === 'tutorials' || slug === 'channels')
    }))
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`\n📄 Configuración guardada en: ${configPath}`);
  return config;
}

// Verificar estructura
function verifyStructure(basePath, slugs) {
  console.log('\n🔍 Verificando estructura:');
  console.log('='.repeat(60));
  
  let errors = [];
  let successCount = 0;
  
  for (const slug of slugs) {
    const iconPath = path.join(basePath, slug, `${slug}.png`);
    if (!fs.existsSync(iconPath)) {
      errors.push(`❌ Icono faltante: ${slug}/${slug}.png`);
    } else {
      const priorityIcon = categoryPriority[slug] === 'high' ? '🔥' : '  ';
      console.log(`${priorityIcon} ✅ ${slug}/ - OK`);
      successCount++;
    }
  }
  
  if (errors.length) {
    console.log('\n⚠️  Errores:');
    errors.forEach(e => console.log(e));
  } else {
    console.log(`\n✨ ¡Todas las ${successCount} categorías están correctas!`);
  }
  return errors.length === 0;
}

// Mostrar orden final
function showFinalOrder(slugs) {
  console.log('\n📋 ORDEN FINAL DE CATEGORÍAS (Prioridad alta primero):');
  console.log('='.repeat(60));
  
  slugs.forEach((slug, index) => {
    const num = (index + 1).toString().padStart(2, ' ');
    const priorityIcon = categoryPriority[slug] === 'high' ? '🔥' : '  ';
    const specialIcon = categoryType[slug] === 'special' ? '✨' : '  ';
    const name = categoryNames[slug] || slug;
    console.log(`${num}. ${priorityIcon} ${specialIcon} ${name} (${slug})`);
  });
}

// Verificar si estamos en la raíz del proyecto
function checkProjectRoot() {
  const hasPublicFolder = fs.existsSync(path.join(process.cwd(), 'public'));
  const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
  
  if (!hasPublicFolder && hasPackageJson) {
    console.log('⚠️ La carpeta "public" no existe en la raíz del proyecto.');
    console.log('   Se creará automáticamente.\n');
  } else if (!hasPackageJson) {
    console.error('❌ Error: Este script debe ejecutarse desde la raíz del proyecto.');
    console.error('   Ejecuta: node scripts/categoriesData2.js');
    process.exit(1);
  }
}

// === EJECUCIÓN ===
console.log('\n🚀 Iniciando creación de iconos para VideoCommerce');
console.log('='.repeat(60));

checkProjectRoot();

console.log(`📊 Categorías a procesar: ${mainCategories.length}\n`);

showFinalOrder(mainCategories);
console.log('\n' + '='.repeat(60));

const stats = createCategoryIcons(basePath, mainCategories);

console.log('='.repeat(60));
console.log('📊 RESUMEN:');
console.log(`   • ${stats.totalCategories} carpetas/iconos procesados`);
console.log(`   • ${stats.totalIcons} iconos creados (placeholders PNG válidos)`);
console.log(`   • Categorías especiales (alta prioridad): Tutorials (🎓) y Chaînes (📺)`);

createCategoriesConfig(mainCategories);
verifyStructure(basePath, mainCategories);

console.log('\n📂 ESTRUCTURA GENERADA:');
console.log('/public/categories/');
mainCategories.forEach(slug => {
  const priorityIcon = categoryPriority[slug] === 'high' ? '🔥' : '  ';
  console.log(`${priorityIcon} ├── ${slug}/`);
  console.log(`      └── ${slug}.png`);
});

console.log('\n✅ PROCESO COMPLETADO\n');
console.log('📝 NOTA: Los iconos son placeholders PNG de 1x1 píxel.');
console.log('💡 Reemplázalos con tus iconos reales (formato PNG, recomendado 32x32 o 64x64).');
console.log('\n🚀 Ejecuta este script con:');
console.log('   cd /ruta/del/proyecto');
console.log('   node scripts/categoriesData2.js');