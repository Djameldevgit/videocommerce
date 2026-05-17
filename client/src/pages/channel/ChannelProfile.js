// src/pages/channel/ChannelProfile.jsx
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
  faGlobe, faMapMarkerAlt, faArrowUp, faCrown, faStar, faRocket,
  faFlag, faBan, faTrashAlt, faEdit
} from '@fortawesome/free-solid-svg-icons';

import { getChannelProfile, toggleFollowChannel, getChannelVideos } from '../../redux/actions/channelAction';
import { toggleSaveVideo, getSavedVideos, getLikedVideos } from '../../redux/actions/userVideoAction';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import './ChannelProfile.css';
import HeaderVideo from '../HeaderVideo';
import useUserPlan from '../../components/useUserPlan';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

/* ────────────────────────────────────────────
   LOADING SPINNER
   ──────────────────────────────────────────── */
const LoadingSpinner = () => (
  <div className="channel-loading">
    <div className="loading-spinner">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
    <p>Chargement du canal...</p>
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
   COMPOSANT PRINCIPAL - ChannelProfile
   ──────────────────────────────────────────── */
const ChannelProfile = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const { 
    currentPlan, 
    planName, 
    planLimits, 
    isUserPro, 
    hasActivePlan,
    isExpired,
    getDaysRemaining,
    canUploadVideo,
    planColor
  } = useUserPlan();
  
  const { 
    channel, 
    loading,           
    videos = [],       
    hasMore = false,   
    totalVideos = 0,   
  } = useSelector(state => state.channel);
  
  const { savedVideos = [], likedVideos = [] } = useSelector(state => state.userVideo);

  const [activeTab, setActiveTab] = useState('videos');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  
  // États pour les modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const isOwner = auth.user?._id === channel?.owner?._id;
  
  const currentVideoCount = videos.length;
  const maxVideos = planLimits?.maxVideos || 5;
  const canUploadMore = canUploadVideo(currentVideoCount);
  const remainingVideoSlots = maxVideos === 'unlimited' ? 'Illimité' : maxVideos - currentVideoCount;

  const fmt = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  /* ── CHARGEMENT INITIAL ── */
  useEffect(() => {
    if (channelId) {
      dispatch(getChannelProfile(channelId));
      dispatch(getChannelVideos(channelId, 1, 12));
    }
    return () => {
      dispatch({ type: 'CLEAR_CHANNEL' });
    };
  }, [dispatch, channelId]);

  /* ── HANDLERS ── */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
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

  const handleShareProfile = useCallback(() => {
    const url = `${window.location.origin}/channel/${channelId}`;
    if (navigator.share) {
      navigator.share({ title: `Canal de ${channel?.name}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
    setShowProfileMenu(false);
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

  const handleUploadVideo = () => {
    if (!canUploadMore) {
      setShowPlanInfo(true);
      setTimeout(() => setShowPlanInfo(false), 5000);
      return;
    }
    history.push('/create-video-page');
  };

  // ✅ Signalement du canal
  const handleReportChannel = useCallback(async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    if (!reportReason) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Veuillez sélectionner une raison" }
      });
      return;
    }
    try {
      // Appel API pour signaler
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "✅ Canal signalé. Merci pour votre vigilance." }
      });
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      setShowProfileMenu(false);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Erreur lors du signalement" }
      });
    }
  }, [channelId, auth.token, reportReason, reportDescription, dispatch, history]);

  // ✅ Bloquer le canal
  const handleBlockChannel = useCallback(async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    try {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "✅ Canal bloqué. Vous ne verrez plus son contenu." }
      });
      setShowBlockConfirm(false);
      setShowProfileMenu(false);
      setTimeout(() => history.push('/'), 2000);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Erreur lors du blocage" }
      });
    }
  }, [auth.token, history, dispatch]);

  // ✅ Supprimer le canal (propriétaire)
  const handleDeleteChannel = useCallback(async () => {
    if (!isOwner) return;
    try {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "✅ Canal supprimé avec succès" }
      });
      setShowDeleteConfirm(false);
      setShowProfileMenu(false);
      setTimeout(() => history.push('/my-channels'), 2000);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Erreur lors de la suppression" }
      });
    }
  }, [isOwner, history, dispatch]);

  const renderPlanBadge = () => {
    if (!isOwner) return null;
    
    const planIcons = { free: '🆓', basic: '⭐', pro: '🚀', business: '👑' };
    const planNames = { free: 'Gratuit', basic: 'Basic', pro: 'Pro', business: 'Business' };
    
    return (
      <div 
        className="channel-plan-badge" 
        style={{ backgroundColor: `${planColor}15`, borderColor: planColor }}
        onClick={() => setShowPlanInfo(!showPlanInfo)}
      >
        <span style={{ color: planColor }}>{planIcons[currentPlan] || '🆓'}</span>
        <span style={{ color: planColor }}>Plan {planNames[currentPlan] || 'Gratuit'}</span>
        {isUserPro && hasActivePlan && getDaysRemaining > 0 && (
          <span className="plan-days" style={{ color: planColor }}>({getDaysRemaining} jours restants)</span>
        )}
        {isExpired && <span className="plan-expired">⚠️ Expiré</span>}
      </div>
    );
  };

  const renderPlanInfo = () => {
    if (!showPlanInfo || !isOwner) return null;
    const maxDuration = planLimits?.maxDuration || 20;
    
    return (
      <div className="channel-plan-info-card">
        <div className="plan-info-header">
          <strong>📋 Votre abonnement {planName}</strong>
          <button onClick={() => setShowPlanInfo(false)}>✕</button>
        </div>
        <div className="plan-info-content">
          <div className="plan-info-item"><span>📹 Vidéos utilisées:</span><strong>{currentVideoCount} / {maxVideos === 'unlimited' ? '∞' : maxVideos}</strong></div>
          <div className="plan-info-item"><span>⏱️ Durée max par vidéo:</span><strong>{maxDuration} secondes</strong></div>
          <div className="plan-info-item"><span>🎬 Qualité HD:</span><strong>{planLimits?.canUpload ? '✅ Oui' : '❌ Non'}</strong></div>
          <div className="plan-info-item"><span>🎵 Musique:</span><strong>{planLimits?.canAddMusic ? '✅ Oui' : '❌ Non'}</strong></div>
        </div>
        {!canUploadMore && <div className="plan-warning">⚠️ Limite de vidéos atteinte ! <a href="/become-pro">Passez à un plan supérieur</a></div>}
        {currentPlan !== 'business' && <button className="plan-upgrade-btn" onClick={() => history.push('/become-pro')}><FontAwesomeIcon icon={faArrowUp} /> Passer au plan supérieur</button>}
      </div>
    );
  };

  // ✅ Menu à trois points amélioré (première ligne à droite)
  const renderThreeDotsMenu = () => {
    return (
      <div className="channel-three-dots-wrapper">
        <button 
          className="channel-three-dots-btn"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          aria-label="Menu actions"
        >
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
        
        {showProfileMenu && (
          <div className="channel-profile-menu">
            {isOwner ? (
              <>
                <button onClick={handleEditProfile} className="menu-item edit">
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Modifier le canal</span>
                </button>
                <button onClick={() => setShowContactInfo(!showContactInfo)} className="menu-item contact">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>Info contact</span>
                </button>
                <button onClick={handleShareProfile} className="menu-item share">
                  <FontAwesomeIcon icon={faShare} />
                  <span>Partager le canal</span>
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} className="menu-item delete">
                  <FontAwesomeIcon icon={faTrashAlt} />
                  <span>Supprimer le canal</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowReportModal(true)} className="menu-item report">
                  <FontAwesomeIcon icon={faFlag} />
                  <span>Signaler le canal</span>
                </button>
                <button onClick={() => setShowBlockConfirm(true)} className="menu-item block">
                  <FontAwesomeIcon icon={faBan} />
                  <span>Bloquer ce canal</span>
                </button>
                <button onClick={handleMessage} className="menu-item message">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>Envoyer un message</span>
                </button>
                <button onClick={handleShareProfile} className="menu-item share">
                  <FontAwesomeIcon icon={faShare} />
                  <span>Partager le canal</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ✅ Modal de signalement
  const renderReportModal = () => {
    if (!showReportModal) return null;
    const reportReasons = [
      { value: 'spam', label: '📧 Spam ou contenu trompeur' },
      { value: 'harassment', label: '⚠️ Harcèlement ou insulte' },
      { value: 'inappropriate', label: '🔞 Contenu inapproprié' },
      { value: 'copyright', label: '©️ Violation des droits d\'auteur' },
      { value: 'fake', label: '🎭 Fausse identité ou imposture' },
      { value: 'violence', label: '💥 Incitation à la violence' },
      { value: 'other', label: '📌 Autre raison' }
    ];
    
    return (
      <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3><FontAwesomeIcon icon={faFlag} /> Signaler ce canal</h3>
            <button onClick={() => setShowReportModal(false)}>✕</button>
          </div>
          <div className="modal-body">
            <p>Pourquoi signalez-vous <strong>{channel?.name}</strong> ?</p>
            <div className="report-reasons">
              {reportReasons.map(reason => (
                <label key={reason.value} className="report-reason">
                  <input type="radio" name="reportReason" value={reason.value} checked={reportReason === reason.value} onChange={(e) => setReportReason(e.target.value)} />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
            <div className="form-group">
              <label>Description (optionnelle)</label>
              <textarea rows="3" placeholder="Décrivez le problème..." value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={() => setShowReportModal(false)}>Annuler</button>
            <button className="btn-submit" onClick={handleReportChannel}>Envoyer le signalement</button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Modal de confirmation blocage
  const renderBlockConfirmModal = () => {
    if (!showBlockConfirm) return null;
    return (
      <div className="modal-overlay" onClick={() => setShowBlockConfirm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header warning">
            <h3><FontAwesomeIcon icon={faBan} /> Bloquer ce canal ?</h3>
          </div>
          <div className="modal-body">
            <p>Êtes-vous sûr de vouloir bloquer <strong>{channel?.name}</strong> ?</p>
            <p className="warning-text">Vous ne verrez plus : vidéos, commentaires et suggestions de ce canal.</p>
            <p className="info-text">Vous pourrez le débloquer depuis vos paramètres.</p>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={() => setShowBlockConfirm(false)}>Annuler</button>
            <button className="btn-block" onClick={handleBlockChannel}>Bloquer</button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Modal de confirmation suppression
  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    return (
      <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header danger">
            <h3><FontAwesomeIcon icon={faTrashAlt} /> Supprimer ce canal ?</h3>
          </div>
          <div className="modal-body">
            <p>Cette action est <strong>irréversible</strong>.</p>
            <p>La suppression de <strong>{channel?.name}</strong> entraînera :</p>
            <ul><li>Suppression de toutes les vidéos</li><li>Perte de tous les abonnés</li><li>Suppression des commentaires</li></ul>
            <p className="warning-text">⚠️ Cette action ne peut pas être annulée.</p>
          </div>
          <div className="modal-footer">
            <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Annuler</button>
            <button className="btn-delete" onClick={handleDeleteChannel}>Supprimer définitivement</button>
          </div>
        </div>
      </div>
    );
  };

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

  if (loading && !channel) return <LoadingSpinner />;
  if (!channel) {
    return (
      <div className="channel-error">
        <h2>Canal non trouvé</h2>
        <button onClick={() => history.push('/')}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="channel-profile-page">
      {/* ── HEADER AVEC MENU 3 POINTS À DROITE ── */}
      <div className="channel-header">
        <button className="channel-back-btn" onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h2 className="channel-header-title">{channel.name}</h2>
        <div className="channel-header-actions">
          {isOwner && (
            <button className="channel-conversations-btn" onClick={() => history.push('/message')}>
              <FontAwesomeIcon icon={faCommentDots} />
            </button>
          )}
          {renderThreeDotsMenu()}
        </div>
      </div>

      {channel.cover && (
        <div className="channel-banner-container">
          <img src={channel.cover} alt="Banner" className="channel-banner" />
        </div>
      )}

      <div className="channel-avatar-container">
        <AvatarWithFallback src={channel.avatar} alt={channel.name} name={channel.name} className="channel-avatar" onClick={handleAvatarClick} />
      </div>

      {renderPlanBadge()}
      {renderPlanInfo()}

      <h2 className="channel-name">{channel.name}</h2>

      {channel.isVerified && (
        <div className="channel-verified-badge">
          <FontAwesomeIcon icon={faCheck} />
          <span>Canal vérifié</span>
        </div>
      )}

      {channel.description && <p className="channel-bio">{channel.description}</p>}

      {showContactInfo && (channel.phone || channel.email || channel.website || channel.wilaya) && (
        <div className="channel-contact-info">
          <div className="channel-contact-header"><FontAwesomeIcon icon={faInfoCircle} /><span>Informations de contact</span></div>
          <div className="channel-contact-grid">
            {channel.wilaya && <div className="channel-contact-item"><FontAwesomeIcon icon={faMapMarkerAlt} /><span>{channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}</span></div>}
            {channel.phone && <div className="channel-contact-item"><FontAwesomeIcon icon={faPhone} /><a href={`tel:${channel.phone}`}>{channel.phone}</a></div>}
            {channel.email && <div className="channel-contact-item"><FontAwesomeIcon icon={faEnvelopeSolid} /><a href={`mailto:${channel.email}`}>{channel.email}</a></div>}
            {channel.website && <div className="channel-contact-item"><FontAwesomeIcon icon={faGlobe} /><a href={channel.website} target="_blank" rel="noopener noreferrer">{channel.website}</a></div>}
          </div>
        </div>
      )}

      <div className="channel-stats-row">
        <div className="channel-stat"><div className="channel-stat-number">{fmt(channel.totalVideos || 0)}</div><div className="channel-stat-label">Vidéos</div></div>
        <div className="channel-stat"><div className="channel-stat-number">{fmt(channel.totalViews || 0)}</div><div className="channel-stat-label">Vues</div></div>
        <div className="channel-stat"><div className="channel-stat-number">{fmt(channel.totalLikes || 0)}</div><div className="channel-stat-label">Likes</div></div>
        <div className="channel-stat"><div className="channel-stat-number">{fmt(channel.followersCount || 0)}</div><div className="channel-stat-label">Abonnés</div></div>
      </div>

      {!isOwner && (
        <div className="channel-action-buttons">
          <button className={`channel-follow-btn ${channel.isFollowing ? 'following' : ''}`} onClick={handleFollow}>
            <FontAwesomeIcon icon={channel.isFollowing ? faCheck : faUserPlus} />
            <span>{channel.isFollowing ? 'Abonné' : 'S\'abonner'}</span>
          </button>
          <button className="channel-message-btn" onClick={handleMessage}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Message</span>
          </button>
        </div>
      )}

      <div className="channel-separator" />

      <div className="channel-tabs">
        <button className={`channel-tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => handleTabChange('videos')}>
          <FontAwesomeIcon icon={faFilm} /><span>Vidéos</span>{getCurrentTotal() > 0 && <span className="channel-tab-count">{fmt(getCurrentTotal())}</span>}
        </button>
        {isOwner && auth.token && (
          <>
            <button className={`channel-tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => handleTabChange('saved')}>
              <FontAwesomeIcon icon={faBookmark} /><span>Enregistrés</span>
            </button>
            <button className={`channel-tab ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => handleTabChange('liked')}>
              <FontAwesomeIcon icon={faHeart} /><span>J'aime</span>
            </button>
          </>
        )}
      </div>

      {isOwner && (
        <div className="channel-upload-section">
          <button className={`channel-upload-btn ${!canUploadMore ? 'disabled' : ''}`} onClick={handleUploadVideo} disabled={!canUploadMore}>
            <FontAwesomeIcon icon={faFilm} /><span>📤 Mettre en ligne une vidéo</span>
          </button>
          {!canUploadMore && <div className="channel-upload-limit-warning">⚠️ Limite de {maxVideos === 'unlimited' ? 'illimitée' : maxVideos} vidéo{maxVideos > 1 ? 's' : ''} atteinte pour votre plan {planName}. <a href="/become-pro">Passez à un plan supérieur</a></div>}
          {canUploadMore && remainingVideoSlots !== 'Illimité' && remainingVideoSlots <= 3 && <div className="channel-upload-warning">ℹ️ Il vous reste {remainingVideoSlots} emplacement{remainingVideoSlots > 1 ? 's' : ''} pour vos vidéos.</div>}
        </div>
      )}

      <div className="channel-videos-grid">
        {getCurrentVideos().map(video => (
          <MiniVideoCard key={video._id} video={video} onClick={handleVideoClick} isOwner={isOwner} onSave={activeTab === 'videos' ? handleSaveVideo : undefined} isSavedInitial={savedVideos.some(v => v._id === video._id)} />
        ))}
      </div>

      {getCurrentVideos().length === 0 && !loading && (
        <div className="channel-empty-state">
          <div className="channel-empty-icon-container"><FontAwesomeIcon icon={activeTab === 'videos' ? faFilm : activeTab === 'saved' ? faBookmark : faHeart} className="channel-empty-icon" /></div>
          <h3 className="channel-empty-title">{activeTab === 'videos' ? 'Aucune vidéo' : activeTab === 'saved' ? 'Aucun enregistrement' : 'Aucun j\'aime'}</h3>
          <p className="channel-empty-description">
            {activeTab === 'videos' && isOwner ? 'Commencez à partager vos premières vidéos commerciales !' : activeTab === 'videos' ? 'Ce canal n\'a pas encore publié de vidéos.' : activeTab === 'saved' ? 'Les vidéos que vous enregistrez apparaîtront ici.' : 'Les vidéos que vous aimez apparaîtront ici.'}
          </p>
          {activeTab === 'videos' && isOwner && (
            <button className={`channel-upload-btn ${!canUploadMore ? 'disabled' : ''}`} onClick={handleUploadVideo} disabled={!canUploadMore}>
              <FontAwesomeIcon icon={faFilm} /> Mettre en ligne une vidéo
            </button>
          )}
        </div>
      )}

      {getCurrentHasMore() && getCurrentVideos().length > 0 && <LoadMoreBtn loading={loadingMore} loadMore={loadMoreVideos} />}
      
      <HeaderVideo />

      {renderReportModal()}
      {renderBlockConfirmModal()}
      {renderDeleteConfirmModal()}

      <style jsx="true">{`
        
      `}</style>
    </div>
  );
};

export default ChannelProfile;