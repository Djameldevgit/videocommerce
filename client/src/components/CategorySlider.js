// components/CategorySlider.jsx - Versión pegada (sin padding)
import React, { useState } from 'react';

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (categoryId, imageUrl) => {
    setFailedImages(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), imageUrl]
    }));
  };

  // Obtener la URL de la imagen (prioriza imageUrl, luego construye desde slug)
  const getImageUrl = (category) => {
    if (!category) return null;

    // Verificar si la imagen por defecto (imageUrl o construida) ya falló
    const defaultUrl = category.imageUrl || (category.slug ? `/categories/${category.slug}/${category.slug}.png` : null);
    if (defaultUrl && failedImages[category._id]?.includes(defaultUrl)) {
      return null; // Esta URL ya falló, no intentar de nuevo
    }
    
    // Si tiene imageUrl, usarlo (si no ha fallado)
    if (category.imageUrl && !failedImages[category._id]?.includes(category.imageUrl)) {
      return category.imageUrl;
    }
    
    // Si no tiene imageUrl o falló, construir desde slug (si no ha fallado ya)
    if (category.slug) {
      const slugUrl = `/categories/${category.slug}/${category.slug}.png`;
      if (!failedImages[category._id]?.includes(slugUrl)) {
        return slugUrl;
      }
    }
    
    return null; // No hay URL válida
  };

  if (!categories || categories.length === 0) {
    return <div className="text-center p-3">No hay categorías</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '16px',
        padding: 0,                    // ✅ SIN PADDING (pegado arriba/abajo)
        backgroundColor: '#fff',
        borderRadius: '12px',          // Opcional: mantiene bordes redondeados
        scrollbarWidth: 'thin'
      }}
    >
      {categories.map((cat) => {
        const imageUrl = getImageUrl(cat);
        const hasImage = imageUrl !== null;

        return (
          <div
            key={cat._id}
            onClick={() => onCategoryClick && onCategoryClick(cat)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: '70px'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {hasImage ? (
                <img
                  src={imageUrl}
                  alt={cat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={() => handleImageError(cat._id, imageUrl)}
                />
              ) : (
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#555' }}>
                  {cat.name?.charAt(0).toUpperCase() || '?'}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: '12px',
                marginTop: '6px',
                textAlign: 'center',
                maxWidth: '70px',
                fontWeight: '500',
                color: '#333'
              }}
            >
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySlider;