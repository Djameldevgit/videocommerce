// 📂 components/GridPosts.js
import React, { useState } from 'react';
import { Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import PostCard from './PostCard'; // Asumiendo que tienes este componente

const GridPosts = ({ 
  posts, 
  loading, 
  error, 
  total = 0, 
  page = 1, 
  limit = 8,
  onPageChange,
  emptyMessage = "Aucun post trouvé"
}) => {
  const [currentPage, setCurrentPage] = useState(page);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Erreur de chargement</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="empty-state-icon mb-3">
          <span className="display-4">📭</span>
        </div>
        <h4 className="text-muted">{emptyMessage}</h4>
        <p className="text-muted">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="grid-posts-container">
      {/* Grid de posts */}
      <Row className="g-4">
        {posts.map((post, index) => (
          <Col key={post._id || index} xs={12} sm={6} md={4} lg={3}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            />
            
            {/* Mostrar números de página */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Mostrar solo algunas páginas alrededor de la actual
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Pagination.Item
                    key={pageNum}
                    active={pageNum === currentPage}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Item>
                );
              } else if (
                (pageNum === currentPage - 2 && currentPage > 3) ||
                (pageNum === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return <Pagination.Ellipsis key={`ellipsis-${pageNum}`} />;
              }
              return null;
            })}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}

      {/* Info de paginación */}
      <div className="text-center mt-3 text-muted small">
        Affichage de {posts.length} posts sur {total} • Page {currentPage} sur {totalPages}
      </div>
    </div>
  );
};

export default GridPosts;