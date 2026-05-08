// node categoriesData2.js
// Crea carpetas y placeholders de iconos para TODAS las categorías (21 slugs exactos)
const fs = require('fs');
const path = require('path');

// Ruta base - /public/categories/
const basePath = path.join(__dirname, 'public', 'categories');

// 📋 LISTA COMPLETA DE SLUGS (tal cual vienen de MongoDB)
const mainCategories = [
  'agence',
  'alimentaires',
  'art',
  'boutiques',
  'electromenager',
  'electronique',
  'emploi',
  'immobilier',
  'informatique',
  'loisirs-divertissements',
  'materiaux-equipement',
  'meubles-maison',
  'pieces-detachees',
  'publicite',
  'sante-beaute',
  'services',
  'sport',
  'telephones',
  'vehicules',
  'vetements-mode',
  'voyages'
];

// Mapeo de slug a nombre legible (igual que en MongoDB)
const categoryNames = {
  'agence': 'Agence',
  'alimentaires': 'Alimentaires',
  'art': 'Art',
  'boutiques': 'Boutiques',
  'electromenager': 'Électroménager',
  'electronique': 'Électronique',
  'emploi': 'Emploi',
  'immobilier': 'Immobilier',
  'informatique': 'Informatique',
  'loisirs-divertissements': 'Loisirs & Divertissements',
  'materiaux-equipement': 'Matériaux & Équipement',
  'meubles-maison': 'Meubles & Maison',
  'pieces-detachees': 'Pièces détachées',
  'publicite': 'Publicité',
  'sante-beaute': 'Santé & Beauté',
  'services': 'Services',
  'sport': 'Sport',
  'telephones': 'Téléphones',
  'vehicules': 'Véhicules',
  'vetements-mode': 'Vêtements & Mode',
  'voyages': 'Voyages'
};

// Función para crear carpetas y placeholders
function createCategoryIcons(basePath, slugs) {
  console.log('📁 Creando estructura en:', basePath);
  console.log('='.repeat(50));

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Creada carpeta base: ${basePath}\n`);
  }

  let totalIcons = 0;

  for (const slug of slugs) {
    console.log(`📂 Procesando: ${slug}`);
    const categoryPath = path.join(basePath, slug);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`  ✅ Creada carpeta: ${slug}/`);
    }

    const iconFile = `${slug}.png`;
    const iconPath = path.join(categoryPath, iconFile);
    if (!fs.existsSync(iconPath)) {
      fs.writeFileSync(iconPath, '');
      console.log(`  🖼️  Icono creado: ${slug}/${iconFile}`);
      totalIcons++;
    } else {
      console.log(`  ⏭️  Icono ya existe: ${slug}/${iconFile}`);
    }
    console.log('');
  }

  return { totalIcons, totalCategories: slugs.length };
}

// Generar categories-config.json con nombres legibles
function createCategoriesConfig(slugs) {
  const configPath = path.join(basePath, 'categories-config.json');
  const config = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalCategories: slugs.length,
    categories: slugs.map(slug => ({
      slug: slug,
      name: categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
      iconUrl: `/categories/${slug}/${slug}.png`,
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
  console.log('='.repeat(50));
  let errors = [];
  for (const slug of slugs) {
    const iconPath = path.join(basePath, slug, `${slug}.png`);
    if (!fs.existsSync(iconPath)) {
      errors.push(`❌ Icono faltante: ${slug}/${slug}.png`);
    } else {
      console.log(`✅ OK: ${slug}/`);
    }
  }
  if (errors.length) {
    console.log('\n⚠️  Errores:');
    errors.forEach(e => console.log(e));
  } else {
    console.log('\n✨ ¡Todas las categorías están correctas!');
  }
  return errors.length === 0;
}

// === EJECUCIÓN ===
console.log('🚀 Iniciando creación de iconos para VideoCommerce');
console.log(`📊 Categorías a procesar: ${mainCategories.length}\n`);

const stats = createCategoryIcons(basePath, mainCategories);
console.log('='.repeat(50));
console.log('📊 RESUMEN:');
console.log(`   • ${stats.totalCategories} carpetas/iconos procesados`);
console.log(`   • ${stats.totalIcons} iconos creados (placeholders)`);

createCategoriesConfig(mainCategories);
verifyStructure(basePath, mainCategories);

console.log('\n📂 ESTRUCTURA GENERADA:');
console.log('/public/categories/');
mainCategories.forEach(slug => {
  console.log(`├── ${slug}/`);
  console.log(`│   └── ${slug}.png`);
});

console.log('\n✅ PROCESO COMPLETADO\n');
console.log('📝 NOTA: Los iconos son placeholders vacíos. Reemplázalos con tus PNG reales.');
console.log('💡 Ejecuta este script con: node categoriesData2.js');