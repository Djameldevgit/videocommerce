// backend/services/chargilyService.js
const fetch = require('node-fetch');

const CHARGILY_SECRET_KEY = process.env.CHARGILY_SECRET_KEY;
const CHARGILY_BASE_URL = process.env.CHARGILY_BASE_URL;

const chargilyService = {
  // Crear link de pago en Chargily
  createPaymentLink: async (paymentData) => {
    const { amount, planName, userId, orderId, successUrl, webhookUrl } = paymentData;
    
    console.log('🔵 Creando link de pago en Chargily...');
    console.log('Monto:', amount, 'DA');
    console.log('Plan:', planName);
    
    try {
      const response = await fetch(`${CHARGILY_BASE_URL}/payment-links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CHARGILY_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${planName} - ${orderId}`,
          amount: amount,
          currency: 'DZD',
          success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success`,
          webhook_url: webhookUrl || `${process.env.API_URL}/api/payments/webhook/chargily`,
          metadata: {
            userId: userId.toString(),
            orderId: orderId,
            plan: paymentData.planId
          }
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Error Chargily:', data);
        throw new Error(data.message || 'Error creating payment link');
      }
      
      console.log('✅ Link de pago creado:', data.checkout_url);
      
      return {
        checkout_url: data.checkout_url,
        id: data.id
      };
    } catch (error) {
      console.error('❌ Error en createPaymentLink:', error);
      throw error;
    }
  }
};

module.exports = chargilyService;