import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PostGrid = ({ posts, maxPosts, canFeature }) => {
  const displayPosts = maxPosts === 'unlimited' 
    ? posts 
    : posts.slice(0, maxPosts || 10);
  
  return (
    <div className="post-grid">
      <Row className="g-4">
        {displayPosts.map((post, idx) => (
          <Col key={post._id || idx} md={6} lg={4}>
            <Card className="h-100 shadow-sm hover-effect">
              {post.images?.[0] && (
                <Card.Img 
                  variant="top" 
                  src={post.images[0].url}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              
              <Card.Body>
                {canFeature && post.featured && (
                  <Badge bg="warning" text="dark" className="mb-2">
                    <i className="fas fa-star me-1"></i> À la une
                  </Badge>
                )}
                
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className="text-muted small">
                  {post.description?.substring(0, 100)}...
                </Card.Text>
                
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-primary">
                    {post.price?.toLocaleString()} DA
                  </span>
                  <Button 
                    as={Link} 
                    to={`/post/${post._id}`}
                    variant="outline-primary" 
                    size="sm"
                  >
                    Voir détails
                  </Button>
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-transparent border-0">
                <small className="text-muted">
                  <i className="fas fa-eye me-1"></i> {post.views || 0} vues
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      
      {displayPosts.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <p className="text-muted">Aucun produit disponible</p>
        </div>
      )}
    </div>
  );
};

export default PostGrid;