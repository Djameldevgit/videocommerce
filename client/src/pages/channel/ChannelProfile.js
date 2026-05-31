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
  faFlag, faBan, faEdit, faImage,
  faVideo, faEye, faThumbsUp,
  faExclamationTriangle, faClock, faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

import { 
  toggleFollowChannel, 
  getChannelVideos,
  clearChannelState,
  getChannelProfile,
  reportChannel,
  blockChannel,
  registerChannelShare,
  getChannelContact
} from '../../redux/actions/channelAction';
import { toggleSaveVideo, getSavedVideos, getLikedVideos } from '../../redux/actions/userVideoAction';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import VideoCardVertical from '../../components/VideoCardVertical';
import './ChannelProfile.css';
import HeaderVideo from '../HeaderVideo';
import useUserPlan from '../../components/useUserPlan';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { CHANNEL_TYPES } from '../../redux/actions/channelAction';

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

// ==================== FUNCIÓN PARA OBTENER TOKEN CORRECTAMENTE ====================
const getAuthToken = (auth) => {
  if (!auth) return null;
  
  if (typeof auth.token === 'string' && auth.token) {
    return auth.token;
  }
  
  if (typeof auth.token === 'object' && auth.token !== null) {
    return auth.token.token || auth.token.access_token || null;
  }
  
  const localToken = localStorage.getItem('access_token') || 
                     localStorage.getItem('token') ||
                     (() => {
                       try {
                         const authStore = localStorage.getItem('auth');
                         if (authStore) {
                           const parsed = JSON.parse(authStore);
                           return parsed.token || parsed.access_token;
                         }
                       } catch (e) {
                         return null;
                       }
                       return null;
                     })();
  
  if (localToken) return localToken;
  
  return null;
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
const ChannelBanner = ({ 
  cover, channelName, planColor, onBack, onMessage, isOwner, 
  onEdit, onShare, onContact, onReport, onBlock 
}) => {
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
                  <button onClick={onEdit}>
                    <FontAwesomeIcon icon={faEdit} /> Modifier
                  </button>
                  <button onClick={onContact}>
                    <FontAwesomeIcon icon={faInfoCircle} /> Contact
                  </button>
                  <button onClick={onShare}>
                    <FontAwesomeIcon icon={faShare} /> Partager
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onReport}>
                    <FontAwesomeIcon icon={faFlag} /> Signaler
                  </button>
                  <button onClick={onBlock}>
                    <FontAwesomeIcon icon={faBan} /> Bloquer
                  </button>
                  <button onClick={onMessage}>
                    <FontAwesomeIcon icon={faEnvelope} /> Message
                  </button>
                  <button onClick={onShare}>
                    <FontAwesomeIcon icon={faShare} /> Partager
                  </button>
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
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [contactInfo, setContactInfo] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const isOwner = auth.user?._id && channel?.owner?._id && 
    auth.user._id.toString() === channel.owner._id.toString();
  
  // ✅ Verificar si el canal está pendiente de aprobación
  const isPending = channel?.pending === true;
  
  const currentVideoCount = videos.length;
  const maxVideos = planLimits?.maxVideos || 5;
  const canUploadMore = canUploadVideo(currentVideoCount);

  // ==================== OBTENER TOKEN CORRECTAMENTE ====================
  const token = getAuthToken(auth);

  // ==================== EFECTOS ====================
  useEffect(() => {
    if (!channelId) return;

    const loadChannelData = async () => {
      try {
        await dispatch(getChannelProfile(channelId, token));
        await dispatch(getChannelVideos(channelId, 1, 12, token));
      } catch (err) {
        console.error('Error loading channel:', err);
      }
    };

    loadChannelData();

    return () => {
      if (clearChannelState) dispatch(clearChannelState());
      dispatch({ type: CLEAR_CHANNEL });
    };
  }, [dispatch, channelId, token]);

  useEffect(() => {
    if (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: typeof error === 'string' ? error : 'Error al cargar el canal' } });
    }
  }, [error, dispatch]);

  // ==================== HANDLERS DEL DROPDOWN ====================
  
  // 1. Volver atrás
  const handleBack = () => history.goBack();
  
  // 2. Enviar mensaje al dueño del canal
  const handleMessage = () => {
    if (!token) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Connectez-vous pour envoyer un message" } });
      history.push('/login');
      return;
    }
    history.push(`/message/${channel?.owner?._id}`);
  };
  
  // 3. Editar perfil (solo dueño)
  const handleEditProfile = () => history.push(`/channel/${channelId}/edit`);
  const handleAvatarClick = () => { if (isOwner) handleEditProfile(); };
  
  // 4. Compartir canal (con analytics)
  const handleShareProfile = async () => {
    const url = `${window.location.origin}/channel/${channelId}`;
    
    if (token) {
      await dispatch(registerChannelShare(channelId, { token }));
    }
    
    if (navigator.share) {
      try {
        await navigator.share({ 
          title: `Canal de ${channel?.name}`, 
          text: `Découvrez le canal ${channel?.name} sur notre plateforme !`,
          url 
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Error sharing:', err);
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: "Lien copié dans le presse-papier !" } });
    }
  };

  // 5. Ver información de contacto (requiere auth)
  const handleContact = async () => {
    if (!token) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Connectez-vous pour voir les informations de contact" } });
      history.push('/login');
      return;
    }
    
    if (!showContactInfo) {
      const result = await dispatch(getChannelContact(channelId, { token }));
      if (result.success) {
        setContactInfo(result.contact);
        setShowContactInfo(true);
      }
    } else {
      setShowContactInfo(false);
      setContactInfo(null);
    }
  };

  // 6. Reportar canal (usuarios externos)
  const handleReportChannel = async () => {
    if (!token) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Connectez-vous pour signaler" } });
      history.push('/login');
      return;
    }
    
    if (!reportReason) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Veuillez sélectionner une raison" } });
      return;
    }
    
    const reportData = {
      reason: reportReason,
      description: reportDescription
    };
    
    const result = await dispatch(reportChannel(channelId, reportData, { token }));
    if (result.success) {
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    }
  };

  // 7. Bloquear/Desbloquear canal (usuarios externos)
  const handleBlockChannel = async () => {
    if (!token) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Connectez-vous pour bloquer" } });
      history.push('/login');
      return;
    }
    
    const confirmBlock = window.confirm(
      isBlocked 
        ? `Voulez-vous débloquer le canal "${channel?.name}" ?`
        : `⚠️ Êtes-vous sûr de vouloir bloquer le canal "${channel?.name}" ?\n\nVous ne verrez plus son contenu.`
    );
    
    if (!confirmBlock) return;
    
    const result = await dispatch(blockChannel(channelId, { token }));
    if (result.success) {
      setIsBlocked(result.isBlocked);
      if (result.isBlocked) {
        setTimeout(() => {
          history.push('/');
        }, 1500);
      }
    }
  };

  // 8. Seguir canal
  const handleFollow = useCallback(async () => {
    if (!token) {
      history.push('/login');
      return;
    }
    const result = await dispatch(toggleFollowChannel(channelId, { token, user: auth.user }, null));
    if (result?.success && channel) {
      const updatedChannel = { ...channel, isFollowing: result.isFollowing, followersCount: result.followersCount };
      dispatch({ type: 'GET_CHANNEL_PROFILE_SUCCESS', payload: updatedChannel });
    }
  }, [channelId, token, auth.user, history, dispatch, channel]);

  // 9. Guardar video
  const handleSaveVideo = useCallback(async (videoId) => {
    if (!token) {
      history.push('/login');
      return false;
    }
    const result = await dispatch(toggleSaveVideo(videoId, token));
    return result?.success || false;
  }, [token, history, dispatch]);

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
    if (tab === 'saved' && token && savedVideos.length === 0) {
      dispatch(getSavedVideos(1, 20, token));
    }
    if (tab === 'liked' && token && likedVideos.length === 0) {
      dispatch(getLikedVideos(1, 20, token));
    }
  }, [token, dispatch, savedVideos.length, likedVideos.length]);

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await dispatch(getChannelVideos(channelId, nextPage, 12, token));
    setCurrentPage(nextPage);
    setLoadingMore(false);
  }, [loadingMore, hasMore, currentPage, dispatch, channelId, token]);

  const getCurrentVideos = () => {
    if (activeTab === 'videos') return videos;
    if (activeTab === 'saved') return savedVideos;
    if (activeTab === 'liked') return likedVideos;
    return [];
  };

  const getCurrentHasMore = () => activeTab === 'videos' ? hasMore : false;

  // ✅ Renderizar mensaje de canal pendiente
  const renderPendingAlert = () => {
    if (!isPending || !isOwner) return null;
    
    return (
      <div className="pending-alert-container">
        <div className="pending-alert-icon">
          <FontAwesomeIcon icon={faHourglassHalf} />
        </div>
        <div className="pending-alert-content">
          <h4>⏳ Canal en attente d'approbation</h4>
          <p>
            Votre canal <strong>"{channel?.name}"</strong> a été créé avec succès et est actuellement en cours de vérification par nos administrateurs.
          </p>
          <p>
            Une fois approuvé, il sera visible par tous les utilisateurs. Vous serez notifié dès que son statut changera.
          </p>
          <div className="pending-alert-info">
            <FontAwesomeIcon icon={faClock} className="me-1" />
            <small>Temps d'attente estimé : 24 à 48 heures ouvrées</small>
          </div>
        </div>
      </div>
    );
  };

  // Si el canal está bloqueado por el usuario
  if (isBlocked) {
    return (
      <div className="channel-blocked">
        <div className="blocked-content">
          <FontAwesomeIcon icon={faBan} size="4x" />
          <h2>Canal bloqué</h2>
          <p>Vous avez bloqué ce canal. Vous ne verrez plus son contenu.</p>
          <button onClick={handleBlockChannel} className="btn-unblock">
            Débloquer le canal
          </button>
          <button onClick={() => history.push('/')} className="btn-back-home">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

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
        onContact={handleContact}
        onReport={() => setShowReportModal(true)}
        onBlock={handleBlockChannel}
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

      {/* ✅ MENSAJE DE CANAL PENDIENTE (SOLO PARA EL DUEÑO) */}
      {renderPendingAlert()}

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

        {/* CONTACT INFO MODAL */}
        {showContactInfo && contactInfo && (
          <div className="contact-info-modal">
            <div className="contact-info-header">
              <h4><FontAwesomeIcon icon={faInfoCircle} /> Informations de contact</h4>
              <button onClick={() => setShowContactInfo(false)}>✕</button>
            </div>
            <div className="contact-info-body">
              {contactInfo.email && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faEnvelopeSolid} />
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              )}
              {contactInfo.phone && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} />
                  <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
                </div>
              )}
              {contactInfo.website && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faGlobe} />
                  <a href={contactInfo.website} target="_blank" rel="noopener noreferrer">{contactInfo.website}</a>
                </div>
              )}
              {contactInfo.location?.wilaya && (
                <div className="contact-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{contactInfo.location.wilaya}{contactInfo.location.commune ? `, ${contactInfo.location.commune}` : ''}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
          
          {isOwner && token && (
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

      {/* PLAN LIMIT ALERT */}
      {showPlanInfo && (
        <div className="plan-limit-toast">
          <div className="toast-content">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <div>
              <strong>Limite de téléchargement atteinte</strong>
              <p>Votre plan {planName} permet maximum {maxVideos} vidéos. Passez à un plan supérieur.</p>
            </div>
            <button onClick={() => setShowPlanInfo(false)}>✕</button>
          </div>
        </div>
      )}

      {/* MODAL REPORT - Solo para usuarios externos */}
      {showReportModal && !isOwner && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FontAwesomeIcon icon={faFlag} /> Signaler ce canal</h3>
              <button onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Pourquoi signalez-vous <strong>{channel?.name}</strong> ?</p>
              <select 
                value={reportReason} 
                onChange={(e) => setReportReason(e.target.value)}
                className="report-select"
              >
                <option value="">Sélectionnez une raison...</option>
                <option value="spam">Spam ou contenu trompeur</option>
                <option value="harassment">Harcèlement ou intimidation</option>
                <option value="inappropriate">Contenu inapproprié</option>
                <option value="violence">Violence ou incitation à la haine</option>
                <option value="copyright">Violation des droits d'auteur</option>
                <option value="other">Autre raison</option>
              </select>
              <textarea 
                placeholder="Détails supplémentaires (optionnel)..." 
                value={reportDescription} 
                onChange={(e) => setReportDescription(e.target.value)} 
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowReportModal(false)}>Annuler</button>
              <button className="btn-submit" onClick={handleReportChannel}>Envoyer le signalement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelProfile;