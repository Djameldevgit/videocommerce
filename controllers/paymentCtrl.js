// backend/controllers/paymentCtrl.js
const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const chargilyService = require('../services/chargilyService');

// ============================================
// FUNCIONES EXISTENTES (CCP manual)
// ============================================

const paymentCtrl = {
  // Crear solicitud de pago manual (CCP)
 // backend/controllers/paymentCtrl.js
 createPaymentLink : async (req, res) => {
  try {
    console.log('🔵 [1] createPaymentLink iniciado');
    console.log('🔵 [2] req.user:', req.user);
    console.log('🔵 [3] req.body:', req.body);
    
    const { planId, planName, amount, duration, category, discount, freeMonths } = req.body;
    const userId = req.user._id || req.user.id;
    
    console.log('🔵 [4] Datos extraídos:', { planId, planName, amount, duration, userId });
    
    if (!userId) {
      console.error('❌ [5] userId no encontrado');
      return res.status(400).json({ error: 'Usuario no autenticado' });
    }
    
    const orderId = `ORD_${Date.now()}_${userId.toString().slice(-6)}`;
    console.log('🔵 [6] orderId:', orderId);
    
    // Crear registro de pago pendiente
    const payment = new Payment({
      orderId,
      userId,
      plan: planId,
      amount,
      duration,
      category,
      discount: discount || 0,
      freeMonths: freeMonths || 0,
      status: 'pending',
      paymentMethod: 'chargily'
    });
    
    console.log('🔵 [7] Guardando payment...');
    await payment.save();
    console.log('🔵 [8] Payment guardado:', payment._id);
    
    // Agregar referencia al usuario
    await User.findByIdAndUpdate(userId, {
      $push: { paymentHistory: payment._id }
    });
    console.log('🔵 [9] Referencia añadida al usuario');
    
    // Crear link en Chargily
    console.log('🔵 [10] Llamando a chargilyService...');
    const chargilyResponse = await chargilyService.createPaymentLink({
      amount,
      planName,
      userId: userId.toString(),
      orderId,
      planId,
      successUrl: `${process.env.FRONTEND_URL}/payment-success`,
      webhookUrl: `${process.env.API_URL}/api/payments/webhook/chargily`
    });
    
    console.log('🔵 [11] Respuesta de Chargily:', chargilyResponse);
    
    payment.chargilyCheckoutId = chargilyResponse.id;
    await payment.save();
    
    console.log('🔵 [12] Éxito! Enviando respuesta al frontend');
    
    res.json({
      success: true,
      checkout_url: chargilyResponse.checkout_url,
      orderId: payment.orderId
    });
    
  } catch (error) {
    console.error('❌ ERROR EN createPaymentLink:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
},

  // Obtener todas las solicitudes de pago del usuario
  getMyPaymentRequests: async (req, res) => {
    try {
      const userId = req.user._id;
      
      const payments = await Payment.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

      res.json({
        success: true,
        count: payments.length,
        payments
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Obtener solicitud de pago por ID
  getPaymentRequestById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const payment = await Payment.findOne({ _id: id, userId });

      if (!payment) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }

      res.json({ success: true, payment });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Cancelar solicitud de pago
  cancelPaymentRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const payment = await Payment.findOne({ _id: id, userId });

      if (!payment) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }

      if (payment.status !== 'pending_manual') {
        return res.status(400).json({ error: 'Solo se pueden cancelar solicitudes pendientes' });
      }

      payment.status = 'cancelled';
      await payment.save();

      res.json({ success: true, message: 'Solicitud cancelada' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // ============================================
  // FUNCIONES PARA CHARGILY PAY
  // ============================================

  // Crear link de pago en Chargily
  createPaymentLink: async (req, res) => {
    try {
      const { planId, planName, amount, duration, category, discount, freeMonths } = req.body;
      const userId = req.user._id;

      console.log('🔵 Creando pago en Chargily:', { userId, planId, amount });

      const orderId = `ORD_${Date.now()}_${userId.toString().slice(-6)}`;

      const payment = new Payment({
        orderId,
        userId,
        plan: planId,
        amount,
        duration,
        category,
        discount: discount || 0,
        freeMonths: freeMonths || 0,
        status: 'pending',
        paymentMethod: 'chargily'
      });

      await payment.save();

      await User.findByIdAndUpdate(userId, {
        $push: { paymentHistory: payment._id }
      });

      const chargilyResponse = await chargilyService.createPaymentLink({
        amount,
        planName,
        userId: userId.toString(),
        orderId,
        planId,
        successUrl: `${process.env.FRONTEND_URL}/payment-success`,
        webhookUrl: `${process.env.API_URL}/api/payments/webhook/chargily`
      });

      payment.chargilyCheckoutId = chargilyResponse.id;
      await payment.save();

      res.json({
        success: true,
        checkout_url: chargilyResponse.checkout_url,
        orderId: payment.orderId
      });

    } catch (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Activar plan gratuito
  activateFreePlan: async (req, res) => {
    try {
      const { planId, category, duration } = req.body;
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (user.channelPlan && user.channelPlan !== 'free' && user.channelPlanExpiresAt > new Date()) {
        return res.status(400).json({ error: 'Ya tienes un plan activo.' });
      }

      await User.findByIdAndUpdate(userId, {
        channelPlan: 'free',
        channelPlanExpiresAt: null,
        channelPlanAutoRenew: false,
        isPro: false,
        proExpiryDate: null,
        role: 'user'
      });

      const freeActivation = new Payment({
        orderId: `FREE_${Date.now()}_${userId.toString().slice(-6)}`,
        userId,
        plan: 'free',
        amount: 0,
        duration: duration || 0,
        category,
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: 'free'
      });
      await freeActivation.save();

      await User.findByIdAndUpdate(userId, {
        $push: { paymentHistory: freeActivation._id }
      });

      res.json({
        success: true,
        message: 'Plan gratuito activado correctamente',
        plan: 'free'
      });

    } catch (err) {
      console.error('❌ Error:', err);
      return res.status(500).json({ msg: err.message });
    }
  },

  // Verificar estado de un pago
  verifyPayment: async (req, res) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user._id;

      const payment = await Payment.findOne({ orderId: sessionId, userId });

      if (!payment) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      res.json({
        success: true,
        status: payment.status,
        paid: payment.status === 'paid',
        plan: payment.plan,
        amount: payment.amount,
        paidAt: payment.paidAt,
        duration: payment.duration
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Obtener historial de pagos
  getPaymentHistory: async (req, res) => {
    try {
      const userId = req.user._id;
      const limit = parseInt(req.query.limit) || 50;

      const payments = await Payment.find({ userId, status: 'paid' })
        .sort({ paidAt: -1 })
        .limit(limit);

      const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const currentPlan = await User.findById(userId).select('channelPlan channelPlanExpiresAt');

      res.json({
        success: true,
        stats: {
          totalPayments: payments.length,
          totalSpent: totalSpent,
          currentPlan: currentPlan.channelPlan || 'free',
          planExpiresAt: currentPlan.channelPlanExpiresAt
        },
        payments
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Webhook de Chargily
  chargilyWebhook: async (req, res) => {
    try {
      const { status, metadata, id } = req.body;

      console.log('🔔 Webhook recibido:', { status, metadata, id });

      if (status === 'paid') {
        const { orderId, userId, plan } = metadata;

        if (!orderId || !userId) {
          console.error('❌ Webhook incompleto');
          return res.sendStatus(400);
        }

        const payment = await Payment.findOneAndUpdate(
          { orderId },
          {
            status: 'paid',
            chargilyPaymentId: id,
            paidAt: new Date()
          },
          { new: true }
        );

        if (!payment) {
          console.error('❌ Pago no encontrado:', orderId);
          return res.status(404).json({ error: 'Payment not found' });
        }

        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + payment.duration);

        await User.findByIdAndUpdate(userId, {
          channelPlan: payment.plan,
          channelPlanExpiresAt: expiresAt,
          channelPlanAutoRenew: false,
          isPro: payment.plan !== 'basic',
          proExpiryDate: payment.plan !== 'basic' ? expiresAt : null,
          role: payment.plan === 'basic' ? 'userPro' :
                payment.plan === 'pro' ? 'userPro' :
                payment.plan === 'business' ? 'admin' : 'user'
        });

        console.log(`✅ Usuario ${userId} ahora tiene plan ${payment.plan}`);
      }

      res.sendStatus(200);

    } catch (err) {
      console.error('❌ Error webhook:', err);
      res.sendStatus(200);
    }
  },

  // Pagos pendientes (admin)
  getPendingPayments: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      const pendingPayments = await Payment.find({
        status: 'pending_manual',
        expiresAt: { $gt: new Date() }
      }).populate('userId', 'fullname email username').sort({ createdAt: 1 });

      res.json({
        success: true,
        count: pendingPayments.length,
        payments: pendingPayments
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Confirmar pago manual (admin)
  confirmManualPayment: async (req, res) => {
    try {
      const { id } = req.params;
      const { referenceCode, notes } = req.body;

      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      const payment = await Payment.findById(id);

      if (!payment) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      if (payment.status !== 'pending_manual') {
        return res.status(400).json({ error: 'Este pago ya fue procesado' });
      }

      if (referenceCode && payment.referenceCode !== referenceCode) {
        return res.status(400).json({ error: 'Código de referencia incorrecto' });
      }

      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.adminNotes = notes;
      payment.confirmedBy = req.user._id;
      await payment.save();

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + payment.duration);

      await User.findByIdAndUpdate(payment.userId, {
        channelPlan: payment.plan,
        channelPlanExpiresAt: expiresAt,
        isPro: payment.plan !== 'basic',
        proExpiryDate: payment.plan !== 'basic' ? expiresAt : null,
        role: payment.plan === 'basic' ? 'userPro' :
              payment.plan === 'pro' ? 'userPro' :
              payment.plan === 'business' ? 'admin' : 'user'
      });

      res.json({
        success: true,
        message: 'Pago confirmado y plan activado'
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = paymentCtrl;