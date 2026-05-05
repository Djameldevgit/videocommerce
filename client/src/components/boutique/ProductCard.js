// 📂 components/boutique/ProductCard.jsx

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaBox, FaCheckCircle, FaHourglassHalf, FaStore } from 'react-icons/fa';
import { Modal, Button, Spinner } from 'react-bootstrap';

const ProductCard = ({ product, boutiqueId, onDelete, themeColor = '#6366F1' }) => {
  const history = useHistory();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

 // En MesProductsBoutiques.jsx - dentro de CompactProductCard
const getFirstImage = () => {
  console.log('🔍 Producto:', product._id, product.title);
  console.log('📦 images:', product.images);
  
  if (!product.images || product.images.length === 0) {
    console.log('❌ No hay imágenes');
    return null;
  }
  
  const firstImage = product.images[0];
  console.log('🖼️ Primera imagen:', firstImage);
  
  if (typeof firstImage === 'string') {
    console.log('✅ Es string:', firstImage);
    return firstImage;
  }
  
  if (typeof firstImage === 'object' && firstImage.url) {
    console.log('✅ Es objeto con url:', firstImage.url);
    return firstImage.url;
  }
  
  console.log('❌ Formato no reconocido');
  return null;
};
  const imageUrl = getFirstImage();
  const isActive = product.isActive !== false;
  const isPending = product.pendiente === true;

  const handleEdit = (e) => {
    e.stopPropagation();
    history.push(`/boutique/${boutiqueId}/products/edit/${product._id}`);
  };

  const handleView = (e) => {
    e.stopPropagation();
    history.push(`/product/${product._id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(product._id);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div 
        className="product-management-card"
        style={{
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={handleView}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        {/* Imagen */}
        <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: '#f5f5f5' }}>
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${themeColor}10`
            }}>
              <FaBox size={48} color={themeColor} />
            </div>
          )}

          {/* Badge de estado */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            {isPending ? (
              <span style={{
                background: '#f59e0b',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaHourglassHalf size={10} /> En attente
              </span>
            ) : isActive ? (
              <span style={{
                background: '#10b981',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaCheckCircle size={10} /> Actif
              </span>
            ) : (
              <span style={{
                background: '#6b7280',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '600'
              }}>
                Inactif
              </span>
            )}
          </div>

          {/* Precio */}
          <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
            <span style={{
              background: themeColor,
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {product.price?.toLocaleString()} DA
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '16px', flex: 1 }}>
          <h4 style={{
            fontSize: '1rem',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: '#1e293b',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.title}
          </h4>

          {product.description && (
            <p style={{
              fontSize: '0.8rem',
              color: '#64748b',
              margin: '0 0 12px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4'
            }}>
              {product.description}
            </p>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', color: '#94a3b8' }}>
              <FaEye size={12} />
              <span>{product.views || 0} vues</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleEdit}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FaEdit size={12} /> Modifier
              </button>
              <button
                onClick={handleDeleteClick}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <FaTrash size={12} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{product.title}</strong> ?</p>
          <p className="text-danger small">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" className="me-1" /> : null}
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;