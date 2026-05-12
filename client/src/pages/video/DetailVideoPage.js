// components/Video/DetailVideoPage.jsx - VERSIÓN CON BOTÓN PARA MAPA
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Badge, Card } from 'react-bootstrap';
import {
  Heart, HeartFill, Eye, Clock, Share, Bookmark, BookmarkFill,
  ArrowLeft, VolumeUp, VolumeMute, CheckCircle,
  Trash, ShieldLock, HourglassSplit, SendCheck,
  GeoAlt, Tag, Building, Map
} from 'react-bootstrap-icons';
import { getVideoById, likeVideo } from '../../redux/actions/videoAction';
import { aprobarVideo, eliminarVideo } from '../../redux/actions/videoApproveAction';
import VideoActions from './VideoActions';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import moment from 'moment';
import 'moment/locale/fr';
import './css/video.css';
import './DetailVideoPage.css';

const DetailVideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { currentVideo: video, loading } = useSelector(state => state.video || {});
  
  // Estados
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  
  moment.locale('fr');

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner = video?.user?._id === auth.user?._id;
  const isPending = video?.pendiente === true;
  // Nuevo: comercial si tiene saleType o isCommercial
  const isCommercial = video?.isCommercial === true || (video?.saleType && video.saleType !== '');
  
  // Efectos
  useEffect(() => {
    if (id) dispatch(getVideoById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (video && !video.pendiente) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
    }
  }, [video]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const handleTimeUpdate = () => {
      if (videoElement.duration) setProgress((videoElement.currentTime / videoElement.duration) * 100);
    };
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Navegación
  const returnToFeed = () => {
    const shouldReturnToFeed = sessionStorage.getItem('returnToFeed') === 'true';
    const feedPosition = sessionStorage.getItem('feedScrollPosition');
    if (shouldReturnToFeed) {
      sessionStorage.removeItem('returnToFeed');
      sessionStorage.removeItem('feedScrollPosition');
      if (feedPosition) sessionStorage.setItem('tempScrollPosition', feedPosition);
      history.push('/');
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem('tempScrollPosition');
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
          sessionStorage.removeItem('tempScrollPosition');
        }
      }, 100);
      return true;
    }
    return false;
  };

  const handleGoBack = () => {
    if (returnToFeed()) return;
    if (isAdmin && isPending) history.push('/admin/posts?tab=videos');
    else history.goBack();
  };

  // Acciones
  const handleLike = async () => {
    if (!auth.token) return history.push('/login');
    if (isPending) return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Vidéo en attente de validation' } });
    const result = await dispatch(likeVideo(video._id, auth.token, auth, socket, video));
    if (result?.liked !== undefined) {
      setLiked(result.liked);
      setLikesCount(result.likes);
    }
  };

  const handleSave = () => {
    if (!auth.token) return history.push('/login');
    if (isPending) return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Vidéo en attente de validation' } });
    setSaved(!saved);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: saved ? 'Retiré des favoris' : 'Ajouté aux favoris' } });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${id}`;
    if (navigator.share) {
      try { await navigator.share({ title: video?.title, url: shareUrl }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Lien copié !' } });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const handleApprove = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Approuver la vidéo "${video?.title}" ?`)) return;
    setActionLoading(true);
    const result = await dispatch(aprobarVideo(id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (result?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo approuvée !' } });
      setTimeout(() => history.push('/admin/posts?tab=videos'), 1500);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Supprimer "${video?.title}" ?`)) return;
    setActionLoading(true);
    const result = await dispatch(eliminarVideo(id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (result?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo supprimée' } });
      setTimeout(() => history.push('/admin/posts?tab=videos'), 1500);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  // Traducción del saleType
  const getSaleTypeLabel = (type) => {
    switch (type) {
      case 'retail': return 'Vente au détail';
      case 'wholesale': return 'Vente en gros';
      case 'both': return 'Vente au détail et en gros';
      default: return type;
    }
  };

  // ============================================
  // SECCIÓN COMERCIAL CON NUEVOS CAMPOS + BOTÓN MAPA
  // ============================================
  const renderCommercialInfo = () => {
    if (!isCommercial) return null;
    
    const items = [];
    
    if (video?.saleType) {
      items.push({
        icon: <Tag size={16} />,
        label: 'Type de vente',
        value: getSaleTypeLabel(video.saleType)
      });
    }
    
    if (video?.address) {
      items.push({
        icon: <GeoAlt size={16} />,
        label: 'Adresse',
        value: video.address
      });
    }
    
   
    
    if (items.length === 0) return null;
    
    return (
      <div className="commercial-section-modern" style={{ background: '#ffffff', padding: '0', marginTop: '1rem' }}>
        <div className="commercial-header-modern">
          <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
            <Tag size={18} style={{ marginRight: '8px' }} /> Informations commerciales
          </h5>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                <span style={{ color: '#666' }}>{item.icon}</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{item.label}</span>
              </div>
              <div style={{ flex: 1, textAlign: 'right', color: '#222', wordBreak: 'break-word' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de acción: Partager y Ver mapa */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px', justifyContent: 'center' }}>
          <button className="btn btn-outline-info btn-sm" onClick={handleShare} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Share size={16} /> Partager
          </button>
          
          {/* Botón para ver en el mapa - solo si hay address o datos de canal */}
          {(video?.address || video?.channel?.wilaya || video?.channel?.commune) && (
            <button 
              className="btn btn-outline-primary btn-sm" 
              onClick={() => {
                history.push('/map', {
                  shopData: {
                    nombretienda: video?.title || video?.nom_entreprise || 'Boutique',
                    address: video?.address || '',
                    wilaya: video?.channel?.wilaya || '',
                    commune: video?.channel?.commune || '',
                    mobile: video?.channel?.phone || '',
                    email: video?.channel?.email || '',
                    typesVente: getSaleTypeLabel(video?.saleType),
                    proprietaire: video?.user?.username,
                    presentacion: video?.description,
                    mapUrl: video?.mapUrl,
                    images: video?.images || []
                  }
                });
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Map size={16} /> Voir sur la carte
            </button>
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // PANTALLAS DE ESTADO
  // ============================================
  if (loading && !video) {
    return (
      <div className="tiktok-loader">
        <div className="tiktok-spinner"></div>
      </div>
    );
  }

  if (video && video.pendiente === true && !isAdmin) {
    return (
      <div className="pending-video-container">
        <Card className="pending-video-card">
          <div className="pending-icon-wrapper">
            <div className="pending-icon">
              <HourglassSplit size={48} color="white" />
            </div>
          </div>
          <h2 className="pending-title">Vidéo en cours de validation</h2>
          <div className="pending-divider"></div>
          <p className="pending-message">
            📹 Votre vidéo "{video.title}" a été envoyée aux administrateurs pour validation.
          </p>
          <div className="pending-buttons">
            <Button variant="outline-secondary" onClick={() => history.push('/videos/1')}>
              Parcourir les vidéos
            </Button>
            <Button variant="primary" onClick={() => history.push('/create-video')}>
              Créer une autre vidéo
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!video && !loading) {
    return (
      <div className="pending-video-container">
        <Card className="pending-video-card">
          <h2 className="pending-title">Vidéo non trouvée</h2>
          <div className="pending-divider"></div>
          <p className="pending-message">La vidéo que vous recherchez n'existe pas ou a été supprimée.</p>
          <div className="pending-buttons">
            <Button variant="primary" onClick={() => history.push('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================
  // VIDEO PRINCIPAL
  // ============================================
  return (
    <div className="tiktok-container" style={{ backgroundColor: '#ffffff' }}>
      {isAdmin && video?.pendiente === true && (
        <div className="admin-pending-banner">
          <ShieldLock className="me-2" size={16} />
          <strong>Mode Admin:</strong> Cette vidéo est en attente d'approbation.
          <Button variant="link" size="sm" className="text-white ms-3" onClick={handleGoBack}>
            ← Retour
          </Button>
        </div>
      )}
      
      <div className={`tiktok-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="link" className="text-white p-0" onClick={handleGoBack}>
            <ArrowLeft size={24} />
          </Button>
          <h6 className="text-white mb-0">Vidéo</h6>
          <div style={{ width: 24 }}></div>
        </div>
      </div>

      <div className="tiktok-video-container">
        {video?.videoType === 'local' ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="tiktok-video"
            poster={video.thumbnail}
            onClick={togglePlay}
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${video?.videoId}?autoplay=1&loop=1&mute=${isMuted ? 1 : 0}&controls=0`}
            title={video?.title}
            frameBorder="0"
            allowFullScreen
            className="tiktok-video"
          />
        )}

        <div ref={progressBarRef} className="tiktok-progress-bar" onClick={handleProgressClick}>
          <div className="tiktok-progress" style={{ width: `${progress}%` }}></div>
        </div>

        <button onClick={toggleMute} className="tiktok-volume-control">
          {isMuted ? <VolumeMute size={20} /> : <VolumeUp size={20} />}
        </button>

        <div className="tiktok-actions-sidebar">
          {isAdmin && video?.pendiente === true && (
            <div className="tiktok-action-item">
              <div className="d-flex flex-column gap-2">
                <button className="tiktok-action-btn bg-success bg-opacity-25 rounded-circle p-2" onClick={handleApprove} disabled={actionLoading}>
                  <CheckCircle size={24} color="#4caf50" />
                </button>
                <button className="tiktok-action-btn bg-danger bg-opacity-25 rounded-circle p-2" onClick={handleDelete} disabled={actionLoading}>
                  <Trash size={24} color="#f44336" />
                </button>
              </div>
              <p className="tiktok-action-count">Admin</p>
            </div>
          )}

          {video?.pendiente === false && auth.user && (auth.user._id === video.user?._id || isAdmin) && (
            <div className="tiktok-action-item">
              <VideoActions video={video} />
              <p className="tiktok-action-count">Actions</p>
            </div>
          )}

          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className={`tiktok-action-btn ${liked ? 'tiktok-like-animation' : ''}`} onClick={handleLike}>
                {liked ? <HeartFill size={24} color="#ff4040" /> : <Heart size={24} />}
              </button>
              <p className="tiktok-action-count">{formatNumber(likesCount)}</p>
            </div>
          )}

          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleSave}>
                {saved ? <BookmarkFill size={24} color="#ffd700" /> : <Bookmark size={24} />}
              </button>
              <p className="tiktok-action-count">Favoris</p>
            </div>
          )}

          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleShare}>
                <Share size={24} />
              </button>
              <p className="tiktok-action-count">Partager</p>
            </div>
          )}
        </div>

        <div className="tiktok-video-info">
          <div className="tiktok-user-info">
            <img
              src={video?.user?.avatar || '/default-avatar.png'}
              alt={video?.user?.username}
              className="tiktok-avatar"
            />
            <div className="flex-grow-1">
              <strong className="tiktok-username">@{video?.user?.username}</strong>
              <div className="d-flex gap-3 small opacity-75">
                <span><Eye size={12} /> {formatNumber(video?.views)} vues</span>
                <span><Clock size={12} /> {moment(video?.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
          <h6 className="text-white mb-1">{video?.title}</h6>
          <p className="text-white opacity-75 small mb-2">{video?.description}</p>
          {video?.tags?.length > 0 && (
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {video.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} bg="secondary" className="opacity-50">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sección comercial con botón de mapa */}
      {renderCommercialInfo()}
    </div>
  );
};

export default DetailVideoPage;