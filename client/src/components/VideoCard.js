// components/VideoCard.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const VideoCard = ({ video, compact = false }) => {
  const history = useHistory();

  // Ir al video o categoría (comportamiento original)
  const handleVideoClick = (e) => {
    e.stopPropagation();
    sessionStorage.setItem('returnToFeed', window.location.pathname);
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/video/${video._id}`);
  };

  // Ir al perfil del canal
  const goToChannel = (e) => {
    e.stopPropagation();
    if (video.channel?._id) {
      sessionStorage.setItem('returnToFeed', window.location.pathname);
      sessionStorage.setItem('scrollPosition', window.scrollY);
      history.push(`/channel/${video.channel._id}`);
    }
  };

  const getRelativeDateShort = (date) => {
    moment.locale('fr');
    const diff = moment().diff(moment(date), 'days');
    if (diff === 0) return 'aujourd\'hui';
    if (diff < 7) return `il y a ${diff}j`;
    return moment(date).format('DD/MM');
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
            loading="lazy"
          />
          {video.duration > 0 && (
            <span className="video-duration">
              {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
          {video.price > 0 && (
            <span className="price-badge">{video.price} DA</span>
          )}
        </div>

        {/* INFO CON AVATAR DEL CANAL */}
        <div className="video-info">
          {/* Canal: avatar + nombre cliqueable */}
          {video.channel && (
            <div className="channel-row" onClick={goToChannel}>
              <img 
                src={video.channel.avatar || '/default-avatar.png'} 
                alt={video.channel.name}
                className="channel-avatar"
              />
              <span className="channel-name">{video.channel.name}</span>
            </div>
          )}
          <h3 className="video-title">{video.title}</h3>
          <div className="video-meta">
            {video.duration > 0 && (
              <span className="meta-item">⏱️ {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
            )}
            {video.price > 0 && (
              <span className="meta-item price">💰 {video.price} DA</span>
            )}
            <span className="meta-item">📅 {getRelativeDateShort(video.createdAt)}</span>
          </div>
        </div>
      </div>

      <style>{`
        /* ... tus estilos existentes ... */
        /* Añade estos estilos para el canal */
        .channel-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          cursor: pointer;
          width: fit-content;
        }
        .channel-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
        }
        .channel-name {
          font-size: 13px;
          font-weight: 500;
          color: #0f0f0f;
        }
        .channel-row:hover .channel-name {
          text-decoration: underline;
        }
        /* Ajustes responsive */
        @media (max-width: 768px) {
          .channel-avatar { width: 24px; height: 24px; }
          .channel-name { font-size: 12px; }
        }
      `}</style>
    </>
  );
};

export default VideoCard;