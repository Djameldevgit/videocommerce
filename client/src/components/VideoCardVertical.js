// components/VideoCardVertical.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { Eye, Heart, Coin } from 'react-bootstrap-icons';

const VideoCardVertical = ({ video }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/video/${video._id}`);
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
  };

  return (
    <Card 
      className="video-card-vertical h-100 border-0 shadow-sm rounded-4 overflow-hidden"
      onClick={handleClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
    >
      <div className="position-relative">
        <div className="video-thumbnail">
          <img 
            src={video.thumbnail || '/video-placeholder.jpg'} 
            alt={video.title}
            className="w-100"
            style={{ aspectRatio: '4/5', objectFit: 'cover' }}
          />
          {video.price > 0 && (
            <Badge 
              bg="success" 
              className="position-absolute top-0 end-0 m-2 px-3 py-2 rounded-pill"
            >
              <Coin size={12} className="me-1" /> {formatPrice(video.price)}
            </Badge>
          )}
          {video.isCommercial && (
            <Badge 
              bg="info" 
              className="position-absolute bottom-0 start-0 m-2 px-3 py-2 rounded-pill"
              style={{ background: '#3b82f6' }}
            >
              🛒 Commercial
            </Badge>
          )}
          <div className="video-stats-overlay position-absolute bottom-0 end-0 m-2">
            <Badge bg="dark" className="opacity-75 me-1">
              <Eye size={12} className="me-1" /> {video.views || 0}
            </Badge>
            <Badge bg="dark" className="opacity-75">
              <Heart size={12} className="me-1" /> {video.likes?.length || 0}
            </Badge>
          </div>
        </div>
      </div>
      
      <Card.Body className="p-3">
        <Card.Title className="fs-6 fw-bold text-truncate mb-2">
          {video.title}
        </Card.Title>
        
        <Card.Text className="small text-muted text-truncate mb-2">
          {video.description}
        </Card.Text>
        
        <div className="d-flex align-items-center gap-2 mt-2">
          <img 
            src={video.user?.avatar || '/default-avatar.png'} 
            alt={video.user?.username}
            className="rounded-circle"
            style={{ width: 28, height: 28, objectFit: 'cover' }}
          />
          <small className="text-muted text-truncate" style={{ maxWidth: '100px' }}>
            @{video.user?.username}
          </small>
        </div>
        
        {video.wilaya && (
          <div className="mt-2 small text-muted d-flex align-items-center gap-1">
            <p size={12} /> {video.wilaya}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default VideoCardVertical;