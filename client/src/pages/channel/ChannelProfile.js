// src/pages/channel/ChannelProfile.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import { 
  Tv, Heart, Eye, Calendar,  Telephone, Envelope, Globe, 
  Pencil, CheckCircle, CameraVideo, InfoCircle, PeopleFill
} from 'react-bootstrap-icons';
import { getChannelProfile, toggleFollowChannel } from '../../redux/actions/channelAction';
import VideoCard from '../../components/VideoCard';   // ← Mismo componente que en Home
import { formatNumber } from '../../utils/format';
import './ChannelProfile.css';

const ChannelProfile = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const { channel, loading } = useSelector(state => state.channel);
  const [activeTab, setActiveTab] = useState('videos');
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (channelId) {
      dispatch(getChannelProfile(channelId, token));
    }
  }, [channelId, dispatch, token]);

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

  const isOwner = user?._id === channel?.owner?._id;

  if (loading) {
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
        {/* Cabecera */}
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
              <Button 
                variant={following ? "secondary" : "primary"}
                onClick={handleFollow}
                className={`btn-subscribe ${following ? 'btn-subscribed' : ''}`}
              >
                <Heart size={16} className="me-2" />
                {following ? `Abonné (${formatNumber(followersCount)})` : `S'abonner (${formatNumber(followersCount)})`}
              </Button>
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
                <p size={20} /> Contact et localisation
              </h5>
              <Row>
                {channel.wilaya && (
                  <Col md={6} className="contact-item">
                    <div className="contact-icon"><p size={18} /></div>
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

        {/* Contenido con Tabs */}
        <div className="channel-tabs">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>
            <Tab eventKey="videos" title={<span><CameraVideo size={16} className="me-2" />Vidéos</span>}>
              {channel.recentVideos && channel.recentVideos.length > 0 ? (
                <div className="videos-grid">
                  {channel.recentVideos.map(video => (
                    <VideoCard key={video._id} video={video} showChannel={false} />
                  ))}
                </div>
              ) : (
                <Alert variant="info" className="text-center">
                  <CameraVideo size={40} className="mb-2 text-muted" />
                  <p className="mb-0">Aucune vidéo publiée pour le moment.</p>
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
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default ChannelProfile;