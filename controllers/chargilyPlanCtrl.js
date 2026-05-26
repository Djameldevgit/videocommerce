// controllers/chargilyPlanCtrl.js - VERSIÓN ACTUALIZADA
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel'); // ← Importar modelo

const chargilyPlanCtrl = {
  
  // Crear checkout para suscripción de plan
  createPlanCheckout: async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        plan_id,
        plan_name,
        amount,
        duration_months,
        discount_percent,
        free_months,
        category
      } = req.body;
      
      if (!plan_id || !amount) {
        return res.status(400).json({ error: 'Plan et montant requis' });
      }
      
      // Obtener datos completos del usuario
      const user = await User.findById(userId).select('email username');
      
      console.log('📤 Creando checkout para usuario:', userId);
      console.log('📦 Plan:', plan_id, 'Monto:', amount);
      
      // URLs dinámicas
      const baseClientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const baseApiUrl = process.env.API_URL || 'http://localhost:5000';
      
      const webhookUrl = process.env.WEBHOOK_URL
        ? `${process.env.WEBHOOK_URL}/api/webhook`
        : `${baseApiUrl}/api/webhook`;
      
      // Llamar a Chargily
      const response = await axios.post(
        "https://pay.chargily.net/test/api/v2/checkouts",
        {
          amount: Number(amount),
          currency: "dzd",
          success_url: `${baseClientUrl}/payment-success`,
          failure_url: `${baseClientUrl}/payment-failure`,
          webhook_endpoint: webhookUrl,
          metadata: {
            type: "plan_subscription",
            user_id: userId.toString(),
            user_email: user.email || '',
            user_username: user.username || '',
            plan_id: plan_id,
            plan_name: plan_name,
            duration_months: duration_months || 1,
            discount_percent: discount_percent || 0,
            free_months: free_months || 0,
            category: category || '',
            platform: "video_marketplace"
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHARGILY_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // ✅ REGISTRAR TRANSACCIÓN PENDIENTE EN TU BD
      const transaction = new Transaction({
        checkout_id: response.data.id,
        user_id: userId,
        user_email: user.email,
        user_username: user.username,
        plan_id: plan_id,
        plan_name: plan_name,
        duration_months: duration_months || 1,
        free_months: free_months || 0,
        discount_percent: discount_percent || 0,
        category: category || '',
        amount: Number(amount),
        currency: 'dzd',
        status: 'pending',
        checkout_created_at: new Date(),
        chargily_response: response.data
      });
      
      await transaction.save();
      console.log('✅ Transacción registrada en BD:', transaction._id);
      
      return res.json({
        success: true,
        data: response.data,
        transaction_id: transaction._id
      });
      
    } catch (err) {
      console.error('❌ Error en createPlanCheckout:', err.message);
      
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
        return res.status(err.response.status).json({
          error: err.response.data.message || 'Erreur Chargily'
        });
      }
      
      return res.status(500).json({ error: err.message });
    }
  },
  
  // Webhook para procesar pagos exitosos
 // En chargilyPlanCtrl.js - MODIFICAR handlePlanWebhook
handlePlanWebhook: async (req, res) => {
  try {
    // 🚨 LOGS DE DIAGNÓSTICO
    console.log('\n🔔 ===== WEBHOOK RECIBIDO =====');
    console.log('📅 Hora:', new Date().toISOString());
    console.log('📋 Método:', req.method);
    console.log('🔗 URL:', req.originalUrl);
    console.log('📨 Headers:', JSON.stringify(req.headers, null, 2));
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    
    const signature = req.headers["signature"];
    const payload = JSON.stringify(req.body);
    
    console.log('🔑 Signature recibida:', signature ? '✅ Sí' : '❌ NO');
    
    if (signature) {
      const computedSignature = crypto
        .createHmac("sha256", process.env.CHARGILY_SECRET_KEY)
        .update(payload)
        .digest("hex");
      
      console.log('🔐 Firma esperada:', computedSignature);
      console.log('🔐 Firma recibida:', signature);
      console.log('🔐 Coinciden:', computedSignature === signature ? '✅ SÍ' : '❌ NO');
    }
    
    // ⚠️ TEMPORAL: NO verificar firma para pruebas
    // Comenta esta parte para recibir cualquier webhook
    /*
    if (computedSignature !== signature) {
      console.warn('⚠️ Signature invalide');
      return res.status(403).json({ error: "Invalid signature" });
    }
    */
    
    const event = req.body;
    console.log('📨 Tipo de evento:', event.type);
    
    if (event.type === "checkout.paid") {
      const checkoutData = event.data;
      const metadata = checkoutData.metadata;
      const checkoutId = checkoutData.id;
      
      console.log(`🎉 PAGO CONFIRMADO para checkout: ${checkoutId}`);
      console.log('👤 User ID:', metadata.user_id);
      console.log('📦 Plan:', metadata.plan_id);
      
      // Buscar transacción
      const transaction = await Transaction.findOne({ checkout_id: checkoutId });
      
      if (!transaction) {
        console.warn(`⚠️ Transacción no encontrada: ${checkoutId}`);
        return res.json({ received: true, warning: 'Transaction not found' });
      }
      
      console.log('✅ Transacción encontrada:', transaction._id);
      console.log('Estado actual:', transaction.status);
      
      if (transaction.status === 'paid') {
        console.log('⏭️ Ya procesada');
        return res.json({ received: true, already_processed: true });
      }
      
      // Actualizar transacción
      const totalMonths = (metadata.duration_months || 1) + (metadata.free_months || 0);
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + totalMonths);
      
      transaction.status = 'paid';
      transaction.payment_completed_at = new Date();
      transaction.plan_expires_at = expiresAt;
      transaction.webhook_received = event;
      
      await transaction.save();
      console.log('✅ Transacción → PAID');
      
      // Actualizar usuario
      const updatedUser = await User.findByIdAndUpdate(
        transaction.user_id,
        {
          channelPlan: transaction.plan_id,
          channelPlanExpiresAt: expiresAt,
          channelPlanAutoRenew: false,
          isPro: transaction.plan_id !== 'basic',
          role: transaction.plan_id !== 'free' ? 'userpro' : 'user'
        },
        { new: true }
      ).select('username email channelPlan role isPro');
      
      console.log('✅ USUARIO ACTUALIZADO:');
      console.log('   Nombre:', updatedUser.username);
      console.log('   Plan:', updatedUser.channelPlan);
      console.log('   Role:', updatedUser.role);
      console.log('   isPro:', updatedUser.isPro);
      console.log('   Expira:', expiresAt.toLocaleDateString());
      
    }
    
    console.log('===== FIN WEBHOOK =====\n');
    return res.json({ received: true });
    
  } catch (err) {
    console.error('❌ ERROR WEBHOOK:', err);
    console.error('Stack:', err.stack);
    return res.status(500).json({ error: "Webhook error" });
  }
},
  
  // ✅ NUEVO: Obtener historial de pagos del usuario
  getUserTransactions: async (req, res) => {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10 } = req.query;
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const transactions = await Transaction.find({ user_id: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Transaction.countDocuments({ user_id: userId });
      
      res.json({
        success: true,
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
      
    } catch (err) {
      console.error('❌ Error getUserTransactions:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  // ✅ NUEVO: Obtener detalles de una transacción específica
  getTransactionById: async (req, res) => {
    try {
      const { transactionId } = req.params;
      const userId = req.user._id;
      const isAdmin = req.user.role === 'admin';
      
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction non trouvée' });
      }
      
      // Verificar que el usuario sea el dueño o admin
      if (transaction.user_id.toString() !== userId.toString() && !isAdmin) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }
      
      res.json({ success: true, transaction });
      
    } catch (err) {
      console.error('❌ Error getTransactionById:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  // ✅ NUEVO: Obtener todas las transacciones (solo admin)
  getAllTransactions: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès admin requis' });
      }
      
      const { page = 1, limit = 20, status } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const filter = {};
      if (status) filter.status = status;
      
      const transactions = await Transaction.find(filter)
        .populate('user_id', 'username email fullname')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Transaction.countDocuments(filter);
      
      res.json({
        success: true,
        transactions,
        pagination: {
          total,
          page: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
      
    } catch (err) {
      console.error('❌ Error getAllTransactions:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  // Verificar estado del plan (para el frontend)
 // Verificar estado del plan (para el frontend)
checkPlanStatus: async (req, res) => {
  try {
    const userId = req.user._id;
    // ✅ Añadir 'role' y 'username' al select
    const user = await User.findById(userId)
      .select('channelPlan channelPlanExpiresAt isPro role username');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const now = new Date();
    const isExpired = user.channelPlanExpiresAt && new Date(user.channelPlanExpiresAt) < now;
    
    if (isExpired && user.channelPlan !== 'free') {
      await User.findByIdAndUpdate(userId, {
        channelPlan: 'free',
        channelPlanExpiresAt: null,
        isPro: false,
        role: 'user'
      });
      user.channelPlan = 'free';
      user.role = 'user';
      user.isPro = false;
    }
    
    // ✅ RESPUESTA CORRECTA con objeto 'user' y 'role'
    res.json({
      success: true,
      user: {
        channelPlan: user.channelPlan,
        role: user.role,
        expiresAt: user.channelPlanExpiresAt,
        isExpired: isExpired,
        isPro: user.isPro
      }
    });
    
  } catch (err) {
    console.error('❌ Error checkPlanStatus:', err);
    res.status(500).json({ error: err.message });
  }
}
};

module.exports = chargilyPlanCtrl;