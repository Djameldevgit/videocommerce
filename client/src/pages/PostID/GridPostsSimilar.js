// 📂 frontend/src/components/GridPostsSimilar/GridPostsSimilar.jsx
import React from 'react';
import { Spinner, Alert, Badge, Row } from 'react-bootstrap';
import PostThumb from '../../components/PostThumb';

const GridPostsSimilar = ({ 
  similarPosts = [], 
  loading = false, 
  categorie, 
  subCategory 
}) => {
  if (!categorie || !subCategory) return null;

  return (
    <div className="mb-2">
      <div className="mb-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
            🔍 Publications similaires
          </h5>
        
        </div>
     
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-4" style={{
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Recherche de publications similaires...</p>
        </div>
      )}

      {/* PostThumb ya maneja el layout VERTICAL automáticamente */}
      {!loading && similarPosts.length > 0 && (
    <PostThumb posts={similarPosts} /> 
      )}

      {/* Mensaje cuando no hay posts */}
      {!loading && similarPosts.length === 0 && (
        <Alert variant="light" className="text-center py-4" style={{
          background: '#f8f9fa',
          border: '1px dashed #dee2e6',
          borderRadius: '10px'
        }}>
          <div className="mb-2" style={{ fontSize: '2rem' }}>🔍</div>
          <p className="mb-0 text-muted">Aucune publication similaire trouvée</p>
        </Alert>
      )}
    </div>
  );
};

export default GridPostsSimilar;