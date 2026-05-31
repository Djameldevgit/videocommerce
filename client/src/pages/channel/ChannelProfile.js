// frontend/src/pages/channel/ChannelProfile.jsx
// 🔥 VERSIÓN PROFESIONAL - ESTILO YOUTUBE/DEEPSEEK

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm, faBookmark, faHeart, faArrowLeft,
  faUserPlus, faCheck, faEnvelope, faShare,
  faEllipsisH, faSpinner, faUserCircle,
  faPlay, faCommentDots,
  faInfoCircle, faPhone, faEnvelope as faEnvelopeSolid,
  faGlobe, faMapMarkerAlt,
  faFlag, faBan, faTrashAlt, faEdit, faImage,
  faCalendarAlt, faVideo, faEye, faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

import { 
  toggleFollowChannel, 
  getChannelVideos,
  clearChannelState,
  getChannelProfile
} from '../../redux/actions/channelAction';
import { toggleSaveVideo, getSavedVideos, getLikedVideos } from '../../redux/actions/userVideoAction';
import LoadMoreBtn from '../../components/LoadMoreBtn';
 
 import VideoCardVertical from '../../components/VideoCardVertical';
import './ChannelProfile.css';
import HeaderVideo from '../HeaderVideo';
import useUserPlan from '../../components/useUserPlan';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';


const CLEAR_CHANNEL = 'CLEAR_CHANNEL';

// ==================== FUNCIÓN PARA EXTRAER URL DE IMAGEN ====================
const getImageUrl = (imageData, defaultValue = '') => {
  if (!imageData) return defaultValue;
  if (typeof imageData === 'string') return imageData;
  if (Array.isArray(imageData) && imageData.length > 0) {
    return imageData[0]?.url || defaultValue;
  }
  if (imageData?.url) return imageData.url;
  return defaultValue;
};

// ==================== FORMATO DE NÚMEROS ====================
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};

// ==================== LOADING SPINNER ====================
const LoadingSpinner = () => (
  <div className="channel-loading">
    <div className="loading-spinner">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
    <p>Cargando canal...</p>
  </div>
);

// ==================== AVATAR COMPONENTE PROFESIONAL ====================
const AvatarWithFallback = ({ src, alt, className, name, onClick, size = 'large' }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getImageUrl(src);

  if (imgError || !avatarUrl) {
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
          fontSize: size === 'large' ? '48px' : '32px',
          fontWeight: 'bold',
          color: '#fff',
          cursor: onClick ? 'pointer' : 'default'
        }}
      >
        {name ? name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUserCircle} />}
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', objectFit: 'cover' }}
    />
  );
};

// ==================== BANNER COMPONENTE PROFESIONAL ====================
const ChannelBanner = ({ cover, channelName, planColor, onBack, onMessage, isOwner, onEdit, onShare, onContact, onDelete, onReport, onBlock }) => {
  const [bannerError, setBannerError] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const coverUrl = getImageUrl(cover);

  const handleMenuToggle = () => setMenuOpen(!menuOpen);

  const BannerOverlay = () => (
    <div className="channel-banner-header">
      <button className="channel-banner-back-btn" onClick={onBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      
      <h2 className="channel-banner-title">{channelName}</h2>
      
      <div className="channel-banner-actions">
        {isOwner && (
          <button className="channel-banner-message-btn" onClick={onMessage}>
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
        )}
        
        <div className="channel-three-dots-wrapper">
          <button className="channel-banner-menu-btn" onClick={handleMenuToggle}>
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
          
          {menuOpen && (
            <div className="channel-profile-menu">
              {isOwner ? (
                <>
                  <button onClick={onEdit}><FontAwesomeIcon icon={faEdit} /> Modifier</button>
                  <button onClick={onContact}><FontAwesomeIcon icon={faInfoCircle} /> Contact</button>
                  <button onClick={onShare}><FontAwesomeIcon icon={faShare} /> Partager</button>
                  <button onClick={onDelete} className="delete"><FontAwesomeIcon icon={faTrashAlt} /> Supprimer</button>
                </>
              ) : (
                <>
                  <button onClick={onReport}><FontAwesomeIcon icon={faFlag} /> Signaler</button>
                  <button onClick={onBlock}><FontAwesomeIcon icon={faBan} /> Bloquer</button>
                  <button onClick={onMessage}><FontAwesomeIcon icon={faEnvelope} /> Message</button>
                  <button onClick={onShare}><FontAwesomeIcon icon={faShare} /> Partager</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (bannerError || !coverUrl) {
    return (
      <div className="channel-banner-container">
        <div className="channel-banner-placeholder" style={{
          background: `linear-gradient(135deg, ${planColor || '#fe2c55'}, ${planColor ? planColor + 'cc' : '#ff9800'})`
        }}>
          <BannerOverlay />
          <FontAwesomeIcon icon={faImage} size="3x" style={{ opacity: 0.7 }} />
          <span>{channelName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="channel-banner-container">
      {!bannerLoaded && <div className="channel-banner-skeleton"><div className="skeleton-shimmer" /></div>}
      <img 
        src={coverUrl} 
        alt={channelName} 
        className="channel-banner"
        style={{ display: bannerLoaded ? 'block' : 'none' }}
        onLoad={() => setBannerLoaded(true)}
        onError={() => setBannerError(true)}
      />
      <BannerOverlay />
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const ChannelProfile = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const { planName, planLimits, canUploadVideo, planColor } = useUserPlan();
  
  const { channel, loading, videos = [], hasMore = false, totalVideos = 0, error } = useSelector(state => state.channel);
  const { savedVideos = [], likedVideos = [] } = useSelector(state => state.userVideo);

  const [activeTab, setActiveTab] = useState('videos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportDescription, setReportDescription] = useState('');

  const isOwner = auth.user?._id && channel?.owner?._id && 
    auth.user._id.toString() === channel.owner._id.toString();
  
  const currentVideoCount = videos.length;
  const maxVideos = planLimits?.maxVideos || 5;
  const canUploadMore = canUploadVideo(currentVideoCount);

  // ==================== EFECTOS ====================
  useEffect(() => {
    if (!channelId) return;

    const loadChannelData = async () => {
      try {
        await dispatch(getChannelProfile(channelId, auth?.token));
        await dispatch(getChannelVideos(channelId, 1, 12, auth?.token));
      } catch (err) {
        console.error('Error loading channel:', err);
      }
    };

    loadChannelData();

    return () => {
      if (clearChannelState) dispatch(clearChannelState());
      dispatch({ type: CLEAR_CHANNEL });
    };
  }, [dispatch, channelId, auth?.token]);

  useEffect(() => {
    if (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: typeof error === 'string' ? error : 'Error al cargar el canal' } });
    }
  }, [error, dispatch]);

  // ==================== HANDLERS ====================
  const handleBack = () => history.goBack();
  const handleMessage = () => history.push(`/message/${channel?.owner?._id}`);
  const handleEditProfile = () => history.push(`/channel/${channelId}/edit`);
  const handleAvatarClick = () => { if (isOwner) handleEditProfile(); };
  
  const handleShareProfile = () => {
    const url = `${window.location.origin}/channel/${channelId}`;
    if (navigator.share) {
      navigator.share({ title: `Canal de ${channel?.name}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: "Lien copié dans le presse-papier" } });
    }
  };

  const handleFollow = useCallback(async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    const result = await dispatch(toggleFollowChannel(channelId, auth.token, auth));
    if (result?.success && channel) {
      const updatedChannel = { ...channel, isFollowing: result.isFollowing, followersCount: result.followersCount };
      dispatch({ type: 'GET_CHANNEL_PROFILE_SUCCESS', payload: updatedChannel });
    }
  }, [channelId, auth.token, history, dispatch, auth, channel]);

  const handleSaveVideo = useCallback(async (videoId) => {
    if (!auth.token) {
      history.push('/login');
      return false;
    }
    const result = await dispatch(toggleSaveVideo(videoId, auth.token));
    return result?.success || false;
  }, [auth.token, history, dispatch]);

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem('returnToChannel', 'true');
    sessionStorage.setItem('channelScrollPosition', window.scrollY.toString());
    history.push(`/video/channelFeed/${channelId}?startVideo=${videoId}`);
  };

  const handleUploadVideo = () => {
    if (!canUploadMore) {
      setShowPlanInfo(true);
      setTimeout(() => setShowPlanInfo(false), 5000);
      return;
    }
    history.push(`/create-video-page?channelId=${channelId}`);
  };

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === 'saved' && auth?.token && savedVideos.length === 0) {
      dispatch(getSavedVideos(1, 20, auth.token));
    }
    if (tab === 'liked' && auth?.token && likedVideos.length === 0) {
      dispatch(getLikedVideos(1, 20, auth.token));
    }
  }, [auth?.token, dispatch, savedVideos.length, likedVideos.length]);

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await dispatch(getChannelVideos(channelId, nextPage, 12, auth?.token));
    setCurrentPage(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, currentPage, dispatch, channelId, auth?.token]);

  const getCurrentVideos = () => {
    if (activeTab === 'videos') return videos;
    if (activeTab === 'saved') return savedVideos;
    if (activeTab === 'liked') return likedVideos;
    return [];
  };

  const getCurrentHasMore = () => activeTab === 'videos' ? hasMore : false;
  const getCurrentTotal = () => {
    if (activeTab === 'videos') return totalVideos;
    if (activeTab === 'saved') return savedVideos.length;
    if (activeTab === 'liked') return likedVideos.length;
    return 0;
  };

  // ==================== RENDER ====================
  if (loading && !channel) return <LoadingSpinner />;
  
  if (!channel || error) {
    return (
      <div className="channel-error">
        <h2>Canal non trouvé</h2>
        <p>{error || "Le canal que vous recherchez n'existe pas ou a été supprimé."}</p>
        <button onClick={() => history.push('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="channel-profile-page">
      {/* BANNER */}
      <ChannelBanner 
        cover={channel.cover}
        channelName={channel.name}
        planColor={planColor}
        onBack={handleBack}
        onMessage={handleMessage}
        isOwner={isOwner}
        onEdit={handleEditProfile}
        onShare={handleShareProfile}
        onContact={() => setShowContactInfo(!showContactInfo)}
        onDelete={() => setShowDeleteConfirm(true)}
        onReport={() => setShowReportModal(true)}
        onBlock={() => {}}
      />

      {/* AVATAR */}
      <div className="channel-avatar-container">
        <AvatarWithFallback 
          src={channel.avatar}
          alt={channel.name} 
          name={channel.name} 
          className={`channel-avatar ${isOwner ? 'owner-avatar clickable' : ''}`}
          onClick={handleAvatarClick}
          size="large"
        />
        {isOwner && (
          <div className="avatar-edit-badge" onClick={handleEditProfile}>
            <FontAwesomeIcon icon={faEdit} size="12px" />
          </div>
        )}
      </div>

      {/* INFO DEL CANAL */}
      <div className="channel-info-section">
        <h1 className="channel-name">{channel.name}</h1>
        
        <div className="channel-meta">
          <span className="channel-handle">@{channel.slug || channel.name.toLowerCase().replace(/\s/g, '')}</span>
          {channel.isVerified && (
            <span className="verified-badge">
              <FontAwesomeIcon icon={faCheck} /> Vérifié
            </span>
          )}
        </div>

        {channel.description && <p className="channel-description">{channel.description}</p>}

        {/* STATS */}
        <div className="channel-stats">
          <div className="stat-item">
            <span className="stat-value">{formatNumber(channel.totalVideos || 0)}</span>
            <span className="stat-label">vidéos</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{formatNumber(channel.totalViews || 0)}</span>
            <span className="stat-label">vues</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{formatNumber(channel.totalLikes || 0)}</span>
            <span className="stat-label">likes</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-value">{formatNumber(channel.followersCount || 0)}</span>
            <span className="stat-label">abonnés</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="channel-actions">
          {!isOwner ? (
            <>
              <button className={`btn-follow ${channel.isFollowing ? 'following' : ''}`} onClick={handleFollow}>
                <FontAwesomeIcon icon={channel.isFollowing ? faCheck : faUserPlus} />
                <span>{channel.isFollowing ? 'Abonné' : "S'abonner"}</span>
              </button>
              <button className="btn-message" onClick={handleMessage}>
                <FontAwesomeIcon icon={faEnvelope} /> Message
              </button>
            </>
          ) : (
            <button className="btn-upload" onClick={handleUploadVideo} disabled={!canUploadMore}>
              <FontAwesomeIcon icon={faVideo} /> Mettre en ligne
              {!canUploadMore && <span className="upload-limit">Limite atteinte</span>}
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="channel-tabs-container">
        <div className="channel-tabs">
          <button className={`tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => handleTabChange('videos')}>
            <FontAwesomeIcon icon={faFilm} /> Vidéos
            {totalVideos > 0 && <span className="tab-count">{totalVideos}</span>}
          </button>
          
          {isOwner && auth.token && (
            <>
              <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => handleTabChange('saved')}>
                <FontAwesomeIcon icon={faBookmark} /> Enregistrés
                {savedVideos.length > 0 && <span className="tab-count">{savedVideos.length}</span>}
              </button>
              <button className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => handleTabChange('liked')}>
                <FontAwesomeIcon icon={faHeart} /> J'aime
                {likedVideos.length > 0 && <span className="tab-count">{likedVideos.length}</span>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* VIDEOS GRID */}
      <div className="videos-grid">
        {getCurrentVideos().map(video => (
          <VideoCardVertical key={video._id} video={video} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {getCurrentVideos().length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">
            <FontAwesomeIcon icon={activeTab === 'videos' ? faFilm : activeTab === 'saved' ? faBookmark : faHeart} />
          </div>
          <h3>Aucune vidéo</h3>
          <p>
            {activeTab === 'videos' && isOwner 
              ? 'Commencez à partager vos premières vidéos commerciales !' 
              : activeTab === 'videos' 
              ? 'Aucune vidéo disponible sur ce canal.'
              : 'Aucune vidéo dans cette liste.'}
          </p>
          {activeTab === 'videos' && isOwner && (
            <button className="btn-upload-empty" onClick={handleUploadVideo}>
              <FontAwesomeIcon icon={faVideo} /> Mettre en ligne
            </button>
          )}
        </div>
      )}

      {/* LOAD MORE */}
      {getCurrentHasMore() && getCurrentVideos().length > 0 && (
        <LoadMoreBtn loading={loadingMore} loadMore={loadMoreVideos} />
      )}
      
      <HeaderVideo />

      {/* MODAL REPORT */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faFlag} /> Signaler ce canal</h3>
              <button onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Pourquoi signalez-vous <strong>{channel?.name}</strong> ?</p>
              <textarea 
                placeholder="Décrivez le problème..." 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)} 
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowReportModal(false)}>Annuler</button>
              <button className="btn-submit" onClick={() => {
                setShowReportModal(false);
                dispatch({ type: GLOBALTYPES.ALERT, payload: { success: "Signalement envoyé" } });
              }}>Envoyer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelProfile;