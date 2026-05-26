// routes/chargilyPlanRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chargilyPlanCtrl = require('../controllers/chargilyPlanCtrl');

// ✅ Ruta para crear checkout (requiere autenticación)
router.post('/create-checkout', auth, chargilyPlanCtrl.createPlanCheckout);

// ✅ Webhook (NO requiere auth - Chargily lo llama)
router.post('/webhook', chargilyPlanCtrl.handlePlanWebhook);

// ✅ Verificar estado del plan del usuario
 
router.get('/check-plan-status', auth, chargilyPlanCtrl.checkPlanStatus);
module.exports = router;