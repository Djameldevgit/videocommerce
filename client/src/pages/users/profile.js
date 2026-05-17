// src/pages/Profile.jsx (parte corregida)
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
  Bookmark, 
  Grid, 
  Heart,
  Camera,
  FileText,
  ChevronRight,
  Tv,
  ArrowUpCircle
} from 'react-bootstrap-icons';
import Info from '../../components/profile/Info';
import { getProfileUsers } from '../../redux/actions/profileAction';
import useUserPlan from '../../components/useUserPlan';
 
const Profile = () => {
  const { profile, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  
  // ✅ Obtener información del plan del usuario (valores directos)
  const { 
    currentPlan, 
    planName, 
    planLimits, 
    isUserPro, 
    hasActivePlan,      // ✅ Esto es un booleano ahora
    getDaysRemaining,   // ✅ Esto es un número ahora
    isExpired,          // ✅ Esto es un booleano ahora
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
        const isAlreadyLoaded = profile.ids.includes(id);
        
        if (!isAlreadyLoaded) {
          await dispatch(getProfileUsers({ id, auth }));
        }
        
        setError(null);
      } catch (err) {
        console.error('❌ Erreur chargement profil:', err);
        setError("Impossible de charger le profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, auth, dispatch, profile.ids]);

  if (!auth.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir les profils.</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du profil...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>Erreur</h4>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  const userExists = profile.users.some(user => user._id === id);
  if (!userExists) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>Profil non trouvé</h4>
          <p>L'utilisateur avec l'ID {id} n'existe pas.</p>
        </Alert>
      </Container>
    );
  }

  const isOwnProfile = auth.user?._id === id;
  const currentUser = profile.users.find(u => u._id === id);

  const handleNavigateChannels = () => {
    history.push('/my-channels');
  };

  // ✅ Renderizar badge du plan
  const renderPlanBadge = () => {
    if (!isUserPro && currentPlan === 'free') {
      return (
        <div className="plan-badge free">
          <span>🆓</span>
          <span>Plan Gratuit</span>
          <Button 
            size="sm" 
            variant="primary" 
            className="ms-2 upgrade-badge-btn"
            onClick={() => history.push('/userpro')}
          >
            ⬆️ Upgrade
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
            ({getDaysRemaining} jours restants)
          </span>
        )}
        {isExpired && (
          <span className="plan-expired-badge">⚠️ Expiré</span>
        )}
      </div>
    );
  };

  // ✅ Renderizar límites del plan
  const renderPlanLimits = () => {
    if (!isOwnProfile) return null;
    
    const maxChannels = planLimits?.maxChannels || 1;
    const maxVideos = planLimits?.maxVideos || 5;
    const maxDuration = planLimits?.maxDuration || 20;
    
    return (
      <Card className="plan-limits-card mt-3">
        <Card.Body className="p-3">
          <h6 className="fw-bold mb-2">
            📋 Votre abonnement {planName}
          </h6>
          <div className="plan-features-list">
            <div className="feature-item">
              <span>📺 Canaux maximum:</span>
              <strong>{maxChannels === 'unlimited' ? '∞ Illimité' : maxChannels}</strong>
            </div>
            <div className="feature-item">
              <span>📹 Vidéos maximum:</span>
              <strong>{maxVideos === 'unlimited' ? '∞ Illimité' : maxVideos}</strong>
            </div>
            <div className="feature-item">
              <span>⏱️ Durée max par vidéo:</span>
              <strong>{maxDuration} secondes</strong>
            </div>
            <div className="feature-item">
              <span>🎬 Qualité HD:</span>
              <strong>{planLimits?.canUpload ? '✅ Oui' : '❌ Non'}</strong>
            </div>
            <div className="feature-item">
              <span>📊 Analytiques:</span>
              <strong>{planLimits?.canAccessAnalytics ? '✅ Oui' : '❌ Non'}</strong>
            </div>
            <div className="feature-item">
              <span>🎵 Musique:</span>
              <strong>{planLimits?.canAddMusic ? '✅ Oui' : '❌ Non'}</strong>
            </div>
          </div>
          
          {!isUserPro && (
            <Button 
              variant="primary" 
              size="sm" 
              className="mt-3 w-100"
              onClick={() => history.push('/userpro')}
            >
              <ArrowUpCircle size={14} className="me-1" />
              Passer à UserPro
            </Button>
          )}
          
          {isUserPro && currentPlan !== 'business' && (
            <Button 
              variant="warning" 
              size="sm" 
              className="mt-3 w-100"
              onClick={() => history.push('/userpro')}
            >
              🚀 Passer au plan supérieur
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };

  // ✅ Renderizar badge de plan en el header del perfil (Info component)
  // Esto se pasa como prop al componente Info o se muestra directamente

  return (
    <div className="profile-page">
      <Container className="py-4">
        {/* En-tête avec boutons d'action */}
        <div className="action-header">
          {isOwnProfile && (
            <div className="action-buttons">
              <Button
                variant="outline-primary"
                onClick={() => history.push('/profile/settings')}
                className="rounded-pill action-btn"
              >
                <Pencil size={16} className="me-2" />
                Modifier le profil
              </Button>
              <Button
                variant="primary"
                onClick={handleNavigateChannels}
                className="rounded-pill action-btn"
              >
                <Tv size={16} className="me-2" />
                Mes chaînes
              </Button>
            </div>
          )}
          {renderPlanBadge()}
        </div>

        {/* Info du profil */}
        <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

        {/* Límites del plan */}
        {renderPlanLimits()}

        {/* Statistiques */}
        <Row className="g-3 mb-5 mt-2">
          <Col xs={6} md={4}>
            <Card className="stats-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-primary-soft">
                  <Grid size={22} className="text-primary" />
                </div>
                <div className="ms-3">
                  <small className="text-muted d-block">Publications</small>
                  <h4 className="mb-0 fw-bold">
                    {currentUser?.posts?.length || currentUser?.postCount || 0}
                  </h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={4}>
            <Card className="stats-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-success-soft">
                  <Heart size={22} className="text-success" />
                </div>
                <div className="ms-3">
                  <small className="text-muted d-block">Abonnés</small>
                  <h4 className="mb-0 fw-bold">
                    {currentUser?.followers?.length || 0}
                  </h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={4}>
            <Card className="stats-card h-100">
              <Card.Body className="d-flex align-items-center">
                <div className="stat-icon bg-info-soft">
                  <Camera size={22} className="text-info" />
                </div>
                <div className="ms-3">
                  <small className="text-muted d-block">Abonnements</small>
                  <h4 className="mb-0 fw-bold">
                    {currentUser?.following?.length || 0}
                  </h4>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sections propriétaire */}
        {isOwnProfile && (
          <>
            <h5 className="section-title">Mes sections</h5>
            <Row className="g-3 mb-5">
              <Col md={6}>
                <Card className="nav-card h-100" onClick={() => history.push('/mes-annonces')}>
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="nav-icon bg-primary-soft">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1 fw-bold">Mes annonces</h6>
                        <small className="text-muted">Gérer vos publications</small>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-primary" />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="nav-card h-100" onClick={() => history.push(`/profile/${id}/saved`)}>
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="nav-icon bg-success-soft">
                        <Bookmark size={24} className="text-success" />
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-1 fw-bold">Mes favoris</h6>
                        <small className="text-muted">Publications sauvegardées</small>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-success" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* À propos */}
        <Card className="about-card mt-2">
          <Card.Body className="p-4">
            <h5 className="section-title mb-3">À propos</h5>
            <Row>
              {currentUser?.mobile && (
                <Col md={6} className="mb-3">
                  <small className="text-muted d-block">Téléphone</small>
                  <p className="mb-0">{currentUser.mobile}</p>
                </Col>
              )}
              {currentUser?.address && (
                <Col md={6} className="mb-3">
                  <small className="text-muted d-block">Adresse</small>
                  <p className="mb-0">{currentUser.address}</p>
                </Col>
              )}
              {currentUser?.website && (
                <Col md={6} className="mb-3">
                  <small className="text-muted d-block">Site web</small>
                  <p className="mb-0">
                    <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      {currentUser.website}
                    </a>
                  </p>
                </Col>
              )}
              {currentUser?.story && (
                <Col xs={12} className="mb-3">
                  <small className="text-muted d-block">Bio</small>
                  <p className="mb-0">{currentUser.story}</p>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* Membre depuis */}
        <div className="text-center mt-4">
          <small className="text-muted">
            Membre depuis le {new Date(currentUser?.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </small>
        </div>
      </Container>

      <style jsx="true">{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          padding-bottom: 2rem;
        }
        .action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .action-btn {
          font-size: 0.9rem;
          padding: 0.5rem 1.2rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }
        .plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 30px;
          border: 1px solid;
          font-size: 13px;
          font-weight: 500;
          background: white;
        }
        .plan-badge.free {
          background: #f8f9fa;
          border-color: #dee2e6;
          color: #6c757d;
        }
        .plan-limits-card {
          border: none;
          border-radius: 1rem;
          background: linear-gradient(135deg, #667eea08, #764ba208);
          border: 1px solid #e0e0e0;
          margin-bottom: 1.5rem;
        }
        .plan-features-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .feature-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 6px 0;
          border-bottom: 1px dashed #e0e0e0;
        }
        .stats-card {
          border: none;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }
        .bg-primary-soft { background-color: rgba(13, 110, 253, 0.12); }
        .bg-success-soft { background-color: rgba(25, 135, 84, 0.12); }
        .bg-info-soft { background-color: rgba(13, 202, 240, 0.12); }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1e293b;
          border-left: 4px solid #0d6efd;
          padding-left: 12px;
        }
        .nav-card {
          border: none;
          border-radius: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }
        .nav-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }
        .about-card {
          border: none;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
        }
        @media (max-width: 576px) {
          .action-header { flex-direction: column; align-items: stretch; }
          .action-buttons { justify-content: stretch; }
          .action-btn { flex: 1; justify-content: center; }
          .plan-features-list { grid-template-columns: 1fr; }
          .stat-icon { width: 44px; height: 44px; }
          .stats-card h4 { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
};

export default Profile;