// components/VideoCard.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { Eye, Heart  } from 'react-bootstrap-icons';

const VideoCard = ({ video, compact = false }) => {
  const history = useHistory();

  const handleVideoClick = (e) => {
    e.stopPropagation();
    // Guardar la posición actual para volver
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/video/${video._id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/user/${video.user._id}/videos`);
  };

  return (
    <Card className="video-card h-100 border-0 shadow-sm" onClick={handleVideoClick}>
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={video.thumbnail || '/video-placeholder.jpg'} 
          style={{ aspectRatio: '16/9', objectFit: 'cover' }}
        />
        {video.price > 0 && (
          <Badge 
            bg="success" 
            className="position-absolute top-0 end-0 m-2"
          >
            {video.price} DA
          </Badge>
        )}
        {video.isCommercial && (
          <Badge 
            bg="info" 
            className="position-absolute bottom-0 start-0 m-2"
          >
            🛒 Commercial
          </Badge>
        )}
      </div>
      
      <Card.Body>
        <Card.Title className="fs-6 fw-bold text-truncate">
          {video.title}
        </Card.Title>
        
        <Card.Text className="small text-muted text-truncate">
          {video.description}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* Avatar y nombre del usuario - CLICKEABLE */}
          <div 
            className="d-flex align-items-center gap-2 cursor-pointer" 
            onClick={handleUserClick}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={video.user?.avatar || '/default-avatar.png'} 
              alt={video.user?.username}
              className="rounded-circle"
              style={{ width: 28, height: 28, objectFit: 'cover' }}
            />
            <small className="text-muted">@{video.user?.username}</small>
          </div>
          
          <div className="d-flex gap-2 text-muted small">
            <span><Eye size={14} /> {video.views || 0}</span>
            <span><Heart size={14} /> {video.likes?.length || 0}</span>
          </div>
        </div>
        
        {video.wilaya && (
          <div className="mt-2 small text-muted">
            <p size={12} /> {video.wilaya}, {video.commune}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default VideoCard;