// src/pages/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

const paymentSuccess = () => {
  const location = useLocation();
  const history = useHistory();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      
      // También buscar en localStorage
      const pending = localStorage.getItem('pendingPayment');
      const orderId = sessionId || (pending ? JSON.parse(pending).orderId : null);
      
      if (orderId) {
        try {
          const response = await paymentService.verifyPayment(orderId);
          if (response.paid) {
            setStatus('success');
            localStorage.removeItem('pendingPayment');
            // Redirigir al dashboard después de 3 segundos
            setTimeout(() => history.push('/dashboard'), 3000);
          } else {
            setStatus('pending');
          }
        } catch (error) {
          setStatus('failed');
        }
      } else {
        setStatus('failed');
      }
    };
    
    verifyPayment();
  }, [location, history]);

  return (
    <div className="payment-status-container">
      {status === 'verifying' && <h2>Verificando tu pago...</h2>}
      {status === 'success' && <h2>✅ ¡Pago exitoso! Tu plan ha sido activado.</h2>}
      {status === 'pending' && <h2>⏳ Tu pago está siendo procesado...</h2>}
      {status === 'failed' && <h2>❌ No pudimos verificar tu pago. Contacta a soporte.</h2>}
    </div>
  );
};

export default paymentSuccess;