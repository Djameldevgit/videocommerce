// 📂 components/ProductCardHorizontal.jsx - CORREGIDO

import React, { useState } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FaStore, FaEye } from 'react-icons/fa';
import moment from 'moment';

const ProductCardHorizontal = ({ product }) => {
  const history = useHistory();
  const [imageError, setImageError] = useState(false);
  
  if (!product) {
    return null;
  }
  
  // 🔥 FUNCIÓN PARA OBTENER LA URL CORRECTA DE LA IMAGEN
  const getFirstImage = () => {
    if (!product.images || product.images.length === 0) return null;
    
    const firstImage = product.images[0];
    
    // Si es string
    if (typeof firstImage === 'string') {
      return firstImage;
    }
    
    // Si es objeto con url
    if (typeof firstImage === 'object' && firstImage.url) {
      return firstImage.url;
    }
    
    return null;
  };

  const imageUrl = getFirstImage();
  const themeColor = product.boutique?.couleur_theme || '#6366F1';
  const boutiqueName = product.boutique?.nom_boutique || 'Boutique';

  const handleClick = () => {
    history.push(`/product/${product._id}`);
  };

  return (
    <Card 
      className="border-0 shadow-sm h-100 overflow-hidden"
      style={{ 
        borderRadius: '12px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      <div className="d-flex">
        {/* Imagen */}
        <div style={{ width: '100px', minWidth: '100px', position: 'relative' }}>
          <div style={{ 
            position: 'relative', 
            paddingTop: '100%', 
            overflow: 'hidden', 
            backgroundColor: '#f5f5f5',
            borderRadius: '8px 0 0 8px'
          }}>
            {imageUrl && !imageError ? (
              <img 
                src={imageUrl} 
                alt={product.title}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📦
              </div>
            )}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="flex-grow-1 p-2">
          <h6 className="mb-1" style={{ 
            fontSize: '0.85rem', 
            fontWeight: '600',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.3',
            color: '#1e293b'
          }}>
            {product.title || 'Sans titre'}
          </h6>
          
          <div className="fw-bold mb-1" style={{ fontSize: '0.8rem', color: themeColor }}>
            {product.price?.toLocaleString()} DA
          </div>
          
          <div className="d-flex align-items-center gap-2 mb-1">
            <Badge 
              style={{ backgroundColor: themeColor }} 
              className="px-2 py-0 rounded-pill"
            >
              <FaStore size={8} className="me-1" />
              {boutiqueName.length > 15 ? boutiqueName.substring(0, 15) + '...' : boutiqueName}
            </Badge>
          </div>
          
          <div className="text-muted" style={{ fontSize: '0.65rem' }}>
            <FaEye size={10} className="me-1" />
            {product.views || 0} vues
          </div>
          
          {product.createdAt && (
            <div className="text-muted mt-1" style={{ fontSize: '0.6rem' }}>
              {moment(product.createdAt).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCardHorizontal;