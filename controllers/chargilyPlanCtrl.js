// controllers/chargilyPlanCtrl.js
const axios = require('axios');
const crypto = require('crypto');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

const chargilyPlanCtrl = {
  
  // Crear checkout para suscripción de plan
  createPlanCheckout: async (req, res) => {
    try {
      const userId = req.user._id;
      const { plan_id, plan_name, amount, duration_months, discount_percent, free_months, category } = req.body;
      
      if (!plan_id || !amount) {
        return res.status(400).json({ error: 'Plan et montant requis' });
      }
      
      const user = await User.findById(userId).select('email username');
      
      console.log('📤 Creando checkout para usuario:', userId);
      console.log('📦 Plan:', plan_id, 'Monto:', amount);
      
      const baseClientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
      const baseApiUrl = process.env.API_URL || 'http://localhost:5000';
      
      // ✅ CORREGIDO: /api/webhook
      const webhookUrl = process.env.WEBHOOK_URL
        ? `${process.env.WEBHOOK_URL}/api/webhook`
        : `${baseApiUrl}/api/webhook`;
      
      console.log('📡 Webhook URL:', webhookUrl);
      
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
  handlePlanWebhook: async (req, res) => {
    try {
      console.log('\n🔔 ===== WEBHOOK RECIBIDO =====');
      console.log('📅 Hora:', new Date().toISOString());
      console.log('📦 Body:', JSON.stringify(req.body, null, 2));
      
      const signature = req.headers["signature"];
      const payload = JSON.stringify(req.body);
      
      // ✅ VERIFICACIÓN DE FIRMA ACTIVADA
      if (signature) {
        const computedSignature = crypto
          .createHmac("sha256", process.env.CHARGILY_SECRET_KEY)
          .update(payload)
          .digest("hex");
        
        if (computedSignature !== signature) {
          console.warn('⚠️ Firma inválida - RECHAZADO');
          return res.status(403).json({ error: "Invalid signature" });
        }
        console.log('🔐 Firma verificada ✅');
      }
      
      const event = req.body;
      console.log('📨 Tipo de evento:', event.type);
      
      if (event.type === "checkout.paid") {
        const checkoutData = event.data;
        const metadata = checkoutData.metadata;
        const checkoutId = checkoutData.id;
        
        console.log(`🎉 PAGO CONFIRMADO: ${checkoutId}`);
        console.log('👤 User ID:', metadata.user_id);
        console.log('📦 Plan:', metadata.plan_id);
        
        const transaction = await Transaction.findOne({ checkout_id: checkoutId });
        
        if (!transaction) {
          console.warn(`⚠️ Transacción no encontrada: ${checkoutId}`);
          return res.json({ received: true, warning: 'Transaction not found' });
        }
        
        if (transaction.status === 'paid') {
          console.log('⏭️ Ya procesada');
          return res.json({ received: true });
        }
        
        const totalMonths = (metadata.duration_months || 1) + (metadata.free_months || 0);
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + totalMonths);
        
        transaction.status = 'paid';
        transaction.payment_completed_at = new Date();
        transaction.plan_expires_at = expiresAt;
        transaction.webhook_received = event;
        await transaction.save();
        console.log('✅ Transacción → PAID');
        
        // ✅ ACTUALIZAR USUARIO
        const updatedUser = await User.findByIdAndUpdate(
          transaction.user_id,
          {
            channelPlan: transaction.plan_id,
            channelPlanExpiresAt: expiresAt,
            channelPlanAutoRenew: false,
            isPro: transaction.plan_id !== 'basic',
            role: 'userpro'
          },
          { new: true }
        ).select('username email channelPlan role isPro');
        
        console.log('✅ USUARIO ACTUALIZADO:');
        console.log('   Nombre:', updatedUser.username);
        console.log('   Plan:', updatedUser.channelPlan);
        console.log('   Role:', updatedUser.role);
        console.log('   isPro:', updatedUser.isPro);
      }
      
      console.log('===== FIN WEBHOOK =====\n');
      return res.json({ received: true });
      
    } catch (err) {
      console.error('❌ ERROR WEBHOOK:', err);
      return res.status(500).json({ error: "Webhook error" });
    }
  },
  
  // Verificar estado del plan
  checkPlanStatus: async (req, res) => {
    try {
      const userId = req.user._id;
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
  },

  // Historial de transacciones del usuario
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
        pagination: { total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) }
      });
    } catch (err) {
      console.error('❌ Error getUserTransactions:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = chargilyPlanCtrl;