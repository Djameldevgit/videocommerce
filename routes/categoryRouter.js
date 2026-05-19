// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const {
  getCategoriesForSlider,        // Slider
  getMainCategories,              // Categorías principales
  getCategoryById,                // Obtener categoría por ID/slug
  getVideosByCategory,            // Videos por categoría
  getPopularCategories,           // Categorías populares
  getCategoryStats,               // Estadísticas
  searchCategories,               // Buscar categorías
  getCategoryFilters,             // Filtros
  updateVideoCounts,              // Actualizar contadores (admin)
  getCategoriesWithVideos         // Categorías con videos (Home)
} = require('../controllers/categoryCtrl');

// ============================================
// 1️⃣ RUTAS FIJAS (SIN PARÁMETROS)
// ============================================

// ✅ CORREGIDO: Quitar '/categories/' extra
router.get('/categories/slider', getCategoriesForSlider);           // Slider principal
router.get('/categories/with-videos', getCategoriesWithVideos);     // Categorías con videos (scroll home)
router.get('/categories/main', getMainCategories);                  // Lista paginada de categorías
router.get('/categories/popular', getPopularCategories);            // Categorías más populares
router.get('/categories/stats', getCategoryStats);                  // Estadísticas de categorías
router.get('/categories/update-counts', updateVideoCounts);         // Admin: actualizar contadores

// ============================================
// 2️⃣ RUTAS CON QUERY PARAMS (búsqueda)
// ============================================
router.get('/search/:query', searchCategories);          // Buscar categorías

// ============================================
// 3️⃣ RUTAS CON PARÁMETROS (específicas)
// ============================================
router.get('/:slug/filters', getCategoryFilters);        // Obtener filtros de una categoría
router.get('/:slug/videos', getVideosByCategory);        // Videos por categoría

// ============================================
// 4️⃣ RUTA COMODÍN (debe ir al final)
// ============================================
router.get('/:identifier', getCategoryById);             // Obtener categoría por ID o slug

module.exports = router;