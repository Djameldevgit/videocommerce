// components/CategorySection.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowRight, CameraVideo, PlusCircle } from 'react-bootstrap-icons';
import VideoCardVertical from './VideoCardVertical';

const CategorySection = ({ category, videos, onViewMore }) => {
  const history = useHistory();
  const sectionRef = useRef(null);
  
  const videoList = videos || [];
  const hasVideos = videoList.length > 0;
  
  // ✅ SOLO PARA LOG - no condicionar renderizado
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          console.log(`📂 Sección visible: ${category.name}`);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [category.name]);

  // ✅ SIEMPRE renderizar VideoCardVertical, sin condicional
  return (
    <section ref={sectionRef} className="category-section py-4">
      <Container>
        {/* Header de categoría */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            {category.icon && (
              <div className="category-icon-wrapper">
                <img 
                  src={category.icon} 
                  alt={category.name}
                  style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                />
              </div>
            )}
            <div>
              <h3 className="h4 fw-bold mb-0">{category.name}</h3>
              {!hasVideos && (
                <small className="text-muted">Aucune vidéo pour le moment</small>
              )}
            </div>
          </div>
          <Button 
            variant="outline-primary" 
            className="rounded-pill px-3"
            onClick={() => onViewMore(category.slug, category.name)}
          >
            Voir tout <ArrowRight size={16} className="ms-2" />
          </Button>
        </div>
        
        {/* ✅ SIEMPRE renderizar los videos, sin skeleton condicional */}
        {hasVideos ? (
          <Row className="g-3">
            {videoList.slice(0, 6).map(video => (
              <Col key={video._id} xs={6} md={4} lg={2}>
                <VideoCardVertical video={video} />
              </Col>
            ))}
          </Row>
        ) : (
          /* Empty State */
          <div className="text-center py-5 bg-light rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="mb-3">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white"
                style={{ width: '64px', height: '64px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
              >
                <CameraVideo size={32} className="text-muted" />
              </div>
            </div>
            <h5 className="fw-semibold mb-2">Aucune vidéo dans {category.name}</h5>
            <p className="text-muted mb-3 small">
              Soyez le premier à partager une vidéo dans cette catégorie
            </p>
            <Button 
              variant="primary" 
              className="rounded-pill px-4"
              onClick={() => history.push('/create-video-page')}
            >
              <PlusCircle size={16} className="me-2" />
              Publier une vidéo
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};

export default CategorySection;