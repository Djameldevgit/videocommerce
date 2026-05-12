// src/pages/channel/ChannelProfile.jsx (versión corregida)
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm, faBookmark, faHeart, faArrowLeft,
  faUserPlus, faCheck, faEnvelope, faShare,
  faEllipsisH, faSpinner, faUserCircle,
  faPlay, faUserCog, faCommentDots, faEye,
  faInfoCircle, faPhone, faEnvelope as faEnvelopeSolid,
  faGlobe, faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';

import { getChannelProfile, toggleFollowChannel, getChannelVideos } from '../../redux/actions/channelAction';
import { toggleSaveVideo, getSavedVideos, getLikedVideos } from '../../redux/actions/userVideoAction';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import './ChannelProfile.css';
import HeaderVideo from '../HeaderVideo';

/* ────────────────────────────────────────────
   LOADING SPINNER
   ──────────────────────────────────────────── */
const LoadingSpinner = () => (
  <div className="channel-loading">
    <div className="loading-spinner">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
    <p>Cargando canal...</p>
  </div>
);

/* ────────────────────────────────────────────
   AVATAR CON FALLBACK
   ──────────────────────────────────────────── */
const AvatarWithFallback = ({ src, alt, className, name, onClick }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError || !src) {
    const colors = ['#fe2c55', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'];
    const bg = colors[(name?.length || 0) % colors.length];
    return (
      <div
        className={`${className} ${onClick ? 'clickable' : ''}`}
        onClick={onClick}
        style={{
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#fff',
          cursor: onClick ? 'pointer' : 'default'
        }}
      >
        {name ? name[0].toUpperCase() : <FontAwesomeIcon icon={faUserCircle} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${onClick ? 'clickable' : ''}`}
      onError={() => setImgError(true)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

/* ────────────────────────────────────────────
   MINI VIDEO CARD
   ──────────────────────────────────────────── */
const MiniVideoCard = ({ video, onClick, isOwner, onSave, isSavedInitial = false }) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const fmt = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    if (onSave) {
      const success = await onSave(video._id);
      if (success) setIsSaved(!isSaved);
    }
    setSaving(false);
  };

  return (
    <div className="channel-mini-video-card" onClick={() => onClick(video._id)}>
      <div className="channel-mini-thumbnail-container">
        <img
          src={video.thumbnail || video.videoUrl?.replace(/\.mp4$/, '.jpg') || '/default-video.jpg'}
          alt={video.title}
          className="channel-mini-thumbnail"
          loading="lazy"
        />

        <div className="channel-mini-overlay">
          <div className="channel-mini-stats">
            <span className="channel-stat-play">
              <FontAwesomeIcon icon={faPlay} className="channel-stat-icon" />
              {fmt(video.views)}
            </span>
          </div>
        </div>

        {!isOwner && onSave && (
          <button
            className={`channel-mini-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            <FontAwesomeIcon icon={faBookmark} spin={saving} />
          </button>
        )}

        {video.duration > 0 && (
          <div className="channel-mini-duration">
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <p className="channel-mini-title">{video.title?.substring(0, 40)}</p>
    </div>
  );
};

/* ────────────────────────────────────────────
   COMPONENTE PRINCIPAL - ChannelProfile
   ──────────────────────────────────────────── */
const ChannelProfile = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  // ✅ SELECTORES CORREGIDOS - Usando los nombres de tu reducer
  const { 
    channel, 
    loading,           // ← CORREGIDO
    videos = [],       // ← CORREGIDO: antes era channelVideos
    hasMore = false,   // ← CORREGIDO: antes era channelVideosHasMore
    totalVideos = 0,   // ← CORREGIDO: antes era channelVideosTotal
  } = useSelector(state => state.channel);
  
  const { savedVideos = [], likedVideos = [] } = useSelector(state => state.userVideo);

  const [activeTab, setActiveTab] = useState('videos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const isOwner = auth.user?._id === channel?.owner?._id;

  const fmt = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  /* ── CARGA INICIAL ── */
  useEffect(() => {
    if (channelId) {
      console.log('📺 Cargando canal:', channelId);
      dispatch(getChannelProfile(channelId));
      dispatch(getChannelVideos(channelId, 1, 12));
    }
    return () => {
      dispatch({ type: 'CLEAR_CHANNEL' });
    };
  }, [dispatch, channelId]);

  /* Mostrar videos en consola para debug */
  useEffect(() => {
    console.log('🎬 Videos en estado:', videos);
    console.log('📊 Total videos:', totalVideos);
    console.log('🔄 HasMore:', hasMore);
  }, [videos, totalVideos, hasMore]);

  /* ── HANDLERS ── */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) {
      console.log('No se puede cargar más:', { loadingMore, hasMore });
      return;
    }
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    console.log('📥 Cargando página:', nextPage);
    await dispatch(getChannelVideos(channelId, nextPage, 12));
    setCurrentPage(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, currentPage, dispatch, channelId]);

  const handleFollow = useCallback(async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    await dispatch(toggleFollowChannel(channelId, auth.token));
  }, [channelId, auth.token, history, dispatch]);

  const handleSaveVideo = useCallback(async (videoId) => {
    if (!auth.token) {
      history.push('/login');
      return false;
    }
    const result = await dispatch(toggleSaveVideo(videoId, auth.token));
    return result?.success || false;
  }, [auth.token, history, dispatch]);

  const handleMessage = useCallback(() => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    history.push(`/message/${channel?.owner?._id}`);
  }, [auth.token, history, channel?.owner?._id]);

  const handleViewConversations = useCallback(() => {
    history.push('/message');
  }, [history]);

  const handleShareProfile = useCallback(() => {
    const url = `${window.location.origin}/channel/${channelId}`;
    if (navigator.share) {
      navigator.share({ title: `Canal de ${channel?.name}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
  }, [channel?.name, channelId]);

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem('returnToChannel', 'true');
    sessionStorage.setItem('channelScrollPosition', window.scrollY.toString());
    history.push(`/video/channelFeed/${channelId}?startVideo=${videoId}`);
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    history.push(`/channel/${channelId}/settings`);
  };

  const handleAvatarClick = () => {
    if (isOwner) {
      history.push(`/channel/${channelId}/settings`);
    }
  };

  /* ── OBTENER VIDEOS SEGÚN TAB ── */
  const getCurrentVideos = () => {
    if (activeTab === 'videos') return videos;
    if (activeTab === 'saved') return savedVideos;
    if (activeTab === 'liked') return likedVideos;
    return [];
  };

  const getCurrentHasMore = () => {
    if (activeTab === 'videos') return hasMore;
    return false;
  };

  const getCurrentTotal = () => {
    if (activeTab === 'videos') return totalVideos;
    if (activeTab === 'saved') return savedVideos.length;
    if (activeTab === 'liked') return likedVideos.length;
    return 0;
  };

  /* ── RENDER ── */
  if (loading && !channel) {
    return <LoadingSpinner />;
  }

  if (!channel) {
    return (
      <div className="channel-error">
        <h2>Canal no encontrado</h2>
        <button onClick={() => history.push('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="channel-profile-page">

      {/* ── HEADER ── */}
      <div className="channel-header">
        <button className="channel-back-btn" onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h2 className="channel-header-title">{channel.name}</h2>

        <div className="channel-header-actions">
          {isOwner && (
            <button className="channel-conversations-btn" onClick={handleViewConversations}>
              <FontAwesomeIcon icon={faCommentDots} />
            </button>
          )}
          
          <button className="channel-share-btn" onClick={handleShareProfile}>
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      </div>

      {/* ── BANNER ── */}
      {channel.cover && (
        <div className="channel-banner-container">
          <img src={channel.cover} alt="Banner" className="channel-banner" />
        </div>
      )}

      {/* ── AVATAR ── */}
      <div className="channel-avatar-container">
        <AvatarWithFallback
          src={channel.avatar}
          alt={channel.name}
          name={channel.name}
          className="channel-avatar"
          onClick={handleAvatarClick}
        />
      </div>

      {/* ── BOTÓN DE 3 PUNTOS ── */}
      {isOwner && (
        <div className="channel-three-dots-wrapper">
          <button 
            className="channel-three-dots-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
          
          {showProfileMenu && (
            <div className="channel-profile-menu">
              <button onClick={handleEditProfile}>
                <FontAwesomeIcon icon={faUserCog} />
                <span>Editar canal</span>
              </button>
              <button onClick={() => setShowContactInfo(!showContactInfo)}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>Info contacto</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── NOMBRE ── */}
      <h2 className="channel-name">{channel.name}</h2>

      {/* ── VERIFICACIÓN ── */}
      {channel.isVerified && (
        <div className="channel-verified-badge">
          <FontAwesomeIcon icon={faCheck} />
          <span>Canal verificado</span>
        </div>
      )}

      {/* ── DESCRIPCIÓN ── */}
      {channel.description && <p className="channel-bio">{channel.description}</p>}

      {/* ── INFO CONTACTO ── */}
      {showContactInfo && (channel.phone || channel.email || channel.website || channel.wilaya) && (
        <div className="channel-contact-info">
          <div className="channel-contact-header">
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>Información de contacto</span>
          </div>
          <div className="channel-contact-grid">
            {channel.wilaya && (
              <div className="channel-contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>{channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}</span>
              </div>
            )}
            {channel.phone && (
              <div className="channel-contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <a href={`tel:${channel.phone}`}>{channel.phone}</a>
              </div>
            )}
            {channel.email && (
              <div className="channel-contact-item">
                <FontAwesomeIcon icon={faEnvelopeSolid} />
                <a href={`mailto:${channel.email}`}>{channel.email}</a>
              </div>
            )}
            {channel.website && (
              <div className="channel-contact-item">
                <FontAwesomeIcon icon={faGlobe} />
                <a href={channel.website} target="_blank" rel="noopener noreferrer">{channel.website}</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STATS ── */}
      <div className="channel-stats-row">
        <div className="channel-stat">
          <div className="channel-stat-number">{fmt(channel.totalVideos || 0)}</div>
          <div className="channel-stat-label">Videos</div>
        </div>

        <div className="channel-stat">
          <div className="channel-stat-number">{fmt(channel.totalViews || 0)}</div>
          <div className="channel-stat-label">Vistas</div>
        </div>

        <div className="channel-stat">
          <div className="channel-stat-number">{fmt(channel.totalLikes || 0)}</div>
          <div className="channel-stat-label">Likes</div>
        </div>

        <div className="channel-stat">
          <div className="channel-stat-number">{fmt(channel.followersCount || 0)}</div>
          <div className="channel-stat-label">Seguidores</div>
        </div>
      </div>

      {/* ── BOTONES ACCIÓN ── */}
      {!isOwner && (
        <div className="channel-action-buttons">
          <button
            className={`channel-follow-btn ${channel.isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            <FontAwesomeIcon icon={channel.isFollowing ? faCheck : faUserPlus} />
            <span>{channel.isFollowing ? 'Siguiendo' : 'Seguir'}</span>
          </button>

          <button className="channel-message-btn" onClick={handleMessage}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Mensaje</span>
          </button>
        </div>
      )}

      <div className="channel-separator" />

      {/* ── TABS ── */}
      <div className="channel-tabs">
        <button
          className={`channel-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => handleTabChange('videos')}
        >
          <FontAwesomeIcon icon={faFilm} />
          <span>Videos</span>
          {getCurrentTotal() > 0 && (
            <span className="channel-tab-count">{fmt(getCurrentTotal())}</span>
          )}
        </button>

        {isOwner && auth.token && (
          <>
            <button
              className={`channel-tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span>Guardados</span>
            </button>

            <button
              className={`channel-tab ${activeTab === 'liked' ? 'active' : ''}`}
              onClick={() => handleTabChange('liked')}
            >
              <FontAwesomeIcon icon={faHeart} />
              <span>Me gusta</span>
            </button>
          </>
        )}
      </div>

      {/* ── GRID DE VIDEOS ── */}
      <div className="channel-videos-grid">
        {getCurrentVideos().map(video => (
          <MiniVideoCard
            key={video._id}
            video={video}
            onClick={handleVideoClick}
            isOwner={isOwner}
            onSave={activeTab === 'videos' ? handleSaveVideo : undefined}
            isSavedInitial={savedVideos.some(v => v._id === video._id)}
          />
        ))}
      </div>

      {/* ── EMPTY STATE ── */}
      {getCurrentVideos().length === 0 && !loading && (
        <div className="channel-empty-state">
          <div className="channel-empty-icon-container">
            <FontAwesomeIcon
              icon={activeTab === 'videos' ? faFilm : activeTab === 'saved' ? faBookmark : faHeart}
              className="channel-empty-icon"
            />
          </div>
          <h3 className="channel-empty-title">
            {activeTab === 'videos' ? 'Sin videos' : activeTab === 'saved' ? 'Sin guardados' : 'Sin me gusta'}
          </h3>
          <p className="channel-empty-description">
            {activeTab === 'videos' && isOwner
              ? '¡Comienza a compartir tus primeros videos comerciales!'
              : activeTab === 'videos'
                ? 'Este canal aún no ha publicado videos.'
                : activeTab === 'saved'
                  ? 'Los videos que guardes aparecerán aquí.'
                  : 'Los videos que te gusten aparecerán aquí.'}
          </p>
          {activeTab === 'videos' && isOwner && (
            <button className="channel-upload-btn" onClick={() => history.push('/upload-video')}>
              <FontAwesomeIcon icon={faFilm} />
              Subir video
            </button>
          )}
        </div>
      )}

      {/* ── LOAD MORE ── */}
      {getCurrentHasMore() && getCurrentVideos().length > 0 && (
        <LoadMoreBtn loading={loadingMore} loadMore={loadMoreVideos} />
      )}
<HeaderVideo/>
    </div>
  );
};

export default ChannelProfile;