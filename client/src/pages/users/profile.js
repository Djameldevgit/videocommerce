// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { 
  Container, 
  Spinner, 
  Alert, 
  Button,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { 
  Pencil, 
  Tv, 
  ArrowUpCircle,
  Envelope,
  Telephone,
  GeoAlt,
  Globe,
  PersonBadge,
  Calendar3,
  
} from 'react-bootstrap-icons';
import Info from '../../components/profile/Info';
import { getProfileUsers } from '../../redux/actions/profileAction';
import useUserPlan from '../../components/useUserPlan';
import './profile.css';

const Profile = () => {
  const { profile, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  
  const { 
    currentPlan, 
    planName, 
    planLimits, 
    isUserPro, 
    hasActivePlan,
    getDaysRemaining,
    isExpired,
    planColor,
    planIcon
  } = useUserPlan();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.token || !id) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const isAlreadyLoaded = profile.ids?.includes(id);
        
        if (!isAlreadyLoaded) {
          await dispatch(getProfileUsers({ id, auth }));
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Error loading profile:', err);
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, auth, dispatch, profile.ids]);

  // ==================== RENDERIZADO CONDICIONAL ====================
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

  if (error) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h5>⚠️ Erreur</h5>
            <p className="mb-0">{error}</p>
          </Alert>
        </Container>
      </div>
    );
  }

  const userExists = profile.users?.some(user => user._id === id);
  if (!userExists) {
    return (
      <div className="profile-page">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h5>👤 Profil non trouvé</h5>
            <p className="mb-0">L'utilisateur avec l'ID {id} n'existe pas.</p>
          </Alert>
        </Container>
      </div>
    );
  }

  const isOwnProfile = auth.user?._id === id;
  const currentUser = profile.users.find(u => u._id === id);

  // ==================== HANDLERS ====================
  const handleNavigateChannels = () => history.push('/my-channels');
 
  const handleEditProfile = () => history.push('/profile/settings');
  const handleUpgrade = () => history.push('/userpro');

  // ==================== RENDER PLAN BADGE ====================
  const renderPlanBadge = () => {
    if (!isOwnProfile) return null;
    
    if (!isUserPro && currentPlan === 'free') {
      return (
        <div className="plan-badge free">
          <span>🆓</span>
          <span>Plan Gratuit</span>
          <Button size="sm" variant="primary" className="upgrade-badge-btn" onClick={handleUpgrade}>
            ⬆️ userPro
          </Button>
        </div>
      );
    }
    
    return (
      <div className="plan-badge" style={{ backgroundColor: `${planColor}15`, borderColor: planColor }}>
        <span style={{ color: planColor }}>{planIcon}</span>
        <span style={{ color: planColor }}>Plan {planName}</span>
        {isUserPro && hasActivePlan && getDaysRemaining > 0 && (
          <span className="plan-days-badge" style={{ color: planColor }}>
            ({getDaysRemaining} j)
          </span>
        )}
        {isExpired && <span className="plan-expired-badge">⚠️ Expiré</span>}
      </div>
    );
  };

  // ==================== RENDER PLAN LIMITS ====================
  const renderPlanLimits = () => {
    if (!isOwnProfile) return null;
    
    const maxChannels = planLimits?.maxChannels || 1;
    const maxVideos = planLimits?.maxVideos || 5;
    const maxDuration = planLimits?.maxDuration || 20;
    
    return (
      <Card className="plan-limits-card">
        <Card.Body>
          <h6>📋 Mon abonnement {planName}</h6>
          <div className="plan-features-list">
            <div className="feature-item">
              <span>📺 Canaux</span>
              <strong>{maxChannels === 'unlimited' ? '∞ Illimité' : maxChannels}</strong>
            </div>
            <div className="feature-item">
              <span>📹 Vidéos</span>
              <strong>{maxVideos === 'unlimited' ? '∞ Illimité' : maxVideos}</strong>
            </div>
            <div className="feature-item">
              <span>⏱️ Durée max</span>
              <strong>{maxDuration} sec</strong>
            </div>
            <div className="feature-item">
              <span>🎬 HD</span>
              <strong>{planLimits?.canUpload ? '✅ Oui' : '❌ Non'}</strong>
            </div>
            <div className="feature-item">
              <span>📊 Analytics</span>
              <strong>{planLimits?.canAccessAnalytics ? '✅ Oui' : '❌ Non'}</strong>
            </div>
          </div>
          
          {!isUserPro && (
            <Button variant="primary" size="sm" className="upgrade-btn" onClick={handleUpgrade}>
              <ArrowUpCircle size={14} /> Passer à UserPro
            </Button>
          )}
          
          {isUserPro && currentPlan !== 'business' && (
            <Button variant="warning" size="sm" className="upgrade-btn" onClick={handleUpgrade}>
              🚀 Plan supérieur
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };
 
  const renderPersonalInfo = () => {
    const infoItems = [
      { icon: <Envelope />, label: 'Email', value: currentUser?.email, condition: currentUser?.email },
      { icon: <Telephone />, label: 'Téléphone', value: currentUser?.mobile, condition: currentUser?.mobile },
      { icon: <GeoAlt />, label: 'Adresse', value: currentUser?.address, condition: currentUser?.address },
      { icon: <Globe />, label: 'Site web', value: currentUser?.website, condition: currentUser?.website, isLink: true }
    ];

    return (
      <Card className="about-card">
        <Card.Body>
          <h5 className="section-title">
            <PersonBadge size={18} /> À propos
          </h5>
          
          {currentUser?.story && (
            <div className="info-bio">
              <p>{currentUser.story}</p>
            </div>
          )}
          
          <div className="info-grid">
            {infoItems.map((item, idx) => item.condition && (
              <div className="info-item" key={idx}>
                <span className="info-icon">{item.icon}</span>
                <div className="info-content">
                  <small>{item.label}</small>
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer">{item.value}</a>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="member-since">
            <Calendar3 size={14} />
            <small>
              Membre depuis le {new Date(currentUser?.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </small>
          </div>
        </Card.Body>
      </Card>
    );
  };

  // ==================== RENDER ====================
  return (
    <div className="profile-page">
      <Container className="py-3">
        
        {/* HEADER ACTIONS */}
        <div className="action-header">
          {isOwnProfile && (
            <div className="action-buttons">
              <Button variant="outline-primary" className="action-btn" onClick={handleEditProfile}>
                <Pencil size={16} /> Modifier
              </Button>
              <Button variant="primary" className="action-btn" onClick={handleNavigateChannels}>
                <Tv size={16} /> Mes chaînes
              </Button>
            </div>
          )}
          {renderPlanBadge()}
        </div>

        {/* INFO COMPONENT */}
        <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

        {/* PLAN LIMITS (solo dueño) */}
        {renderPlanLimits()}

        {/* STATS CARDS */}
       

        {/* PERSONAL INFO */}
        {renderPersonalInfo()}

      </Container>
    </div>
  );
};

export default Profile;