// backend/services/chargilyService.js
const fetch = require('node-fetch');

// ✅ Estas variables se leen del archivo backend/.env
const CHARGILY_SECRET_KEY = process.env.CHARGILY_SECRET_KEY;
const CHARGILY_BASE_URL = process.env.CHARGILY_BASE_URL || 'https://pay.chargily.net/api/v2';

console.log('🔑 Chargily Secret Key existe:', !!CHARGILY_SECRET_KEY);
console.log('🌐 Chargily Base URL:', CHARGILY_BASE_URL);

const chargilyService = {
  createPaymentLink: async (paymentData) => {
    const { amount, planName, orderId, successUrl } = paymentData;
    
    // Verificar que la key existe
    if (!CHARGILY_SECRET_KEY) {
      throw new Error('❌ CHARGILY_SECRET_KEY no está definida en el archivo .env del backend');
    }
    
    const requestBody = {
      items: [
        {
          title: planName,
          amount: amount,
          quantity: 1
        }
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL}/payment-success`,
    };
    
    console.log('📦 Enviando a Chargily:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${CHARGILY_BASE_URL}/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHARGILY_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error Chargily:', data);
      throw new Error(data.message || JSON.stringify(data.errors));
    }
    
    console.log('✅ Link creado:', data.checkout_url);
    
    return {
      checkout_url: data.checkout_url,
      id: data.id
    };
  }
};

module.exports = chargilyService;