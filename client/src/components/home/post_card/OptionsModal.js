// components/home/post_card/OptionsModal.js
import React from 'react';

const OptionsModal = ({ 
  show, 
  onClose, 
  innerRef, 
  isAdmin, 
  isPostOwner, 
  saved, 
  saveLoad, 
  t, 
  onOptionClick,
  onAprove,
  onChatWithAdmin
}) => {
  if (!show) return null;

  console.log("📍 OptionsModal está renderizándose, show:", show);

  return (
    <div
      ref={innerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={(e) => {
        // Cerrar solo si se hace click en el backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '8px 0',
          minWidth: '200px',
          maxWidth: '90%',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.2s ease'
        }}
      >
        {/* Opciones para el dueño del post */}
        {isPostOwner && (
          <>
            <button
              onClick={() => onOptionClick('edit')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>edit</span>
              {t('edit')}
            </button>
            
            <button
              onClick={() => onOptionClick('delete')}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                fontSize: '14px',
                color: '#e74c3c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-icons" style={{ fontSize: '18px' }}>delete</span>
              {t('delete')}
            </button>
          </>
        )}

        {/* Opciones para admin */}
        {isAdmin && !isPostOwner && (
          <button
            onClick={onAprove}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              color: '#27ae60',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>check_circle</span>
            {t('approve')}
          </button>
        )}

        {/* Opciones para todos los usuarios */}
        {!isPostOwner && (
          <button
            onClick={() => onOptionClick('contact')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              color: '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>message</span>
            {t('contactSeller')}
          </button>
        )}

        {/* Guardar/Desguardar */}
        <button
          onClick={() => onOptionClick('save')}
          disabled={saveLoad}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            fontSize: '14px',
            color: saved ? '#e74c3c' : '#333',
            cursor: saveLoad ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: saveLoad ? 0.6 : 1
          }}
          onMouseEnter={(e) => !saveLoad && (e.currentTarget.style.backgroundColor = '#f8f9fa')}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-icons" style={{ fontSize: '18px' }}>
            {saved ? 'bookmark_remove' : 'bookmark_add'}
          </span>
          {saved ? t('unsave') : t('save')}
        </button>

        {/* Compartir */}
        <button
          onClick={() => onOptionClick('share')}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            fontSize: '14px',
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-icons" style={{ fontSize: '18px' }}>share</span>
          {t('share')}
        </button>

        {/* Reportar (solo si no es el dueño) */}
        {!isPostOwner && (
          <button
            onClick={() => onOptionClick('report')}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              color: '#e74c3c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>flag</span>
            {t('report')}
          </button>
        )}

        {/* Chat con Admin (solo para usuarios no admin) */}
        {!isAdmin && (
          <button
            onClick={onChatWithAdmin}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'none',
              border: 'none',
              textAlign: 'left',
              fontSize: '14px',
              color: '#333',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-icons" style={{ fontSize: '18px' }}>admin_panel_settings</span>
            {t('chatWithAdmin')}
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px); 
            }
            to { 
              opacity: 1;
              transform: translateY(0); 
            }
          }
        `}
      </style>
    </div>
  );
};

export default OptionsModal;