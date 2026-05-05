// components/CategorySection.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import VideoCardVertical from './VideoCardVertical';

const CategorySection = ({ category, videos, onViewMore }) => {
  const history = useHistory();
  
  if (!videos || videos.length === 0) return null;
  
  return (
    <section className="category-section py-1">
      <Container>
        {/* Header de categoría */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-">
          
            <div>
              <h3 className="h4 fw-bold mb-0">{category.name}</h3>
    
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
        
        {/* Grid de videos: 2 por fila en móvil, 4 en tablet, 6 en desktop */}
        <Row className="">
          {videos.slice(0, 6).map(video => (
            <Col key={video._id} xs={6} md={4} lg={2}>
              <VideoCardVertical video={video} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CategorySection;