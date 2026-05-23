// src/pages/PaymentSuccess.js (mejorado)
import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/dashboard';
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
      }}>
        <FaCheckCircle style={{ fontSize: '80px', color: '#28a745', marginBottom: '20px' }} />
        <h1 style={{ color: '#28a745', marginBottom: '10px' }}>¡Pago Exitoso!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Tu plan ha sido activado correctamente
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0 }}>
            Redirigiendo al dashboard en <strong>{countdown}</strong> segundos...
          </p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Ir al Dashboard ahora
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;