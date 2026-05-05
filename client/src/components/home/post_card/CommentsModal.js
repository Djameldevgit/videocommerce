// components/home/post_card/CommentsModal.js
import React from 'react';
import { Modal } from 'react-bootstrap';
import Comments from '../Comments';
import InputComment from '../InputComment';

// ✅ CSS integrado - SOLO para el modal
const modalStyles = `
  .comments-modal {
    margin: 0 !important;
    max-width: 100% !important;
  }

  .comments-modal .modal-content {
    border-radius: 0 !important;
    border: none !important;
    height: 100vh !important;
    min-height: 100vh !important;
  }

  /* Para tablets y desktop - Modal centrado */
  @media (min-width: 768px) {
    .comments-modal {
      max-width: 500px !important;
      margin: auto !important;
    }
    
    .comments-modal .modal-content {
      height: 80vh !important;
      min-height: auto !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
    }
  }

  /* Asegurar que el modal ocupe toda la pantalla en móviles */
  @media (max-width: 767px) {
    .comments-modal .modal-dialog {
      margin: 0 !important;
      max-width: 100% !important;
      height: 100vh !important;
    }
    
    .comments-modal .modal-content {
      border-radius: 0 !important;
    }
  }
`;

const ModalStyles = () => (
  <style>
    {modalStyles}
  </style>
);

const CommentsModal = ({ 
  show, 
  onHide, 
  post, 
  t = (key) => key 
}) => {
  const commentsCount = post.comments?.length || 0;

  return (
    <>
      <ModalStyles />
      
      <Modal
        show={show}
        onHide={onHide}
        centered
        fullscreen
        dialogClassName="comments-modal"
        contentClassName="border-0 rounded-0"
        style={{ zIndex: 10000 }}
      >
        {/* ✅ Header SIN padding extra */}
        <Modal.Header 
          className="border-bottom p-0" // ✅ padding: 0
          style={{
            background: '#f8f9fa',
            borderColor: '#e0e0e0',
            position: 'relative',
            minHeight: '50px' // ✅ Altura mínima para el header
          }}
        >
          <Modal.Title 
            className="w-100 text-center"
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: 0,
              padding: '12px 40px 12px 16px', // ✅ Solo padding necesario para el título
              lineHeight: '1.2'
            }}
          >
            {t('comments') || 'Comentarios'} 
            <span 
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#666',
                marginLeft: '8px'
              }}
            >
              ({commentsCount})
            </span>
          </Modal.Title>
          
          {/* ✅ Botón cerrar */}
          <button 
            onClick={onHide}
            className="border-0 bg-transparent position-absolute"
            style={{
              right: '8px', // ✅ Menos espacio
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '24px',
              color: '#666',
              padding: '2px', // ✅ Menos padding
              borderRadius: '50%',
              width: '28px', // ✅ Más compacto
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              zIndex: 1
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.1)';
              e.target.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#666';
            }}
          >
            ×
          </button>
        </Modal.Header>

        {/* ✅ Cuerpo del modal - SIN PADDING */}
        <Modal.Body 
          className="p-0 d-flex flex-column" // ✅ padding: 0
          style={{
            background: '#ffffff',
            flex: '1' // ✅ Ocupa todo el espacio disponible
          }}
        >
          {/* ✅ Sección de comentarios - SIN estilos extra */}
          <div className="flex-grow-1">
            <Comments post={post} /> {/* ✅ Se renderiza con sus estilos originales */}
          </div>
          
          {/* ✅ Input de comentarios - SIN padding extra */}
          <div 
            style={{
              borderTop: '1px solid #e0e0e0',
              background: '#f8f9fa'
              // ✅ SIN padding - InputComment tiene sus propios estilos
            }}
          >
            <InputComment post={post} /> {/* ✅ Se renderiza con sus estilos originales */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommentsModal;