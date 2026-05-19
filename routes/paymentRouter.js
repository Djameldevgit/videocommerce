// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentCtrl');
const auth = require('../middleware/auth');

// ============================================
// RUTA PRINCIPAL - Debe coincidir con la llamada
// ============================================
router.post('/payments/create-link', auth, paymentCtrl.createPaymentLink);
router.post('/payments/activate-free', auth, paymentCtrl.activateFreePlan);
router.get('/payments/verify/:sessionId', auth, paymentCtrl.verifyPayment);
router.get('/payments/history', auth, paymentCtrl.getPaymentHistory);

// Webhook público (sin auth)
router.post('/payments/webhook/chargily', paymentCtrl.chargilyWebhook);

module.exports = router;