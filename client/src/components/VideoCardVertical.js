// components/VideoCardVertical.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';

const VideoCardVertical = ({ video }) => {
  const history = useHistory();

  // Ir a la categoría o al video (comportamiento original)
  const handleClick = () => {
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    
    const categorySlug = video.category?.slug;
    if (categorySlug) {
      history.push(`/${categorySlug}/1`);
    } else {
      history.push(`/video/${video._id}`);
    }
  };

  // Ir al perfil del canal (sin propagar)
  const goToChannel = (e) => {
    e.stopPropagation();
    if (video.channel?._id) {
      sessionStorage.setItem('returnToFeed', window.location.pathname);
      sessionStorage.setItem('scrollPosition', window.scrollY);
      history.push(`/channel/${video.channel._id}`);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
  };

  const categoryName = video.category?.name || (video.category && typeof video.category === 'object' ? video.category.name : null);

  // Usar datos del canal si existen, si no, fallback a los antiguos campos
  const channelName = video.channel?.name || video.nom_entreprise || 'Tienda';
  const channelActivity = video.channel?.activity || video.activite || 'Activité';

  return (
    <div
      className="video-card-vertical"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="video-thumbnail-wrapper">
        <img
          src={video.thumbnail || '/video-placeholder.jpg'}
          alt={video.title}
          className="thumbnail-img"
        />
        <div className="info-overlay">
          {/* Área cliqueable para el canal (anula el pointer-events: none del overlay) */}
          <div className="channel-info" onClick={goToChannel}>
            <div className="business-name">{channelName}</div>
            <div className="activity">{channelActivity}</div>
          </div>
          <div className="video-title">{video.title || 'Sin título'}</div>
          {formatPrice(video.price) && <div className="price">{formatPrice(video.price)}</div>}
          {categoryName && <div className="category">{categoryName}</div>}
        </div>
      </div>

      <style jsx>{`
        .video-card-vertical {
          transition: transform 0.2s ease;
          background: transparent;
          border-radius: 13px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        @media (max-width: 576px) {
          .video-card-vertical {
            margin-bottom: 10px;
          }
        }
        .video-card-vertical:hover {
          transform: translateY(-4px);
        }
        .video-thumbnail-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5.09;
          border-radius: 13px;
          overflow: hidden;
          background: #0f0f0f;
        }
        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .video-card-vertical:hover .thumbnail-img {
          transform: scale(1.02);
        }
        .info-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
          padding: 8px 8px 6px 8px;
          color: white;
          text-shadow: 0 1px 1px rgba(0,0,0,0.5);
          pointer-events: none;   /* ← El overlay no intercepta clics */
          z-index: 1;
        }
        /* Hacemos que el área del canal sea cliqueable */
        .channel-info {
          pointer-events: auto;    /* ← Anula el pointer-events para esta zona */
          cursor: pointer;
          margin-bottom: 4px;
          display: inline-block;
        }
        .business-name {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .activity {
          font-size: 0.7rem;
          font-weight: 500;
          color: #ffd966;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
        }
        .video-title {
          font-size: 0.75rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 3px;
        }
        .price {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4ade80;
          margin-bottom: 2px;
        }
        .category {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          opacity: 0.8;
          line-height: 1.2;
        }

        /* Ajustes para móviles */
        @media (max-width: 768px) {
          .info-overlay {
            padding: 6px 6px 4px 6px;
          }
          .business-name { font-size: 0.8rem; }
          .activity { font-size: 0.65rem; }
          .video-title { font-size: 0.7rem; }
          .price { font-size: 0.8rem; }
          .category { font-size: 0.55rem; }
        }
        @media (max-width: 480px) {
          .business-name { font-size: 0.75rem; }
          .activity { font-size: 0.6rem; }
          .video-title { font-size: 0.65rem; }
        }
      `}</style>
    </div>
  );
};

export default VideoCardVertical;