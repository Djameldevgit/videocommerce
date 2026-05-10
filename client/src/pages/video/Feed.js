// components/Feed/Feed.jsx - VERSIÓN CORREGIDA PARA CANALES
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart, faComment, faBookmark, faShare, faInfoCircle,
  faVolumeHigh, faVolumeXmark, faEye, faClock,
  faMusic, faXmark, faArrowLeft, faEllipsisVertical,
  faPen, faTrash, faFlag, faBan, faCheckCircle,
  faUserSlash, faExclamationTriangle, faExternalLinkAlt,
  faChevronUp, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
} from '@fortawesome/free-regular-svg-icons';
import Hls from 'hls.js';

import { likeVideo, shareVideo, deleteVideo } from '../../redux/actions/videoAction';
import { aprobarVideo, eliminarVideo } from '../../redux/actions/videoApproveAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { toggleSaveVideo } from '../../redux/actions/profileAction';
import VideoComments from './VideoComments';
import moment from 'moment';
import 'moment/locale/fr';
import './Feed.css';

const getVideoWithExternalAudio = (videoUrl, audioUrl) => {
  if (!audioUrl || !videoUrl) return videoUrl;
  const uploadIndex = videoUrl.indexOf('/upload/');
  if (uploadIndex === -1) return videoUrl;
  const base = videoUrl.substring(0, uploadIndex + 8);
  const rest = videoUrl.substring(uploadIndex + 8);
  let audioPath = audioUrl;
  const audioUploadIndex = audioUrl.indexOf('/upload/');
  if (audioUploadIndex !== -1) {
    audioPath = audioUrl.substring(audioUploadIndex + 8);
  }
  const encodedAudio = encodeURIComponent(audioPath);
  const transformation = `l_audio:${encodedAudio},fl_layer_apply,co_replace_audio`;
  return `${base}${transformation}/${rest}`;
};

const Feed = ({
  video,
  isActive = false,
  onVisibilityChange,
  onVideoDeleted,
  onNextVideo,
  onPreviousVideo,
  hasNext = false,
  hasPrev = false
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const videoRef = useRef(null);
  const drawerRef = useRef(null);
  let hlsRef = useRef(null);

  const [liked, setLiked] = useState(video.liked || false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commentsCount, setCommentsCount] = useState(video.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner = auth.user?._id === video.user?._id; // dueño del video (usuario que subió)
  const isPending = video?.pendiente === true;

  // Datos del canal (para mostrar y navegar)
  const channelData = video.channel || {};
  const channelId = channelData._id;
  const channelName = channelData.name || 'Canal';
  const channelAvatar = channelData.avatar || '/default-avatar.png';

  const getFinalVideoSrc = () => {
    if (video.videoUrl && (video.videoUrl.includes('l_audio') || video.videoUrl.includes('.m3u8'))) {
      return video.videoUrl;
    }
    if (video.music?.audioUrl) {
      return getVideoWithExternalAudio(video.videoUrl, video.music.audioUrl);
    }
    return video.videoUrl;
  };

  const finalVideoSrc = getFinalVideoSrc();

  // Navegación al canal
  const goToChannel = (e) => {
    e.stopPropagation();
    if (channelId) {
      history.push(`/channel/${channelId}`);
    }
  };

  // Manejo de HLS
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const src = finalVideoSrc;
    if (!src) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true, maxBufferLength: 30 });
        hls.loadSource(src);
        hls.attachMedia(videoEl);
        hlsRef.current = hls;
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = src;
      }
    } else {
      videoEl.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [finalVideoSrc]);

  // Reproducción automática
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive && !showComments) {
      videoEl.play().catch(e => console.log("Play error:", e));
      setIsPlaying(true);
      onVisibilityChange?.(true);
    } else if (!isActive && !showComments) {
      videoEl.pause();
      setIsPlaying(false);
      onVisibilityChange?.(false);
    }
  }, [isActive, showComments, onVisibilityChange]);

  // Barra de progreso
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const onTimeUpdate = () => {
      if (videoEl.duration) setProgress((videoEl.currentTime / videoEl.duration) * 100);
    };
    videoEl.addEventListener('timeupdate', onTimeUpdate);
    return () => videoEl.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  // Socket para comentarios
  useEffect(() => {
    if (!socket || !video || isPending) return;
    socket.emit('join-video-room', video._id);
    socket.on('new-comment', d => {
      if (d.videoId === video._id) setCommentsCount(p => p + 1);
    });
    socket.on('comment-deleted', d => {
      if (d.videoId === video._id) setCommentsCount(p => Math.max(0, p - 1));
    });
    return () => {
      socket.emit('leave-video-room', video._id);
      socket.off('new-comment');
      socket.off('comment-deleted');
    };
  }, [socket, video, isPending]);

  // Drag para comments
  const handleDragStart = e => {
    e.stopPropagation();
    setStartY(e.touches ? e.touches[0].clientY : e.clientY);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.min(Math.max(clientY - startY, 0), window.innerHeight * 0.6);
    setDragOffset(delta);
    if (drawerRef.current) drawerRef.current.style.transform = `translateY(${delta}px)`;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragOffset > window.innerHeight * 0.25) {
      handleCloseComments();
    } else {
      if (drawerRef.current) drawerRef.current.style.transform = '';
      setDragOffset(0);
    }
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && hasPrev && onPreviousVideo) {
        e.preventDefault();
        onPreviousVideo();
      } else if (e.key === 'ArrowDown' && hasNext && onNextVideo) {
        e.preventDefault();
        onNextVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPreviousVideo, onNextVideo]);

  // Efecto responsive
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Acciones del usuario
  const guardPending = () => {
    if (!isPending) return false;
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Cette vidéo est en attente d'approbation" } });
    return true;
  };

  const handleLike = async () => {
    if (!auth.token) return history.push('/login');
    if (guardPending()) return;
    const res = await dispatch(likeVideo(video._id, auth.token, auth, socket, video));
    if (res?.liked !== undefined) {
      setLiked(res.liked);
      setLikesCount(res.likes);
      if (res.liked) createHeartEffect();
    }
  };

  const handleSave = async () => {
    if (!auth.token) return history.push('/login');
    if (guardPending()) return;
    if (saving) return;
    setSaving(true);
    const result = await dispatch(toggleSaveVideo(video._id));
    if (result?.saved !== undefined) {
      setSaved(result.saved);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: result.saved ? 'Ajouté aux favoris' : 'Retiré des favoris' }
      });
    }
    setSaving(false);
  };

  const createHeartEffect = () => {
    const h = document.createElement('div');
    h.className = 'vr-floating-heart';
    h.textContent = '❤️';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 800);
  };

  const handleDoubleClick = e => {
    e.stopPropagation();
    if (!liked && !isPending) handleLike();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/video/${video._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: video.title, text: video.description, url }); } catch { }
    } else {
      navigator.clipboard.writeText(url);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Lien copié !' } });
    }
    await dispatch(shareVideo(video._id, auth.token, auth, socket, video));
  };

  const toggleMute = e => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(m => !m);
    }
  };

  const togglePlay = e => {
    e.stopPropagation();
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(p => !p);
    }
  };

  const handleProgressClick = e => {
    e.stopPropagation();
    if (videoRef.current?.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
    }
  };

  const handleOpenComments = () => { setShowComments(true); setDragOffset(0); };
  const handleCloseComments = () => {
    setShowComments(false);
    setDragOffset(0);
    if (drawerRef.current) drawerRef.current.style.transform = '';
  };
  const handleGoBack = () => history.goBack();

  // Ver detalles del video
  const handleViewDetails = (e) => {
    e?.stopPropagation();
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('feedScrollPosition', window.scrollY.toString());
    history.push(`/video/${video._id}`);
  };

  const menuAction = fn => () => { setShowMenu(false); fn(); };
  const handleEdit = menuAction(() => {
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('feedScrollPosition', window.scrollY.toString());
    history.push(`/edit-video/${video._id}`);
  });
  const handleDeleteVideo = menuAction(async () => {
    if (!window.confirm('Supprimer cette vidéo ? Cette action est irréversible.')) return;
    setActionLoading(true);
    const res = await dispatch(deleteVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo supprimée' } });
      onVideoDeleted?.(video._id);
    }
  });
  const handleApproveVideo = menuAction(async () => {
    if (!window.confirm(`Approuver "${video.title}" ?`)) return;
    setActionLoading(true);
    const res = await dispatch(aprobarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo approuvée !' } });
      onVideoDeleted?.(video._id);
    }
  });
  const handleRejectVideo = menuAction(async () => {
    if (!window.confirm(`Rejeter "${video.title}" ?`)) return;
    setActionLoading(true);
    const res = await dispatch(eliminarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo rejetée' } });
      onVideoDeleted?.(video._id);
    }
  });
  const handleReportVideo = menuAction(() => dispatch({ type: GLOBALTYPES.ALERT, payload: { info: 'Fonctionnalité de signalement disponible prochainement.' } }));
  const handleBlockUser = menuAction(() => dispatch({ type: GLOBALTYPES.ALERT, payload: { info: `@${video.user?.username} bloqué.` } }));
  const handleNotInterested = menuAction(() => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { info: 'Merci pour votre retour !' } });
    onVideoDeleted?.(video._id);
  });

  const formatNumber = n => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const videoScale = !showComments ? 1 : 0.7 + 0.3 * Math.min(dragOffset / (window.innerHeight * 0.6), 1);
  const videoTranslateY = !showComments ? 0 : -15 * (1 - Math.min(dragOffset / (window.innerHeight * 0.6), 1));
   
  return (
    <div className="video-reel-container">
      {/* Header */}
      <div className="vr-header">
        <button className="vr-header-btn" onClick={handleGoBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="vr-header-right">
          {(isOwner || isAdmin) && !showComments && (
            <button className="vr-header-btn" onClick={handleViewDetails} title="Voir les détails">
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          )}
          {!showComments && (
            <Dropdown show={showMenu} onToggle={setShowMenu} align="end">
              <Dropdown.Toggle as="button" className="vr-header-btn vr-menu-toggle">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="vr-dropdown-menu">
                {isAdmin && isPending && (
                  <>
                    <Dropdown.Item onClick={handleApproveVideo} className="vr-dropdown-item approve">
                      <FontAwesomeIcon icon={faCheckCircle} /> Approuver la vidéo
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleRejectVideo} className="vr-dropdown-item reject">
                      <FontAwesomeIcon icon={faBan} /> Rejeter la vidéo
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                )}
                {(isOwner || isAdmin) && !isPending && (
                  <>
                    <Dropdown.Item onClick={handleEdit} className="vr-dropdown-item">
                      <FontAwesomeIcon icon={faPen} /> Modifier
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleDeleteVideo} className="vr-dropdown-item reject">
                      <FontAwesomeIcon icon={faTrash} /> Supprimer
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                )}
                {isAdmin && !isPending && (
                  <>
                    <Dropdown.Item onClick={handleDeleteVideo} className="vr-dropdown-item reject">
                      <FontAwesomeIcon icon={faTrash} /> Supprimer (Admin)
                    </Dropdown.Item>
                    <Dropdown.Divider />
                  </>
                )}
                {!isOwner && !isAdmin && !isPending && (
                  <>
                    <Dropdown.Item onClick={handleReportVideo} className="vr-dropdown-item">
                      <FontAwesomeIcon icon={faFlag} /> Signaler la vidéo
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleBlockUser} className="vr-dropdown-item reject">
                      <FontAwesomeIcon icon={faUserSlash} /> Bloquer @{video.user?.username}
                    </Dropdown.Item>
                  </>
                )}
                {!isPending && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleNotInterested} className="vr-dropdown-item">
                      <FontAwesomeIcon icon={faExclamationTriangle} /> Pas intéressé(e)
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Admin banner */}
      {isPending && isAdmin && (
        <div className="vr-admin-banner">
          <div className="vr-admin-dot" />
          <span className="vr-admin-text">Mode Admin · Vidéo en attente d'approbation</span>
        </div>
      )}

      {/* Video wrapper */}
      <div
        className="vr-video-wrapper"
        style={{
          transform: showComments
            ? `scale(${videoScale}) translateY(${videoTranslateY}%)`
            : 'scale(1) translateY(0)',
          transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        }}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          poster={video.thumbnail}
          className="vr-video"
        />

        {!showComments && <div className="vr-gradient-overlay" />}

        {/* Progress bar */}
        {!showComments && (
          <div className="vr-progress-bar" onClick={handleProgressClick}>
            <div className="vr-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Sidebar actions */}
        {!showComments && (
          <div className="vr-actions-sidebar">
            <div className="vr-action-group vr-avatar-group">
              <div className="vr-avatar-wrapper" onClick={goToChannel}>
                <img src={channelAvatar} alt={channelName} className="vr-sidebar-avatar" />
                {channelData.isVerified && (
                  <div className="vr-pro-badge">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                )}
              </div>
              <span className="vr-action-count">@{channelName.slice(0, 12)}</span>
            </div>

            <div className="vr-action-group">
              <button className="vr-action-btn" onClick={handleLike}>
                <FontAwesomeIcon icon={liked ? faHeart : faHeartRegular} className="vr-action-icon" style={{ color: liked ? '#ff3b5c' : 'white' }} />
              </button>
              <span className="vr-action-count">{formatNumber(likesCount)}</span>
            </div>

            <div className="vr-action-group">
              <button className="vr-action-btn" onClick={handleOpenComments}>
                <FontAwesomeIcon icon={faComment} className="vr-action-icon" />
              </button>
              <span className="vr-action-count">{formatNumber(commentsCount)}</span>
            </div>

            <div className="vr-action-group">
              <button className="vr-action-btn" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <FontAwesomeIcon icon={faBookmark} spin />
                ) : (
                  <FontAwesomeIcon icon={saved ? faBookmark : faBookmarkRegular} className="vr-action-icon" style={{ color: saved ? '#ffd700' : 'white' }} />
                )}
              </button>
              <span className="vr-action-count">Favoris</span>
            </div>

            <div className="vr-action-group">
              <button className="vr-action-btn" onClick={handleShare}>
                <FontAwesomeIcon icon={faShare} className="vr-action-icon" />
              </button>
              <span className="vr-action-count">Partager</span>
            </div>

            <div className="vr-action-group">
              <button className="vr-action-btn" onClick={handleViewDetails} title="Détails du produit">
                <FontAwesomeIcon icon={faInfoCircle} className="vr-action-icon" />
              </button>
              <span className="vr-action-count">Détails</span>
            </div>

            {isLargeScreen && (hasPrev || hasNext) && <div className="vr-nav-divider" />}
            {isLargeScreen && hasPrev && onPreviousVideo && (
              <div className="vr-nav-group">
                <button className="vr-nav-btn" onClick={onPreviousVideo} title="Précédent">
                  <FontAwesomeIcon icon={faChevronUp} />
                </button>
                <span className="vr-nav-label">Précédent</span>
              </div>
            )}
            {isLargeScreen && hasNext && onNextVideo && (
              <div className="vr-nav-group">
                <button className="vr-nav-btn" onClick={onNextVideo} title="Suivant">
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>
                <span className="vr-nav-label">Suivant</span>
              </div>
            )}
          </div>
        )}

        {/* Volume button */}
        {!showComments && (
          <button className="vr-volume-btn" onClick={toggleMute}>
            <FontAwesomeIcon icon={isMuted ? faVolumeXmark : faVolumeHigh} />
          </button>
        )}

        {/* Video info */}
        {!showComments && (
          <div className="vr-video-info">
            {isPending && isAdmin && <span className="vr-pending-badge">⏳ En attente</span>}
            <div className="vr-user-row">
              <img src={channelAvatar} alt={channelName} className="vr-user-avatar" onClick={goToChannel} />
              <div className="vr-user-details">
                <div className="vr-username" onClick={goToChannel}>@{channelName}</div>
                <div className="vr-stats">
                  <span><FontAwesomeIcon icon={faEye} />{formatNumber(video.views)}</span>
                  <span><FontAwesomeIcon icon={faClock} />{moment(video.createdAt).fromNow()}</span>
                </div>
              </div>
              {!isPending && (
                <button className={`vr-follow-btn ${isFollowing ? 'following' : ''}`} onClick={() => setIsFollowing(f => !f)}>
                  {isFollowing ? 'Suivi ✓' : 'Suivre'}
                </button>
              )}
            </div>
            <p className="vr-title">{video.title}</p>
            {video.description && <p className="vr-description">{video.description}</p>}
            {video.tags?.length > 0 && (
              <div className="vr-tags">
                <FontAwesomeIcon icon={faMusic} />
                <span>{video.tags.slice(0, 2).join(' · ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comments drawer */}
      {showComments && (
        <div className="vr-comments-drawer">
          <div className="vr-comments-backdrop" onClick={handleCloseComments} />
          <div
            ref={drawerRef}
            className="vr-comments-panel"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="vr-comments-drag-handle">
              <div className="vr-comments-drag-bar" />
            </div>
            <div className="vr-comments-header">
              <h5 className="vr-comments-title">
                {commentsCount} commentaire{commentsCount !== 1 ? 's' : ''}
              </h5>
              <button className="vr-comments-close" onClick={handleCloseComments}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="vr-comments-content">
              <VideoComments videoId={video._id} comments={video.comments || []} totalComments={commentsCount} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;