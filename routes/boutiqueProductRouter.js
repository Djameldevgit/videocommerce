// routes/boutiqueProductRoutes.js
const router = require('express').Router();
const boutiqueProductCtrl = require('../controllers/boutiqueProductCtrl');
const auth = require('../middleware/auth');

// ============================================
// 1️⃣ RUTAS ESTÁTICAS DE ADMIN (sin parámetros)
// ============================================
router.get('/admin/boutique-products/pendientes', auth, boutiqueProductCtrl.getProductsPendientes);
router.get('/admin/boutique-products/pendientes/count', auth, boutiqueProductCtrl.getProductsPendientesCount);

// ============================================
// 2️⃣ RUTAS DE ADMIN CON PARÁMETROS
// ============================================
router.put('/admin/boutique-products/aprobar/:id', auth, boutiqueProductCtrl.aprobarProducto);
router.delete('/admin/boutique-products/rechazar/:id', auth, boutiqueProductCtrl.rechazarProducto);

// ============================================
// 3️⃣ RUTAS PÚBLICAS DE PRODUCTOS (específicas)
// ============================================
router.get('/product/:productId', boutiqueProductCtrl.getProductById);
router.get('/product/:productId/same-boutique', boutiqueProductCtrl.getProductsFromSameBoutique);
router.get('/product/:productId/similar', boutiqueProductCtrl.getSimilarProducts);

// ============================================
// 4️⃣ RUTAS DE BOUTIQUE (productos por boutique)
// ============================================
router.get('/boutique/:boutiqueId/products', boutiqueProductCtrl.getBoutiqueProducts);

// ============================================
// 5️⃣ RUTAS CRUD (crear, actualizar, eliminar)
// ============================================
router.post('/boutique/:boutiqueId/products', auth, boutiqueProductCtrl.createBoutiqueProduct);
router.patch('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.updateBoutiqueProduct);
router.delete('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.deleteBoutiqueProduct);

// ============================================
// 6️⃣ RUTA ALTERNATIVA (por si se usa diferente)
// ============================================
router.get('/boutique/products/:productId', boutiqueProductCtrl.getProductById);

module.exports = router;