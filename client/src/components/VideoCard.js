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

  // Formatear fecha relativa corta (ej: "hace 2d")
  const getRelativeDateShort = (date) => {
    moment.locale('es'); // Cambiar a 'fr' según idioma
    const diff = moment().diff(moment(date), 'days');
    if (diff === 0) return 'hoy';
    if (diff < 7) return `hace ${diff}d`;
    return moment(date).format('DD/MM');
  };

  return (
    <>
      <div className="video-card" onClick={handleVideoClick}>
        {/* THUMBNAIL (más alto, estilo Shorts) */}
        <div className="thumbnail-container">
          <img 
            src={video.thumbnail || '/video-placeholder.jpg'} 
            alt={video.title}
            className="thumbnail-img"
            loading="lazy"
          />
          {/* Duración del video (opcional) */}
          {video.duration > 0 && (
            <span className="video-duration">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
          {/* Badge de precio (si es comercial) */}
          {video.price > 0 && (
            <span className="price-badge">
              {video.price} DA
            </span>
          )}
        </div>

        {/* INFO SIMPLIFICADA (solo título y metadata mínima) */}
        <div className="video-info">
          <h3 className="video-title">{video.title}</h3>
          <div className="video-meta">
            {video.duration > 0 && (
              <span className="meta-item">
                ⏱️ {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
            {video.price > 0 && (
              <span className="meta-item price">💰 {video.price} DA</span>
            )}
            <span className="meta-item">
              📅 {getRelativeDateShort(video.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .video-card {
          cursor: pointer;
          transition: transform 0.2s ease;
          background: transparent;
        }

        .video-card:hover {
          transform: translateY(-2px);
        }

        /* THUMBNAIL más alto (aspect-ratio 4:5 ≈ 0.8, más vertical) */
        .thumbnail-container {
          position: relative;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #0f0f0f;
          margin-bottom: 8px;
          aspect-ratio: 4 / 5;  /* Cambia esto a 9/16 para más altura estilo Reels */
        }

        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card:hover .thumbnail-img {
          transform: scale(1.02);
        }

        /* Badges sobre la thumbnail */
        .video-duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          backdrop-filter: blur(4px);
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
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        /* INFO SIMPLIFICADA */
        .video-info {
          padding: 0 4px;
        }

        .video-title {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
          margin: 0 0 6px 0;
          color: #0f0f0f;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 11px;
          color: #606060;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .meta-item.price {
          color: #16a34a;
          font-weight: 500;
        }

        /* ========== COMPACT MODE (para sidebars, manteniendo altura pero más pequeño) ========== */
        .video-card.compact .thumbnail-container {
          aspect-ratio: 16 / 9;
        }

        .video-card.compact .video-title {
          font-size: 13px;
          -webkit-line-clamp: 1;
        }

        .video-card.compact .video-meta {
          font-size: 10px;
          gap: 8px;
        }

        /* ============================================ */
        /* RESPONSIVE */
        /* ============================================ */
        @media (max-width: 768px) {
          .video-title {
            font-size: 13px;
          }
          .video-meta {
            font-size: 10px;
            gap: 8px;
          }
          .thumbnail-container {
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .video-title {
            font-size: 12px;
          }
          .video-meta {
            font-size: 9px;
          }
        }
      `}</style>
    </>
  );
};

export default VideoCard;