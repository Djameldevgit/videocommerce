// components/VideoCardVertical.jsx - VERSIÓN CON CSS NORMAL
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { VolumeMute, VolumeUp } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import './VideoCardVertical.css'; // ✅ Importar CSS externo
 
const VideoCardVertical = ({ video }) => {
  const history = useHistory();
  
  // Obtener el modo de reproducción desde Redux
  const { videoPlaybackMode = 'live' } = useSelector(state => state.videoMode || { videoPlaybackMode: 'live' });
  const isLiveMode = videoPlaybackMode === 'live';
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeBtn, setShowVolumeBtn] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const videoUrl = video.videoUrl;

  // Observer para detectar visibilidad (solo en modo live)
  useEffect(() => {
    if (!isLiveMode) return;
    
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          setIsVisible(visible);
        });
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    observer.observe(currentContainer);
    return () => observer.unobserve(currentContainer);
  }, [isLiveMode]);

  // Controlar reproducción (solo en modo live)
  useEffect(() => {
    if (!isLiveMode) return;
    if (!videoRef.current || !videoUrl) return;

    if (isVisible) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(error => {
        console.log(`Error playing: ${error.message}`);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isVisible, videoUrl, isMuted, isLiveMode]);

  // Mostrar botón de volumen solo en modo live y visible
  useEffect(() => {
    if (isLiveMode && isVisible) {
      setShowVolumeBtn(true);
    } else {
      setShowVolumeBtn(false);
    }
  }, [isLiveMode, isVisible]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current && isLiveMode) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

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

  const goToChannel = (e) => {
    e.stopPropagation();
    if (video.channel?._id) {
      history.push(`/channel/${video.channel._id}`);
    }
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
  };

  const channelName = video.channel?.name || video.nom_entreprise || 'Tienda';

  // Modo estático: solo mostrar thumbnail
  if (!isLiveMode) {
    return (
      <div className="video-card-vertical static-mode" onClick={handleClick}>
        <div className="video-thumbnail-wrapper">
          <img
            src={video.thumbnail || '/video-placeholder.jpg'}
            alt={video.title}
            className="thumbnail-img"
          />
          {video.duration > 0 && (
            <div className="duration-badge">
              {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
          <div className="info-overlay">
            <div className="channel-info" onClick={goToChannel}>
              <div className="business-name">{channelName}</div>
            </div>
            <div className="video-title">{video.title || 'Sin título'}</div>
            {formatPrice(video.price) && <div className="price">{formatPrice(video.price)}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Modo live: con autoplay al scroll y botón de sonido
  return (
    <div
      ref={containerRef}
      className="video-card-vertical live-mode"
      onClick={handleClick}
    >
      <div className="video-thumbnail-wrapper">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={video.thumbnail || '/video-placeholder.jpg'}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="video-element"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
        
        <img
          src={video.thumbnail || '/video-placeholder.jpg'}
          alt={video.title}
          className="thumbnail-img"
          style={{
            opacity: isVisible ? 0 : 1,
            transition: 'opacity 0.2s ease'
          }}
        />
        
        {showVolumeBtn && (
          <button
            className="volume-btn"
            onClick={toggleMute}
            title={isMuted ? "Activar sonido" : "Silenciar"}
          >
            {isMuted ? <VolumeMute size={18} /> : <VolumeUp size={18} />}
          </button>
        )}
        
        {video.duration > 0 && (
          <div className="duration-badge">
            {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
          </div>
        )}
        
        <div className="info-overlay">
          <div className="channel-info" onClick={goToChannel}>
            <div className="business-name">{channelName}</div>
          </div>
          <div className="video-title">{video.title || 'Sin título'}</div>
          {formatPrice(video.price) && <div className="price">{formatPrice(video.price)}</div>}
        </div>
      </div>
    </div>
  );
};

export default VideoCardVertical;