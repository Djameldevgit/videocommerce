// node categoriesData2.js
// Crea carpetas y placeholders de iconos para TODAS las categorías (19 slugs exactos, ordenados)
const fs = require('fs');
const path = require('path');

// ✅ Ruta base - /public/categories/ (desde la raíz del proyecto)
const basePath = path.join(process.cwd(), 'public', 'categories');

console.log('📁 Ruta base calculada:', basePath);
console.log('📁 Directorio actual:', process.cwd());

// 📋 LISTA COMPLETA DE SLUGS - ORDEN CORRECTO (19 categorías)
const mainCategories = [
  'agence',
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
  'publicite',
  'art'                       // ← NUEVA CATEGORÍA
];

// Mapeo de slug a nombre legible
const categoryNames = {
  'agence': 'Agence',
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
  'publicite': 'Publicité',
  'art': 'Art'                // ← NUEVO
};

// Colores asociados a cada categoría
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
  'publicite': '#FF9800',
  'art': '#E91E63'            // ← NUEVO
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
    console.log(`${orderNumber}. 📂 Procesando: ${categoryNames[slug] || slug} (${slug})`);
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
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    totalCategories: slugs.length,
    categories: slugs.map((slug, index) => ({
      order: index + 1,
      slug: slug,
      name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      iconUrl: `/categories/${slug}/${slug}.png`,
      iconColor: categoryColors[slug] || '#666666',
      bgColor: `${categoryColors[slug] || '#666666'}15`,
      isActive: true
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
      console.log(`✅ ${slug}/ - OK`);
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
  console.log('\n📋 ORDEN FINAL DE CATEGORÍAS:');
  console.log('='.repeat(60));
  slugs.forEach((slug, index) => {
    const num = (index + 1).toString().padStart(2, ' ');
    console.log(`${num}. ${categoryNames[slug] || slug}`);
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

createCategoriesConfig(mainCategories);
verifyStructure(basePath, mainCategories);

console.log('\n📂 ESTRUCTURA GENERADA:');
console.log('/public/categories/');
mainCategories.forEach(slug => {
  console.log(`├── ${slug}/`);
  console.log(`│   └── ${slug}.png`);
});

console.log('\n✅ PROCESO COMPLETADO\n');
console.log('📝 NOTA: Los iconos son placeholders PNG de 1x1 píxel.');
console.log('💡 Reemplázalos con tus iconos reales (formato PNG, recomendado 32x32 o 64x64).');
console.log('\n🚀 Ejecuta este script con:');
console.log('   cd /ruta/del/proyecto');
console.log('   node scripts/categoriesData2.js');