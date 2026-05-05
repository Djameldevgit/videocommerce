// node categoriesData2.js - VERSIÓN SIMPLIFICADA PARA VideoCommerce
// Script para crear carpetas organizadas por categoría principal en /public/categories/

const fs = require('fs');
const path = require('path');

// Ruta base - /public/categories/
const basePath = path.join(__dirname, 'public', 'categories');

// 📋 ESTRUCTURA SIMPLIFICADA - Solo categorías principales para VideoCommerce
// Cada categoría tendrá su propio icono en la carpeta correspondiente
const mainCategories = [
  'vehicules',
  'immobilier',
  'electromenager',
  'electronique',
  'vetements',
  'meubles',
  'sport',
  'sante-beaute',
  'alimentaires',
  'services',
  'loisirs',
  'pieces-detachees',
  'informatique',
  'materiaux',
  'voyages',
  'art'
];

// Función para crear carpetas y archivos simplificada
function createCategoryIcons(basePath, categories) {
  console.log('📁 Creando estructura de carpetas en:', basePath);
  console.log('='.repeat(50));
  
  // Crear carpeta base si no existe
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
    console.log(`✅ Creada carpeta base: ${basePath}\n`);
  }

  let totalIcons = 0;

  for (const category of categories) {
    console.log(`📂 Procesando categoría: ${category}`);
    
    // Crear carpeta de la categoría
    const categoryPath = path.join(basePath, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`  ✅ Creada carpeta: ${category}/`);
    }

    // Crear el archivo icono de la categoría (nivel 1)
    const iconFile = `${category}.png`;
    const iconPath = path.join(categoryPath, iconFile);
    
    if (!fs.existsSync(iconPath)) {
      // Crear archivo placeholder vacío
      fs.writeFileSync(iconPath, '');
      console.log(`  📄 Icono creado: ${category}/${iconFile}`);
      totalIcons++;
    } else {
      console.log(`  ⏭️  Icono ya existe: ${category}/${iconFile}`);
    }
    
    console.log(''); // línea en blanco para separar
  }

  return { totalIcons, totalCategories: categories.length };
}

// Función para crear archivo de configuración de categorías (opcional)
function createCategoriesConfig(categories) {
  const configPath = path.join(basePath, 'categories-config.json');
  
  const config = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    categories: categories.map(cat => ({
      slug: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
      iconPath: `/categories/${cat}/${cat}.png`,
      iconType: 'png',
      isActive: true
    }))
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`\n📋 Configuración guardada en: categories-config.json`);
  return config;
}

// Función para verificar la estructura creada
function verifyStructure(basePath, categories) {
  console.log('\n🔍 Verificando estructura creada:');
  console.log('='.repeat(50));
  
  let errors = [];
  
  for (const category of categories) {
    const categoryPath = path.join(basePath, category);
    const iconPath = path.join(categoryPath, `${category}.png`);
    
    if (!fs.existsSync(categoryPath)) {
      errors.push(`❌ Carpeta faltante: ${category}/`);
    } else if (!fs.existsSync(iconPath)) {
      errors.push(`❌ Icono faltante: ${category}/${category}.png`);
    } else {
      console.log(`✅ OK: ${category}/`);
    }
  }
  
  if (errors.length > 0) {
    console.log('\n⚠️  Errores encontrados:');
    errors.forEach(err => console.log(`  ${err}`));
  } else {
    console.log('\n✨ ¡Todas las categorías están correctamente configuradas!');
  }
  
  return errors.length === 0;
}

// Ejecutar script
console.log('🚀 Iniciando creación de estructura de iconos para VideoCommerce');
console.log('📂 Ruta base:', basePath);
console.log('='.repeat(50));
console.log(`📊 Categorías a procesar: ${mainCategories.length}\n`);

// Crear estructura de carpetas y archivos
const stats = createCategoryIcons(basePath, mainCategories);

console.log('='.repeat(50));
console.log('📊 RESUMEN FINAL:');
console.log(`   • ${stats.totalCategories} categorías principales procesadas`);
console.log(`   • ${stats.totalIcons} iconos creados`);
console.log(`   • Estructura: /public/categories/[categoría]/[categoría].png`);

// Crear archivo de configuración
const config = createCategoriesConfig(mainCategories);

// Verificar estructura
const isValid = verifyStructure(basePath, mainCategories);

console.log('\n' + '='.repeat(50));
console.log('📂 ESTRUCTURA CREADA:');
console.log('/public/categories/');
mainCategories.forEach(cat => {
  console.log(`├── ${cat}/`);
  console.log(`│   └── ${cat}.png (icono principal)`);
});

console.log('\n✅ PROCESO COMPLETADO');
console.log('\n📝 NOTAS IMPORTANTES:');
console.log('   • Los archivos creados son placeholders vacíos');
console.log('   • Reemplázalos con tus iconos PNG reales');
console.log('   • Los iconos deben ser cuadrados (recomendado: 64x64 o 128x128)');
console.log('   • Usa fondo transparente para mejor visualización');
console.log('\n💡 Para VideoCommerce:');
console.log('   • Cada categoría tiene su propio icono');
console.log('   • No hay subcategorías (level 2 y level 3 eliminados)');
console.log('   • Estructura plana y fácil de mantener');
console.log(`\n📄 Configuración guardada en: ${path.join(basePath, 'categories-config.json')}`);

// Opcional: Crear un archivo README con instrucciones
const readmePath = path.join(basePath, 'README.md');
const readmeContent = `# Iconos de Categorías - VideoCommerce

## Estructura
Esta carpeta contiene los iconos para las categorías principales de VideoCommerce.

## Formato
- Formato: PNG
- Tamaño recomendado: 128x128 píxeles
- Fondo: Transparente
- Estilo: Plano, moderno

## Categorías
${mainCategories.map(cat => `- ${cat}.png → ${cat}`).join('\n')}

## Uso
Los iconos se acceden mediante la URL: \`/categories/[categoría]/[categoría].png\`

Ejemplo: \`/categories/vehicules/vehicules.png\`

## Nota
Los archivos actuales son placeholders. Reemplázalos con los iconos reales.
`;

fs.writeFileSync(readmePath, readmeContent);
console.log(`📖 README creado: ${readmePath}`);