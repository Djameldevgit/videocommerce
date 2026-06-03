// src/pages/Profile.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Container, 
  Spinner, 
  Alert, 
  Button,
  Tabs,
  Tab,
  Dropdown,
  Badge,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { 
  ThreeDotsVertical,
  Pencil, 
  Trash3,
  Star,
  Envelope,
  Telephone,
  GeoAlt,
  Globe,
  PersonBadge,
  Calendar3,
  Tv,
  Film,
  InfoCircle,
  CreditCard,
  CheckCircle,
  Clock,
  Briefcase,
  Building,
  Eye
} from 'react-bootstrap-icons';
import { getProfileUsers } from '../../redux/actions/profileAction';
import { getMyChannels, deleteChannel, CHANNEL_TYPES } from '../../redux/actions/channelAction';
import useUserPlan from '../../components/useUserPlan';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import VideoCardVertical from '../../components/VideoCardVertical';
import { getUserVideos } from '../../redux/actions/videoAction';
import './profile.css';

// ==================== CARD PARA CANAL ====================
const ChannelCard = ({ channel, onView, onEdit, onDelete, userRole, isOwner }) => {
  const isPending = channel.pending === true;
  const canEdit = userRole === 'admin' || isOwner;
  
  const getAvatarUrl = () => {
    if (!channel.avatar) return null;
    if (typeof channel.avatar === 'string') return channel.avatar;
    if (Array.isArray(channel.avatar) && channel.avatar.length > 0) {
      return channel.avatar[0]?.url || channel.avatar[0];
    }
    if (channel.avatar?.url) return channel.avatar.url;
    return null;
  };

  return (
    <div className="mini-card channel-card">
      <div className="card-header-gradient" style={{ 
        background: isPending ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #0d6efd, #0a58ca)'
      }}>
        <div className="card-avatar-wrapper">
          {getAvatarUrl() ? (
            <img src={getAvatarUrl()} alt={channel.name} />
          ) : (
            <div className="card-avatar-placeholder">
              <Building size={28} />
            </div>
          )}
        </div>
        
        <div className="card-status-badge">
          {isPending ? (
            <Badge bg="warning" text="dark" className="rounded-pill">
              <Clock size={10} className="me-1" /> En attente
            </Badge>
          ) : (
            <Badge bg="success" className="rounded-pill">
              <CheckCircle size={10} className="me-1" /> Approuvé
            </Badge>
          )}
        </div>
        
        {canEdit && (
          <Dropdown className="card-actions-dropdown">
            <Dropdown.Toggle variant="light" size="sm" className="rounded-circle">
              <ThreeDotsVertical size={14} />
            </Dropdown.Toggle>
            
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => onView(channel._id, isPending)}>
                <Eye size={12} className="me-2" /> Voir la chaîne
              </Dropdown.Item>
              
              <Dropdown.Item onClick={() => onEdit(channel._id)}>
                <Pencil size={12} className="me-2" /> Modifier
              </Dropdown.Item>
              
              <Dropdown.Divider />
              
              <Dropdown.Item onClick={() => onDelete(channel)} className="text-danger">
                <Trash3 size={12} className="me-2" /> Supprimer
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      
      <div className="card-body-custom">
        <h6 className="card-title">{channel.name}</h6>
        <div className="card-activity">
          <Briefcase size={12} className="me-1" />
          <span>{channel.activity}</span>
        </div>
        
        {channel.wilaya && (
          <div className="card-location">
            <GeoAlt size={10} className="me-1" />
            <span>{channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}</span>
          </div>
        )}
        
        <div className="card-stats">
          <div className="stat">
            <span className="stat-value">{channel.totalVideos || 0}</span>
            <span className="stat-label">Vidéos</span>
          </div>
          <div className="stat">
            <span className="stat-value">{channel.totalViews || 0}</span>
            <span className="stat-label">Vues</span>
          </div>
          <div className="stat">
            <span className="stat-value">{channel.followersCount || 0}</span>
            <span className="stat-label">Abonnés</span>
          </div>
        </div>
        
        <div className="card-actions">
          <Button size="sm" variant="outline-primary" onClick={() => onView(channel._id, isPending)}>
            <Eye size={12} className="me-1" /> Voir
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== TAB CANALES ====================
const ChannelsTab = ({ channels = [], loading, onViewChannel, onEditChannel, onDeleteChannel, userRole }) => {
  const [filter, setFilter] = useState('all');
  
  const pendingChannels = channels.filter(ch => ch.pending === true);
  const approvedChannels = channels.filter(ch => ch.pending === false);
  
  const getFilteredChannels = () => {
    if (filter === 'pending') return pendingChannels;
    if (filter === 'approved') return approvedChannels;
    return channels;
  };
  
  const filteredChannels = getFilteredChannels();
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="mt-2 text-muted">Chargement de vos chaînes...</p>
      </div>
    );
  }
  
  if (channels.length === 0) {
    return (
      <div className="empty-state">
        <Tv size={48} className="empty-icon" />
        <p className="empty-text">Vous n'avez encore aucune chaîne</p>
        <Button variant="primary" size="sm" className="rounded-pill mt-2" onClick={() => window.location.href = '/channel/new'}>
          Créer une chaîne
        </Button>
      </div>
    );
  }
  
  return (
    <div className="channels-tab">
      <div className="filter-buttons mb-4">
        <Button 
          variant={filter === 'all' ? 'primary' : 'outline-secondary'}
          size="sm"
          className="me-2 rounded-pill"
          onClick={() => setFilter('all')}
        >
          Toutes ({channels.length})
        </Button>
        <Button 
          variant={filter === 'pending' ? 'warning' : 'outline-secondary'}
          size="sm"
          className="me-2 rounded-pill"
          onClick={() => setFilter('pending')}
        >
          En attente ({pendingChannels.length})
        </Button>
        <Button 
          variant={filter === 'approved' ? 'success' : 'outline-secondary'}
          size="sm"
          className="rounded-pill"
          onClick={() => setFilter('approved')}
        >
          Approuvées ({approvedChannels.length})
        </Button>
      </div>
      
      <div className="cards-grid">
      <Row xs={2} sm={2} md={3} lg={4} className="g-2">
  {filteredChannels.map(channel => (
    <Col key={channel._id}>
      <ChannelCard 
        channel={channel}
        onView={onViewChannel}
        onEdit={onEditChannel}
        onDelete={onDeleteChannel}
        userRole={userRole}
        isOwner={channel.isOwner}
      />
    </Col>
  ))}
</Row>

      </div>
    </div>
  );
};

// ==================== TAB VIDEOS ====================
const VideosTab = ({ userId, isOwner, userRole }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { userVideos } = useSelector(state => state.video || { userVideos: { videos: [], loading: false } });
  const [filter, setFilter] = useState('all');
  
  const { videos, loading, pendingCount, approvedCount, total, page, hasMore } = userVideos;
  
  useEffect(() => {
    if (userId && auth?.token) {
      dispatch(getUserVideos(userId, filter, 1, 12));
    }
  }, [userId, filter, auth?.token, dispatch]);
  
  const loadMore = () => {
    if (hasMore && !loading) {
      dispatch(getUserVideos(userId, filter, page + 1, 12));
    }
  };
  
  // Filtrar localmente si el backend no soporta el filtro
  const getFilteredVideos = () => {
    if (filter === 'pending') return videos.filter(v => v.pendiente === true);
    if (filter === 'approved') return videos.filter(v => v.pendiente === false);
    return videos;
  };
  
  const filteredVideos = getFilteredVideos();
  
  if (loading && videos.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="mt-2 text-muted">Chargement de vos vidéos...</p>
      </div>
    );
  }
  
  if (videos.length === 0 && !loading) {
    return (
      <div className="empty-state text-center py-5">
        <Film size={48} className="empty-icon text-muted mb-3" />
        <p className="text-muted">Vous n'avez encore aucune vidéo</p>
        {isOwner && (
          <Button 
            variant="primary" 
            size="sm" 
            className="rounded-pill mt-2"
            onClick={() => window.location.href = '/create-video'}
          >
            <Film size={14} className="me-2" />
            Publier une vidéo
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="videos-tab">
      {/* Filtros */}
      <div className="filter-buttons mb-4">
        <Button 
          variant={filter === 'all' ? 'primary' : 'outline-secondary'}
          size="sm"
          className="me-2 rounded-pill"
          onClick={() => setFilter('all')}
        >
          <Film size={12} className="me-1" />
          Toutes ({total})
        </Button>
        
        <Button 
          variant={filter === 'pending' ? 'warning' : 'outline-secondary'}
          size="sm"
          className="me-2 rounded-pill"
          onClick={() => setFilter('pending')}
          disabled={pendingCount === 0}
        >
          <Clock size={12} className="me-1" />
          En attente ({pendingCount})
        </Button>
        
        <Button 
          variant={filter === 'approved' ? 'success' : 'outline-secondary'}
          size="sm"
          className="rounded-pill"
          onClick={() => setFilter('approved')}
          disabled={approvedCount === 0}
        >
          <CheckCircle size={12} className="me-1" />
          Publiées ({approvedCount})
        </Button>
      </div>
      
      {/* Grid de videos */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {filter === 'pending' 
              ? "Aucune vidéo en attente d'approbation"
              : "Aucune vidéo publiée"}
          </p>
        </div>
      ) : (
        <>
         <Row xs={2} sm={2} md={3} lg={4} className="g-2">
  {filteredVideos.map(video => (
    <Col key={video._id}>
      <div className="video-card-wrapper">
        <VideoCardVertical video={video} />
        <div className="video-status-badge-bottom">
          {video.pendiente ? (
            <Badge bg="warning" text="dark" className="rounded-pill">
              <Clock size={8} className="me-1" /> En attente
            </Badge>
          ) : (
            <Badge bg="success" className="rounded-pill">
              <CheckCircle size={8} className="me-1" /> Publiée
            </Badge>
          )}
        </div>
      </div>
    </Col>
  ))}
</Row>
          {hasMore && (
            <div className="text-center mt-4">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={loadMore}
                disabled={loading}
                className="rounded-pill"
              >
                {loading ? <Spinner size="sm" /> : 'Charger plus'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== TAB INFO ====================
const UserInfoTab = ({ user }) => {
  const infoItems = [
    { icon: <Envelope />, label: 'Email', value: user?.email },
    { icon: <Telephone />, label: 'Téléphone', value: user?.mobile },
    { icon: <GeoAlt />, label: 'Adresse', value: user?.address },
    { icon: <Globe />, label: 'Site web', value: user?.website, isLink: true }
  ];
  
  return (
    <div className="user-info-tab">
      {user?.story && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h6 className="section-subtitle">
              <PersonBadge size={16} className="me-2" />
              À propos
            </h6>
            <p className="mb-0 text-muted">{user.story}</p>
          </Card.Body>
        </Card>
      )}
      
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h6 className="section-subtitle mb-3">
            <InfoCircle size={16} className="me-2" />
            Informations de contact
          </h6>
          
          <div className="info-grid">
            {infoItems.map((item, idx) => item.value && (
              <div className="info-item" key={idx}>
                <span className="info-icon">{item.icon}</span>
                <div className="info-content">
                  <small className="text-muted">{item.label}</small>
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer">{item.value}</a>
                  ) : (
                    <p className="mb-0">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="member-since mt-3 pt-2 border-top">
            <Calendar3 size={14} className="me-2 text-muted" />
            <small className="text-muted">
              Membre depuis le {new Date(user?.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// ==================== TAB PLAN ====================
const PlanInfoTab = ({ planData }) => {
  const { 
    planName, 
    planLimits, 
    isUserPro, 
    hasActivePlan,
    getDaysRemaining,
    isExpired,
    planColor,
    planIcon
  } = planData;
  
  const planFeatures = [
    { label: 'Canaux max', value: planLimits?.maxChannels === 'unlimited' ? 'Illimité' : planLimits?.maxChannels },
    { label: 'Vidéos max', value: planLimits?.maxVideos === 'unlimited' ? 'Illimité' : planLimits?.maxVideos },
    { label: 'Durée max vidéo', value: `${planLimits?.maxDuration || 20} secondes` },
    { label: 'Upload HD', value: planLimits?.canUpload ? '✅ Oui' : '❌ Non' },
    { label: 'Analytiques', value: planLimits?.canAccessAnalytics ? '✅ Oui' : '❌ Non' }
  ];
  
  return (
    <div className="plan-info-tab">
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <div className="plan-header" style={{ borderBottomColor: planColor }}>
            <div className="plan-icon" style={{ backgroundColor: `${planColor}15`, color: planColor }}>
              {planIcon || (planName === 'Gratuit' ? '🆓' : '⭐')}
            </div>
            <div className="plan-details">
              <h5 className="mb-1">Plan {planName || 'Gratuit'}</h5>
              {isUserPro && hasActivePlan && getDaysRemaining() > 0 && (
                <Badge bg="info" className="rounded-pill">
                  <Clock size={10} className="me-1" />
                  {getDaysRemaining()} jours restants
                </Badge>
              )}
              {isExpired && (
                <Badge bg="danger" className="rounded-pill">
                  ⚠️ Expiré
                </Badge>
              )}
            </div>
          </div>
          
          <div className="plan-features mt-4">
            <h6 className="section-subtitle mb-3">Caractéristiques incluses</h6>
            <div className="features-list">
              {planFeatures.map((feature, idx) => (
                <div className="feature-row" key={idx}>
                  <span className="feature-label">{feature.label}</span>
                  <span className="feature-value">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL PROFILE ====================
const Profile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  
  const { profile, auth } = useSelector(state => state);
  const { userChannels = [], loading: channelsLoading } = useSelector(state => state.channel || {});
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('channels');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  
  const planData = useUserPlan();
  const { isUserPro } = planData;
  
  const hasLoadedChannelsRef = useRef(false);
  const userRole = auth.user?.role;
  
  useEffect(() => {
    if (!auth.token || !id) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        const isAlreadyLoaded = profile.ids?.includes(id);
        if (!isAlreadyLoaded) {
          await dispatch(getProfileUsers({ id, auth }));
        }
        
        if (!hasLoadedChannelsRef.current) {
          hasLoadedChannelsRef.current = true;
          await dispatch(getMyChannels(auth.token));
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Error loading profile:', err);
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, auth, dispatch, profile.ids]);
  
  const handleViewChannel = (channelId, isPending) => {
    if (isPending) {
      history.push(`/channel/${channelId}/owner`);
    } else {
      history.push(`/channel/${channelId}`);
    }
  };
  
  const handleEditChannel = (channelId) => {
    history.push(`/channel/${channelId}/edit`);
  };
  
  const handleDeleteClick = (channel) => {
    setChannelToDelete(channel);
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteChannel = async () => {
    if (!channelToDelete) return;
    
    const authToken = auth.token;
    if (!authToken) {
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: "Vous devez être connecté" } 
      });
      return;
    }
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/channels/${channelToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          reason: "Canal supprimé par le propriétaire depuis le profil" 
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        dispatch({ 
          type: CHANNEL_TYPES.DELETE_CHANNEL_SUCCESS, 
          payload: channelToDelete._id 
        });
        
        setTimeout(async () => {
          await dispatch(getMyChannels(authToken));
        }, 500);
        
        dispatch({ 
          type: GLOBALTYPES.ALERT, 
          payload: { success: data.message || "Canal supprimé avec succès" } 
        });
        
        setShowDeleteConfirm(false);
        setChannelToDelete(null);
      } else {
        throw new Error(data.message || data.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error('❌ Error deleteChannel:', err);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: err.message || "Erreur lors de la suppression" } 
      });
    } finally {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
  };
  
  // ==================== HANDLERS PERFIL ====================
  const handleEditProfile = () => history.push('/profile/settings');
  const handleDeleteProfile = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { info: "Fonctionnalité à venir" } 
      });
    }
  };
  const handleUpgradeToPro = () => history.push('/planes');
 
  const ownChannels = userChannels.map(ch => ({
    ...ch,
    isOwner: ch.owner?._id === id || ch.userId === id || ch.owner === id,
    pending: ch.pending === true
  }));
  
  if (!auth.token) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <Alert variant="warning" className="text-center">
            <h5>🔐 Authentification requise</h5>
            <p className="mb-0">Veuillez vous connecter pour voir les profils.</p>
          </Alert>
        </Container>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="profile-page">
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Chargement du profil...</p>
        </Container>
      </div>
    );
  }
  
  const currentUser = profile.users?.find(u => u._id === id);
  const isOwnProfile = auth.user?._id === id;
  
  if (!currentUser) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h5>👤 Profil non trouvé</h5>
            <p className="mb-0">L'utilisateur n'existe pas.</p>
          </Alert>
        </Container>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <Container className="py-4">
        
        {/* ========== PRIMERA FILA: Avatar + Dropdown ========== */}
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={currentUser.avatar || '/default-avatar.png'} 
                alt={currentUser.fullname || currentUser.username}
              />
            </div>
          </div>
          
          {isOwnProfile && (
            <Dropdown className="actions-dropdown">
              <Dropdown.Toggle variant="light" className="icon-btn">
                <ThreeDotsVertical size={20} />
              </Dropdown.Toggle>
              
              <Dropdown.Menu align="end">
                {/* ✅ ORDEN CORRECTO DE ACCIONES */}
                <Dropdown.Item onClick={handleUpgradeToPro} className="text-primary">
                  <Star size={14} className="me-2" /> Devenir UserPro
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item onClick={handleEditProfile}>
                  <Pencil size={14} className="me-2" /> Modifier le profil
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item onClick={handleDeleteProfile} className="text-danger">
                  <Trash3 size={14} className="me-2" /> Supprimer le profil
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        
        {/* ========== SEGUNDA FILA ========== */}
        <div className="profile-identity text-center">
          <h2 className="profile-name">
            {currentUser.fullname || currentUser.username}
          </h2>
          <p className="profile-email">
            <Envelope size={14} className="me-1" />
            {currentUser.email}
          </p>
          {isUserPro && (
            <Badge bg="primary" className="mt-2 rounded-pill">
              <Star size={10} className="me-1" /> UserPro
            </Badge>
          )}
        </div>
        
        {/* ========== TERCERA FILA: Tabs ========== */}
        <div className="profile-tabs mt-4">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="custom-tabs"
            fill
          >
            <Tab eventKey="channels" title={
              <span><Tv size={16} className="me-2" />Chaînes</span>
            }>
              <div className="tab-content-wrapper">
                <ChannelsTab 
                  channels={ownChannels}
                  loading={channelsLoading}
                  onViewChannel={handleViewChannel}
                  onEditChannel={handleEditChannel}
                  onDeleteChannel={handleDeleteClick}
                  userRole={userRole}
                />
              </div>
            </Tab>
            
            <Tab eventKey="videos" title={
              <span><Film size={16} className="me-2" />Vidéos</span>
            }>
              <div className="tab-content-wrapper">
                <VideosTab 
                  userId={id} 
                  isOwner={isOwnProfile}
                  userRole={userRole}
                />
              </div>
            </Tab>
            
            <Tab eventKey="info" title={
              <span><PersonBadge size={16} className="me-2" />Infos</span>
            }>
              <div className="tab-content-wrapper">
                <UserInfoTab user={currentUser} />
              </div>
            </Tab>
            
            <Tab eventKey="plan" title={
              <span><CreditCard size={16} className="me-2" />Plan</span>
            }>
              <div className="tab-content-wrapper">
                <PlanInfoTab planData={planData} />
              </div>
            </Tab>
          </Tabs>
        </div>
        
        {/* Modal de confirmación para eliminar canal */}
        {showDeleteConfirm && channelToDelete && (
          <div className="modal-overlay-custom" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-custom">
                <h3><Trash3 size={20} className="me-2 text-danger" /> Supprimer le canal</h3>
                <button className="btn-close-custom" onClick={() => setShowDeleteConfirm(false)}>✕</button>
              </div>
              <div className="modal-body-custom">
                <p>Êtes-vous sûr de vouloir supprimer définitivement le canal <strong>{channelToDelete.name}</strong> ?</p>
                <div className="warning-box-custom">
                  <span>⚠️</span>
                  <span>Cette action supprimera également toutes les vidéos associées et ne peut pas être annulée.</span>
                </div>
              </div>
              <div className="modal-footer-custom">
                <button className="btn-cancel-custom" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </button>
                <button className="btn-delete-custom" onClick={confirmDeleteChannel}>
                  <Trash3 size={14} className="me-2" />
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        )}
        
      </Container>
    </div>
  );
};

export default Profile;