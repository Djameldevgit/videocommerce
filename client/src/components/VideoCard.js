// components/VideoCard.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const VideoCard = ({ video, compact = false }) => {
  const history = useHistory();

  const handleVideoClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/video/${video._id}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/video/${video._id}`); // ✅ Envía al video, no al perfil
  };

  // Formatear fecha relativa (ej: "hace 2 días")
  const getRelativeDate = (date) => {
    moment.locale('es'); // Español - cambiar a 'fr' para francés
    return moment(date).fromNow();
  };

  return (
    <>
      <div className="video-card" onClick={handleVideoClick}>
        {/* THUMBNAIL */}
        <div className="thumbnail-container">
          <img 
            src={video.thumbnail || '/video-placeholder.jpg'} 
            alt={video.title}
            className="thumbnail-img"
          />
          {/* Duración del video */}
          {video.duration > 0 && (
            <span className="video-duration">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
          {/* Badge de precio (opcional) */}
          {video.price > 0 && (
            <span className="price-badge">
              {video.price} DA
            </span>
          )}
        </div>

        {/* INFO DEL VIDEO */}
        <div className="video-info">
          {/* Avatar - CLICKEABLE (envía al video) */}
          <div className="channel-avatar" onClick={handleUserClick}>
            <img 
              src={video.user?.avatar || '/default-avatar.png'} 
              alt={video.user?.username}
            />
          </div>
          
          {/* Título y metadata */}
          <div className="video-details">
            <h3 className="video-title">{video.title}</h3>
            <div className="video-channel" onClick={handleUserClick}>
              {video.user?.username}
            </div>
            <div className="video-date">
              {getRelativeDate(video.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .video-card {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .video-card:hover {
          transform: translateY(-2px);
        }

        /* THUMBNAIL */
        .thumbnail-container {
          position: relative;
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #0f0f0f;
          margin-bottom: 10px;
        }

        .thumbnail-img {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card:hover .thumbnail-img {
          transform: scale(1.05);
        }

        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }

        .price-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #16a34a;
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 20px;
        }

        /* INFO DEL VIDEO */
        .video-info {
          display: flex;
          gap: 10px;
        }

        /* AVATAR */
        .channel-avatar {
          flex-shrink: 0;
          cursor: pointer;
        }

        .channel-avatar img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          transition: opacity 0.2s;
        }

        .channel-avatar img:hover {
          opacity: 0.8;
        }

        /* DETALLES */
        .video-details {
          flex: 1;
          min-width: 0;
        }

        .video-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 4px 0;
          color: #0f0f0f;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-channel {
          font-size: 12px;
          color: #606060;
          cursor: pointer;
          margin-bottom: 2px;
          transition: color 0.2s;
        }

        .video-channel:hover {
          color: #0f0f0f;
        }

        .video-date {
          font-size: 12px;
          color: #606060;
        }

        /* ============================================ */
        /* COMPACT MODE (para sidebars o listas) */
        /* ============================================ */
        .video-card.compact {
          display: flex;
          gap: 10px;
        }

        .video-card.compact .thumbnail-container {
          width: 168px;
          margin-bottom: 0;
        }

        .video-card.compact .video-info {
          flex: 1;
        }

        /* ============================================ */
        /* RESPONSIVE */
        /* ============================================ */
        @media (max-width: 768px) {
          .channel-avatar img {
            width: 32px;
            height: 32px;
          }
          .video-title {
            font-size: 13px;
          }
          .video-channel, .video-date {
            font-size: 11px;
          }
          .thumbnail-container {
            border-radius: 8px;
          }
        }

        @media (max-width: 480px) {
          .channel-avatar img {
            width: 28px;
            height: 28px;
          }
          .video-title {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default VideoCard;