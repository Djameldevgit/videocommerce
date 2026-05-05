// components/CategorySlider.jsx (para prueba rápida)
import React from 'react';

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  if (!categories || categories.length === 0) {
    return <div className="text-center p-3">No hay categorías</div>;
  }

  return (
    <div style={{ 
      display: 'flex', 
      overflowX: 'auto', 
      gap: '16px', 
      padding: '12px 16px',
      backgroundColor: '#fff',
      borderRadius: '12px'
    }}>
      {categories.map((cat) => (
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
              backgroundColor: cat.bgColor || '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px'
            }}
          >
            {cat.icon || '📦'}
          </div>
          <span style={{ fontSize: '12px', marginTop: '6px' }}>{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategorySlider;