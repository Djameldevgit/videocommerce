// 📂 frontend/src/components/CardHeader.jsx
import React from 'react';
import { Row, Col, Image, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Person, Clock, GeoAlt, Star, StarFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';

const CardHeader = ({ post, isDetailPage = false }) => {
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  if (!post) return null;

  const { user, createdAt, location, rating, category } = post;
  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Determinar tamaño de badge según si es detalle
  const badgeSize = isDetailPage ? 'md' : 'sm';

  return (
    <div className={`card-header-custom p-3 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`}>
      <Row className="align-items-center g-2">
        {/* Avatar y nombre del vendedor */}
        <Col xs={8} sm={7} md={8} lg={9}>
          <div className="d-flex align-items-center gap-2">
            <Link to={`/profile/${user?._id}`} className="text-decoration-none">
              <div className="position-relative">
                <Image
                  src={user?.avatar || '/default-avatar.png'}
                  roundedCircle
                  className="border border-2 border-primary"
                  style={{
                    width: isDetailPage ? '48px' : '40px',
                    height: isDetailPage ? '48px' : '40px',
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                />
                {user?.verified && (
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white">
                    <StarFill size={8} color="white" />
                  </div>
                )}
              </div>
            </Link>
            
            <div className="flex-grow-1">
              <Link to={`/profile/${user?._id}`} className="text-decoration-none">
                <h6 className={`mb-0 fw-semibold ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                  {user?.name || user?.username || 'Utilisateur'}
                  {user?.verified && (
                    <StarFill size={12} className="text-primary ms-1" />
                  )}
                </h6>
              </Link>
              
              <div className="d-flex align-items-center gap-2 small text-muted flex-wrap">
                {location && (
                  <span className="d-flex align-items-center gap-1">
                    <GeoAlt size={10} />
                    {location}
                  </span>
                )}
                <span className="d-flex align-items-center gap-1">
                  <Clock size={10} />
                  {formattedDate}
                </span>
                {rating > 0 && (
                  <span className="d-flex align-items-center gap-1">
                    <StarFill size={10} className="text-warning" />
                    {rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Col>

        {/* Badges y métricas */}
        <Col xs={4} sm={5} md={4} lg={3}>
          <div className="d-flex flex-wrap gap-1 justify-content-end">
            {/* Categoría */}
            {category && (
              <Badge 
                bg="primary" 
                className="rounded-pill px-2 py-1"
                style={{ fontSize: badgeSize === 'sm' ? '0.7rem' : '0.8rem' }}
              >
                {category.name || category}
              </Badge>
            )}

            {/* Estado del producto */}
            {post.status === 'sold' && (
              <Badge 
                bg="danger" 
                className="rounded-pill px-2 py-1"
                style={{ fontSize: badgeSize === 'sm' ? '0.7rem' : '0.8rem' }}
              >
                Vendu
              </Badge>
            )}
            
            {post.status === 'featured' && (
              <Badge 
                bg="warning" 
                className="rounded-pill px-2 py-1 text-dark"
                style={{ fontSize: badgeSize === 'sm' ? '0.7rem' : '0.8rem' }}
              >
                ⭐ En vedette
              </Badge>
            )}

            {/* Número de vistas - solo en detalle */}
            {isDetailPage && post.views > 0 && (
              <Badge 
                bg="secondary" 
                className="rounded-pill px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                👁️ {post.views}
              </Badge>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(CardHeader);