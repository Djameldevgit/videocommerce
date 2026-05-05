// 📂 routes/categoryRoutes.js - VERSIÓN ACTUALIZADA PARA VideoCommerce
const express = require('express');
const router = express.Router();

const {
  getCategoriesForSlider,        // 🔥 Nuevo nombre: obtenerCategoriasParaSlider → getCategoriesForSlider
  getMainCategories,              // 🔥 Nuevo nombre: obtenerCategoriasPrincipales → getMainCategories
  getCategoryById,                // 🔥 Nuevo nombre: obtenerCategoriaPorId → getCategoryById
  getVideosByCategory,            // 🔥 Nuevo: reemplaza getPostsByCategory
  getPopularCategories,           // 🔥 Nuevo: categorías populares
  getCategoryStats,               // 🔥 Nuevo nombre: obtenerEstadisticasDeCategorias → getCategoryStats
  searchCategories,               // 🔥 Nuevo nombre: buscarCategorias → searchCategories
  getCategoryFilters,             // 🔥 Nuevo: filtros para categoría
  updateVideoCounts               // 🔥 Nuevo: admin actualizar contadores
} = require('../controllers/categoryCtrl');  // 🔥 Atención: categoryController.js (no categoryCtrl.js)

// ============================================
// 1️⃣ RUTAS ESTÁTICAS (sin parámetros)
// ============================================
router.get('/slider', getCategoriesForSlider);           // Slider principal
router.get('/main', getMainCategories);                  // Lista paginada de categorías
router.get('/popular', getPopularCategories);            // Categorías más populares
router.get('/stats', getCategoryStats);                  // Estadísticas de categorías
router.get('/update-counts', updateVideoCounts);         // Admin: actualizar contadores

// ============================================
// 2️⃣ RUTAS CON QUERY PARAMS (búsqueda)
// ============================================
router.get('/search/:query', searchCategories);          // Buscar categorías

// ============================================
// 3️⃣ RUTAS CON PARÁMETROS (específicas)
// ============================================
router.get('/:slug/filters', getCategoryFilters);        // Obtener filtros de una categoría
router.get('/:slug/videos', getVideosByCategory);        // Videos por categoría (reemplaza posts)

// ============================================
// 4️⃣ RUTA COMODÍN (debe ir al final)
// ============================================
router.get('/:identifier', getCategoryById);             // Obtener categoría por ID o slug

module.exports = router;