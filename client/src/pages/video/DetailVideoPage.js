// components/Video/DetailVideoPage.jsx - VERSIÓN COMPLETA Y ORGANIZADA
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Badge, Card } from 'react-bootstrap';
import {
  Heart, HeartFill, Eye, Clock, Share, Bookmark, BookmarkFill,
  ArrowLeft, Chat, VolumeUp, VolumeMute, CheckCircle,
  Trash, ShieldLock, CameraReels, HourglassSplit, SendCheck,
  GeoAlt, Telephone, Envelope, Truck, Box, Tag, Building, Whatsapp, Map
} from 'react-bootstrap-icons';
import { getVideoById, likeVideo } from '../../redux/actions/videoAction';
import { aprobarVideo, eliminarVideo } from '../../redux/actions/videoApproveAction';
import VideoActions from './VideoActions';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import moment from 'moment';
import 'moment/locale/fr';
import VideoComments from './VideoCommentsSheet';
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
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  
  moment.locale('fr');

  // Constantes de permisos
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner = video?.user?._id === auth.user?._id;
  const isPending = video?.pendiente === true;
  const isCommercial = video?.isCommercial === true || (video?.price > 0 || video?.wilaya || video?.phone);
  
  // Abrir mapa en Google Maps
  const openMap = () => {
    const query = encodeURIComponent(`${video?.commune || ''}, ${video?.wilaya || ''}, Algérie`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapUrl, '_blank');
  };

  // Efectos
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (video && !video.pendiente) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
      setCommentsCount(video.comments?.length || 0);
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
      if (videoElement.duration) {
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // Funciones de navegación
  const returnToFeed = () => {
    const shouldReturnToFeed = sessionStorage.getItem('returnToFeed') === 'true';
    const feedPosition = sessionStorage.getItem('feedScrollPosition');
    
    if (shouldReturnToFeed) {
      sessionStorage.removeItem('returnToFeed');
      sessionStorage.removeItem('feedScrollPosition');
      
      if (feedPosition) {
        sessionStorage.setItem('tempScrollPosition', feedPosition);
      }
      
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

  // Acciones del video
  const handleLike = async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    if (isPending) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Vidéo en attente de validation' } });
      return;
    }
    
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
      try {
        await navigator.share({ title: video?.title, url: shareUrl });
      } catch (err) {}
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

  // Acciones de admin
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

  // Utilidades
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  // ============================================
  // SECCIÓN COMERCIAL - RENDERIZADO
  // ============================================
  const renderCommercialInfo = () => {
    if (!isCommercial) return null;
    
    return (
      <div className="commercial-wrapper">
        <div className="commercial-section">
          <div className="commercial-header">
            <h5>
              <Tag size={18} /> Informations commerciales
            </h5>
            <div className="commercial-badges">
              {video?.wholesale && (
                <span className="commercial-badge wholesale">
                  <Box size={11} /> Vente en gros
                </span>
              )}
              {video?.pickupOnly && (
                <span className="commercial-badge pickup">
                  <Building size={11} /> Retrait en magasin
                </span>
              )}
              {video?.delivery?.available && (
                <span className="commercial-badge delivery">
                  <Truck size={11} /> Livraison disponible
                </span>
              )}
            </div>
          </div>
          
          <div className="commercial-grid">
            {/* Precio */}
            {(video?.price > 0 || video?.price === 0) && (
              <div className="commercial-card-item">
                <div className="commercial-icon-wrapper"><Tag size={16} /></div>
                <span className="commercial-label">Prix</span>
                <div className="commercial-value price">
                  {video.price > 0 ? `${video.price.toLocaleString()} DA` : 'Prix sur devis'}
                </div>
                {video?.wholesale && video?.minQuantity > 1 && (
                  <span className="commercial-subvalue">Minimum: {video.minQuantity} unités</span>
                )}
              </div>
            )}
            
            {/* Stock */}
            {video?.stock?.available > 0 && (
              <div className="commercial-card-item">
                <div className="commercial-icon-wrapper"><Box size={16} /></div>
                <span className="commercial-label">Stock</span>
                <div className="commercial-value stock">{video.stock.available} unités</div>
              </div>
            )}
            
            {/* Ubicación */}
            {(video?.wilaya || video?.commune) && (
              <div className="commercial-card-item">
                <div className="commercial-icon-wrapper"><GeoAlt size={16} /></div>
                <span className="commercial-label">Localisation</span>
                <div className="commercial-value">
                  {video.commune ? `${video.commune}, ` : ''}{video.wilaya || ''}
                </div>
              </div>
            )}
            
            {/* Teléfono */}
            {video?.phone && (
              <div className="commercial-card-item">
                <div className="commercial-icon-wrapper"><Telephone size={16} /></div>
                <span className="commercial-label">Téléphone</span>
                <div className="commercial-value">
                  {video.phoneHidden && !isOwner && !isAdmin ? (
                    <button className="btn-show-phone" onClick={() => {
                      dispatch({ type: GLOBALTYPES.ALERT, payload: { info: 'Connectez-vous pour voir le numéro' } });
                    }}>
                      🔒 Voir le numéro
                    </button>
                  ) : (
                    <a href={`tel:${video.phone}`} className="phone-link">{video.phone}</a>
                  )}
                </div>
              </div>
            )}
            
            {/* Email */}
            {video?.email && (
              <div className="commercial-card-item">
                <div className="commercial-icon-wrapper"><Envelope size={16} /></div>
                <span className="commercial-label">Email</span>
                <div className="commercial-value">
                  <a href={`mailto:${video.email}`} className="email-link">{video.email}</a>
                </div>
              </div>
            )}
          </div>
          
          {/* Mapa */}
          {(video?.wilaya || video?.commune) && (
            <div className="map-container">
              <div className="map-header">
                <div className="map-title">
                  <Map size={14} /> Voir sur la carte
                </div>
                <div className="map-address">
                  {video.commune ? `${video.commune}, ` : ''}{video.wilaya || ''}
                </div>
                <button className="map-button" onClick={openMap}>
                  <Map size={14} /> Google Maps
                </button>
              </div>
            </div>
          )}
          
          {/* Botones de contacto */}
          <div className="contact-buttons">
            {video?.phone && !video.phoneHidden && (
              <a href={`tel:${video.phone}`} className="contact-btn contact-btn-call">
                <Telephone size={16} /> Appeler
              </a>
            )}
            {video?.phone && (
              <a 
                href={`https://wa.me/${video.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-btn contact-btn-whatsapp"
              >
                <Whatsapp size={16} /> WhatsApp
              </a>
            )}
            {video?.email && (
              <a href={`mailto:${video.email}`} className="contact-btn contact-btn-email">
                <Envelope size={16} /> Email
              </a>
            )}
            <button className="contact-btn contact-btn-share" onClick={handleShare}>
              <Share size={16} /> Partager
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // PANTALLAS DE ESTADO
  // ============================================
  
  // Pantalla de carga
  if (loading && !video) {
    return (
      <div className="tiktok-loader">
        <div className="tiktok-spinner"></div>
      </div>
    );
  }

  // Video pendiente - usuario normal
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

  // Video no encontrado
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
    <div className="tiktok-container">
      {/* Banner admin para video pendiente */}
      {isAdmin && video?.pendiente === true && (
        <div className="admin-pending-banner">
          <ShieldLock className="me-2" size={16} />
          <strong>Mode Admin:</strong> Cette vidéo est en attente d'approbation.
          <Button variant="link" size="sm" className="text-white ms-3" onClick={handleGoBack}>
            ← Retour
          </Button>
        </div>
      )}
      
      {/* Header */}
      <div className={`tiktok-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="link" className="text-white p-0" onClick={handleGoBack}>
            <ArrowLeft size={24} />
          </Button>
          <h6 className="text-white mb-0">Vidéo</h6>
          <div style={{ width: 24 }}></div>
        </div>
      </div>

      {/* Contenedor del video */}
      <div className="tiktok-video-container">
        {/* Video player */}
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

        {/* Barra de progreso */}
        <div ref={progressBarRef} className="tiktok-progress-bar" onClick={handleProgressClick}>
          <div className="tiktok-progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Control de volumen */}
        <button onClick={toggleMute} className="tiktok-volume-control">
          {isMuted ? <VolumeMute size={20} /> : <VolumeUp size={20} />}
        </button>

        {/* Sidebar de acciones */}
        <div className="tiktok-actions-sidebar">
          {/* Admin actions */}
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

          {/* Edit actions */}
          {video?.pendiente === false && auth.user && (auth.user._id === video.user?._id || isAdmin) && (
            <div className="tiktok-action-item">
              <VideoActions video={video} />
              <p className="tiktok-action-count">Actions</p>
            </div>
          )}

          {/* Like */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className={`tiktok-action-btn ${liked ? 'tiktok-like-animation' : ''}`} onClick={handleLike}>
                {liked ? <HeartFill size={24} color="#ff4040" /> : <Heart size={24} />}
              </button>
              <p className="tiktok-action-count">{formatNumber(likesCount)}</p>
            </div>
          )}

          {/* Comments */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={() => setShowComments(!showComments)}>
                <Chat size={24} />
              </button>
              <p className="tiktok-action-count">{formatNumber(commentsCount)}</p>
            </div>
          )}

          {/* Save */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleSave}>
                {saved ? <BookmarkFill size={24} color="#ffd700" /> : <Bookmark size={24} />}
              </button>
              <p className="tiktok-action-count">Favoris</p>
            </div>
          )}

          {/* Share */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleShare}>
                <Share size={24} />
              </button>
              <p className="tiktok-action-count">Partager</p>
            </div>
          )}
        </div>

        {/* Información del video */}
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

      {/* Sección comercial - Fuera del contenedor del video */}
      {renderCommercialInfo()}

      {/* Panel de comentarios */}
      {video?.pendiente === false && (
        <div className={`tiktok-comments-panel ${showComments ? 'open' : ''}`}>
          <div className="tiktok-comments-header">
            <h6 className="tiktok-comments-title">{commentsCount} commentaires</h6>
            <button className="tiktok-close-comments" onClick={() => setShowComments(false)}>✕</button>
          </div>
          <VideoComments videoId={video?._id} comments={video?.comments || []} totalComments={commentsCount} />
        </div>
      )}
    </div>
  );
};

export default DetailVideoPage;