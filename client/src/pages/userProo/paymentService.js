// src/services/paymentService.js
const API_BASE_URL = 'http://localhost:5000/api';

export const PaymentService = {
  createPaymentLink: async (paymentData, token) => {
    console.log('📡 Creando pago en:', `${API_BASE_URL}/payments/create-link`);
    
    const response = await fetch(`${API_BASE_URL}/payments/create-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error respuesta:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Respuesta:', data);
    return data;
  },

  activateFreePlan: async (planData, token) => {
    const response = await fetch(`${API_BASE_URL}/payments/activate-free`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(planData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.msg || 'Error al activar plan gratuito');
    }

    return await response.json();
  },

  verifyPayment: async (orderId, token) => {
    const response = await fetch(`${API_BASE_URL}/payments/verify/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.msg || 'Error al verificar el pago');
    }

    return await response.json();
  }
};