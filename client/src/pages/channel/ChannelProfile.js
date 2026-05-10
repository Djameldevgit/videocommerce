// src/pages/channel/ChannelProfile.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import { 
  Tv, Heart, Eye, Calendar, Telephone, Envelope, Globe, 
  Pencil, CheckCircle, CameraVideo, InfoCircle, PeopleFill,
  Bookmark, ArrowLeft, Share, Play
} from 'react-bootstrap-icons';
import { getChannelProfile, toggleFollowChannel, getChannelVideos } from '../../redux/actions/channelAction';
import { toggleSaveVideo, getSavedVideos, getLikedVideos } from '../../redux/actions/userVideoAction';
import { formatNumber } from '../../utils/format';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import './ChannelProfile.css';

/* ---------- MiniVideoCard (adaptado de UserVideoPage) ---------- */
const MiniVideoCard = ({ video, onClick, onSave, isOwnChannel, isSavedInitial = false }) => {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const { token } = useSelector(state => state.auth);

  const fmt = (n) => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!token || saving) return;
    setSaving(true);
    try {
      await onSave?.(video._id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
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
              <Play size={12} className="channel-stat-icon" />
              {fmt(video.views)}
            </span>
          </div>
        </div>
        {!isOwnChannel && (
          <button
            className={`channel-mini-save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            <Bookmark size={14} />
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

/* ---------- Componente principal ChannelProfile ---------- */
const ChannelProfile = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  
  // Selectores con fallback a arrays vacíos para evitar errores de undefined
  const { channel, loading, videos = [], hasMore, currentPage } = useSelector(state => state.channel);
  const { savedVideos = [], likedVideos = [] } = useSelector(state => state.userVideo);
  
  const [activeTab, setActiveTab] = useState('videos');
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savedVideosMap, setSavedVideosMap] = useState({});

  const isOwner = user?._id === channel?.owner?._id;

  // Cargar perfil del canal
  useEffect(() => {
    if (channelId) {
      dispatch(getChannelProfile(channelId, token));
    }
    // Nota: no se usa clearChannelVideos porque no existe. Si quieres limpiar, crea la acción.
  }, [channelId, dispatch, token]);

  // Cargar videos del canal cuando cambia el tab o el canal
  useEffect(() => {
    if (channelId && activeTab === 'videos') {
      dispatch(getChannelVideos(channelId, 1, 12, token)); // limit = 12
    }
  }, [channelId, activeTab, token, dispatch]);

  // Cargar saved/liked si es dueño y tabs activos
  useEffect(() => {
    if (isOwner && token && user?._id) {
      if (activeTab === 'saved') {
        dispatch(getSavedVideos(user._id, 1, token));
      } else if (activeTab === 'liked') {
        dispatch(getLikedVideos(user._id, 1, token));
      }
    }
  }, [activeTab, isOwner, token, user?._id, dispatch]);

  // Mapa de videos guardados para miniaturas
  useEffect(() => {
    if (savedVideos.length > 0) {
      const map = {};
      savedVideos.forEach(v => { map[v._id] = true; });
      setSavedVideosMap(map);
    }
  }, [savedVideos]);

  useEffect(() => {
    if (channel) {
      setFollowing(channel.isFollowing || false);
      setFollowersCount(channel.followersCount || 0);
    }
  }, [channel]);

  const handleFollow = async () => {
    if (!token) {
      history.push('/login');
      return;
    }
    const res = await dispatch(toggleFollowChannel(channelId, token));
    if (res?.success) {
      setFollowing(res.isFollowing);
      setFollowersCount(res.followersCount);
    }
  };

  // Usa toggleSaveVideo (única acción para guardar/quitar)
  const handleSaveToggle = async (videoId) => {
    if (!token) return;
    await dispatch(toggleSaveVideo(videoId, token));
    // Si estamos en la pestaña "Guardados" y somos dueños, refrescamos la lista
    if (isOwner && activeTab === 'saved') {
      dispatch(getSavedVideos(user._id, 1, token));
    }
  };

  const loadMoreVideos = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    await dispatch(getChannelVideos(channelId, nextPage, 12, token));
    setLoadingMore(false);
  }, [loadingMore, hasMore, currentPage, channelId, token, dispatch]);

  const loadMoreSaved = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = Math.floor(savedVideos.length / 12) + 1;
    await dispatch(getSavedVideos(user._id, nextPage, token));
    setLoadingMore(false);
  }, [loadingMore, savedVideos.length, user?._id, token, dispatch]);

  const loadMoreLiked = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = Math.floor(likedVideos.length / 12) + 1;
    await dispatch(getLikedVideos(user._id, nextPage, token));
    setLoadingMore(false);
  }, [loadingMore, likedVideos.length, user?._id, token, dispatch]);

  const handleVideoClick = (videoId) => {
    sessionStorage.setItem('returnToChannel', 'true');
    sessionStorage.setItem('channelScrollPosition', window.scrollY.toString());
    history.push(`/video/channelFeed/${channelId}?startVideo=${videoId}`);
  };

  // Funciones seguras para obtener la lista actual y si tiene más elementos
  const getCurrentVideos = () => {
    if (activeTab === 'videos') return videos;
    if (activeTab === 'saved') return savedVideos;
    if (activeTab === 'liked') return likedVideos;
    return [];
  };

  const getCurrentHasMore = () => {
    if (activeTab === 'videos') return hasMore;
    // Para saved y liked, la paginación se maneja con el estado de userVideo; 
    // asumimos que se puede seguir cargando mientras haya al menos 12 videos por página.
    // Si tu reducer tiene savedHasMore / likedHasMore, úsalos. Por ahora simple:
    if (activeTab === 'saved') return savedVideos.length % 12 === 0 && savedVideos.length > 0;
    if (activeTab === 'liked') return likedVideos.length % 12 === 0 && likedVideos.length > 0;
    return false;
  };

  const loadMoreFn = () => {
    if (activeTab === 'videos') loadMoreVideos();
    else if (activeTab === 'saved') loadMoreSaved();
    else if (activeTab === 'liked') loadMoreLiked();
  };

  if (loading && !channel) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Chargement de la chaîne...</span>
      </div>
    );
  }

  if (!channel) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">Chaîne introuvable</Alert>
      </Container>
    );
  }

  return (
    <div className="channel-profile">
      {/* Banner */}
      <div 
        className="channel-banner"
        style={{ 
          backgroundImage: channel.cover 
            ? `url(${channel.cover})` 
            : 'linear-gradient(135deg, #0d6efd, #0a58ca)'
        }}
      >
        <div className="channel-avatar-wrapper">
          <img 
            src={channel.avatar || 'https://res.cloudinary.com/dfjipgj2o/image/upload/v1777859039/avatar_cvr2e3.jpg'} 
            alt={channel.name}
            className="channel-avatar"
          />
        </div>
      </div>

      <Container className="pt-5 mt-4">
        {/* Cabecera con botón volver */}
        <div className="d-flex align-items-center mb-3">
          <Button variant="link" className="text-decoration-none p-0 me-3" onClick={() => history.goBack()}>
            <ArrowLeft size={24} />
          </Button>
        </div>

        <Row className="align-items-center mb-5">
          <Col xs={12} md={8} className="text-center text-md-start">
            <h1 className="channel-title">{channel.name}</h1>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start mt-2">
              <Badge bg="light" text="dark" className="channel-badge">
                <Tv size={14} className="me-1" /> {channel.activity || 'Secteur inconnu'}
              </Badge>
              {channel.isVerified && (
                <Badge bg="info" className="channel-badge">
                  <CheckCircle size={14} className="me-1" /> Vérifié
                </Badge>
              )}
              <span className="text-muted small">
                <Calendar size={14} className="me-1" /> 
                Membre depuis {new Date(channel.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {channel.description && (
              <p className="text-secondary mt-3 mx-auto mx-md-0" style={{ maxWidth: '600px' }}>
                {channel.description}
              </p>
            )}
          </Col>
          <Col xs={12} md={4} className="text-center text-md-end mt-4 mt-md-0">
            {isOwner ? (
              <Button 
                variant="outline-primary" 
                onClick={() => history.push(`/channel/${channelId}/settings`)}
                className="rounded-pill px-4"
              >
                <Pencil size={16} className="me-2" /> Modifier
              </Button>
            ) : (
              <div className="d-flex gap-2 justify-content-center justify-content-md-end">
                <Button 
                  variant={following ? "secondary" : "primary"}
                  onClick={handleFollow}
                  className={`btn-subscribe ${following ? 'btn-subscribed' : ''}`}
                >
                  <Heart size={16} className="me-2" />
                  {following ? `Abonné (${formatNumber(followersCount)})` : `S'abonner (${formatNumber(followersCount)})`}
                </Button>
                <Button variant="outline-secondary" className="rounded-pill px-3">
                  <Share size={16} />
                </Button>
              </div>
            )}
          </Col>
        </Row>

        {/* Métricas */}
        <Row className="g-4 mb-5 justify-content-center">
          <Col xs={6} sm={4} md={3} lg={2}>
            <Card className="stats-card text-center p-3">
              <Eye size={32} className="stats-icon text-primary" />
              <h3 className="mt-2 mb-0 fw-bold">{formatNumber(channel.totalViews || 0)}</h3>
              <small className="text-muted">vues</small>
            </Card>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <Card className="stats-card text-center p-3">
              <Heart size={32} className="stats-icon text-danger" />
              <h3 className="mt-2 mb-0 fw-bold">{formatNumber(channel.totalLikes || 0)}</h3>
              <small className="text-muted">likes</small>
            </Card>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <Card className="stats-card text-center p-3">
              <Tv size={32} className="stats-icon text-success" />
              <h3 className="mt-2 mb-0 fw-bold">{formatNumber(channel.totalVideos || 0)}</h3>
              <small className="text-muted">vidéos</small>
            </Card>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <Card className="stats-card text-center p-3">
              <PeopleFill size={32} className="stats-icon text-info" />
              <h3 className="mt-2 mb-0 fw-bold">{formatNumber(followersCount)}</h3>
              <small className="text-muted">abonnés</small>
            </Card>
          </Col>
        </Row>

        {/* Contacto */}
        {(channel.phone || channel.email || channel.website || channel.wilaya) && (
          <Card className="contact-card mb-5">
            <Card.Body className="p-4">
              <h5 className="mb-4 fw-semibold d-flex align-items-center gap-2">
                <InfoCircle size={20} /> Contact et localisation
              </h5>
              <Row>
                {channel.wilaya && (
                  <Col md={6} className="contact-item">
                    <div className="contact-icon"><Globe size={18} /></div>
                    <span>{channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}</span>
                  </Col>
                )}
                {channel.phone && (
                  <Col md={6} className="contact-item">
                    <div className="contact-icon"><Telephone size={18} /></div>
                    <a href={`tel:${channel.phone}`}>{channel.phone}</a>
                  </Col>
                )}
                {channel.email && (
                  <Col md={6} className="contact-item">
                    <div className="contact-icon"><Envelope size={18} /></div>
                    <a href={`mailto:${channel.email}`}>{channel.email}</a>
                  </Col>
                )}
                {channel.website && (
                  <Col md={6} className="contact-item">
                    <div className="contact-icon"><Globe size={18} /></div>
                    <a href={channel.website} target="_blank" rel="noopener noreferrer">{channel.website}</a>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* Tabs mejorados */}
        <div className="channel-tabs">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>
            <Tab eventKey="videos" title={<span><CameraVideo size={16} className="me-2" />Vidéos</span>}>
              {getCurrentVideos().length > 0 ? (
                <>
                  <div className="videos-grid">
                    {getCurrentVideos().map(video => (
                      <MiniVideoCard
                        key={video._id}
                        video={video}
                        onClick={handleVideoClick}
                        onSave={handleSaveToggle}
                        isOwnChannel={isOwner}
                        isSavedInitial={!!savedVideosMap[video._id]}
                      />
                    ))}
                  </div>
                  {getCurrentHasMore() && (
                    <LoadMoreBtn loading={loadingMore} loadMore={loadMoreFn} />
                  )}
                </>
              ) : (
                <Alert variant="info" className="text-center">
                  <CameraVideo size={40} className="mb-2 text-muted" />
                  <p className="mb-0">Aucune vidéo publiée pour le moment.</p>
                  {isOwner && (
                    <Button variant="primary" className="mt-3" onClick={() => history.push('/create-video-page')}>
                      <CameraVideo size={16} className="me-2" /> Publier une vidéo
                    </Button>
                  )}
                </Alert>
              )}
            </Tab>

            <Tab eventKey="about" title={<span><InfoCircle size={16} className="me-2" />À propos</span>}>
              <Card className="about-card">
                <Card.Body className="p-4">
                  <div className="about-section">
                    <div className="about-label">Description</div>
                    <div className="about-value">{channel.description || 'Aucune description fournie.'}</div>
                  </div>
                  <div className="about-section">
                    <div className="about-label">Secteur d'activité</div>
                    <div className="about-value">{channel.activity || 'Non spécifié'}</div>
                  </div>
                  <div className="about-section">
                    <div className="about-label">Membre depuis</div>
                    <div className="about-value">
                      {new Date(channel.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            {/* Tabs adicionales solo para el dueño del canal */}
            {isOwner && (
              <Tab eventKey="saved" title={<span><Bookmark size={16} className="me-2" />Sauvegardés</span>}>
                {savedVideos.length > 0 ? (
                  <>
                    <div className="videos-grid">
                      {savedVideos.map(video => (
                        <MiniVideoCard
                          key={video._id}
                          video={video}
                          onClick={handleVideoClick}
                          onSave={handleSaveToggle}
                          isOwnChannel={true}
                          isSavedInitial={true}
                        />
                      ))}
                    </div>
                    {getCurrentHasMore() && <LoadMoreBtn loading={loadingMore} loadMore={loadMoreFn} />}
                  </>
                ) : (
                  <Alert variant="info" className="text-center">
                    <Bookmark size={40} className="mb-2 text-muted" />
                    <p className="mb-0">Aucune vidéo sauvegardée.</p>
                  </Alert>
                )}
              </Tab>
            )}

            {isOwner && (
              <Tab eventKey="liked" title={<span><Heart size={16} className="me-2" />Aimés</span>}>
                {likedVideos.length > 0 ? (
                  <>
                    <div className="videos-grid">
                      {likedVideos.map(video => (
                        <MiniVideoCard
                          key={video._id}
                          video={video}
                          onClick={handleVideoClick}
                          onSave={handleSaveToggle}
                          isOwnChannel={true}
                          isSavedInitial={!!savedVideosMap[video._id]}
                        />
                      ))}
                    </div>
                    {getCurrentHasMore() && <LoadMoreBtn loading={loadingMore} loadMore={loadMoreFn} />}
                  </>
                ) : (
                  <Alert variant="info" className="text-center">
                    <Heart size={40} className="mb-2 text-muted" />
                    <p className="mb-0">Aucune vidéo aimée.</p>
                  </Alert>
                )}
              </Tab>
            )}
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default ChannelProfile;