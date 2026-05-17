// src/pages/channel/MisChannel.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner, 
  Badge,
  Alert,
  Toast
} from 'react-bootstrap';
import { 
  Tv, 
  Plus, 
  Pencil, 
  Eye, 
  GeoAlt, 
  Telephone, 
  Envelope, 
  Briefcase,
  CheckCircle,
  Building,
  ArrowUpCircle,
  InfoCircle,
  Star,
  Rocket,
  Crown
} from 'react-bootstrap-icons';
import { getUserChannels } from '../../redux/actions/channelAction';
import useUserPlan from '../../components/useUserPlan';
 
 
const MisChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token, user } = useSelector(state => state.auth);
  const { userChannels, loading } = useSelector(state => state.channel);
  
  // ✅ Hook para obtener el plan del usuario
  const { 
    currentPlan, 
    planName, 
    planLimits, 
    isUserPro, 
    hasActivePlan,
    isExpired,
    getDaysRemaining,
    planColor,
    planIcon
  } = useUserPlan();
  
  const [showUpgradeToast, setShowUpgradeToast] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  
  // ✅ Usar ref para evitar llamadas duplicadas
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (token && user && !hasLoadedRef.current && !loading) {
      hasLoadedRef.current = true;
      console.log('📱 Cargando canales del usuario...');
      dispatch(getUserChannels(token));
    }
  }, [token, user, loading, dispatch]);

  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
    };
  }, []);

  // ✅ Verificar si puede crear un nuevo canal
  const canCreateNewChannel = () => {
    const currentChannelCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    
    if (maxChannels === 'unlimited') return true;
    return currentChannelCount < maxChannels;
  };

  // ✅ Obtener canales restantes
  const getRemainingChannels = () => {
    const currentChannelCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    
    if (maxChannels === 'unlimited') return 'Illimité';
    const remaining = maxChannels - currentChannelCount;
    return remaining > 0 ? remaining : 0;
  };

  // ✅ Manejador para crear nueva chaîne
  const handleCreateChannel = () => {
    if (!canCreateNewChannel()) {
      setShowLimitAlert(true);
      setTimeout(() => setShowLimitAlert(false), 5000);
      return;
    }
    history.push('/channel/new');
  };

  // ✅ Renderizar badge del plan
  const renderPlanBadge = () => {
    const planIcons = {
      free: '🆓',
      basic: '⭐',
      pro: '🚀',
      business: '👑'
    };
    
    const planNames = {
      free: 'Gratuit',
      basic: 'Basic',
      pro: 'Pro',
      business: 'Business'
    };
    
    return (
      <div className="plan-badge" style={{ backgroundColor: `${planColor}15`, borderColor: planColor }}>
        <span style={{ color: planColor }}>{planIcons[currentPlan] || '🆓'}</span>
        <span style={{ color: planColor }}>Plan {planNames[currentPlan] || 'Gratuit'}</span>
        {isUserPro && hasActivePlan && getDaysRemaining > 0 && (
          <span className="plan-days" style={{ color: planColor }}>
            ({getDaysRemaining} jours restants)
          </span>
        )}
        {isExpired && (
          <span className="plan-expired">⚠️ Expiré</span>
        )}
      </div>
    );
  };

  // ✅ Renderizar información de límites
  const renderLimitInfo = () => {
    const currentCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    const remaining = getRemainingChannels();
    const percentage = maxChannels === 'unlimited' ? 100 : (currentCount / maxChannels) * 100;
    
    if (!isUserPro && currentPlan === 'free') {
      return (
        <Alert variant="info" className="mt-3">
          <div className="d-flex align-items-center gap-2">
            <InfoCircle size={20} />
            <div>
              <strong>Plan Gratuit</strong>
              <p className="mb-0 small">
                Vous avez {currentCount}/1 canal. 
                <a href="/become-pro" className="ms-2">Passez à UserPro</a> pour créer plus de canaux.
              </p>
            </div>
          </div>
        </Alert>
      );
    }
    
    return (
      <div className={`plan-limit-card ${!canCreateNewChannel() ? 'limit-reached' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold">📊 Canaux utilisés</span>
          <span className="fw-bold">📊 Restants</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>{currentCount} / {maxChannels === 'unlimited' ? '∞' : maxChannels}</span>
          <span>{remaining === 'Illimité' ? '∞' : remaining}</span>
        </div>
        <div className="progress" style={{ height: '8px' }}>
          <div 
            className={`progress-bar ${!canCreateNewChannel() ? 'bg-danger' : 'bg-success'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {!canCreateNewChannel() && (
          <Alert variant="danger" className="mt-3 mb-0 py-2">
            <strong>⚠️ Limite atteinte !</strong> Vous ne pouvez pas créer plus de {maxChannels} canal{maxChannels > 1 ? 'x' : ''}.
            <a href="/become-pro" className="ms-2">Passez au plan supérieur</a>
          </Alert>
        )}
      </div>
    );
  };

  if (loading && userChannels.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Chargement de vos chaînes...</span>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Container className="py-4">
        {/* Toast de upgrade */}
        <Toast 
          show={showUpgradeToast} 
          onClose={() => setShowUpgradeToast(false)}
          className="position-fixed top-0 end-0 m-3"
          style={{ zIndex: 9999 }}
          delay={5000}
          autohide
        >
          <Toast.Header className="bg-warning">
            <strong className="me-auto">💡 Astuce</strong>
          </Toast.Header>
          <Toast.Body>
            Passez à UserPro pour débloquer plus de canaux et de fonctionnalités !
            <Button size="sm" variant="primary" className="ms-2" onClick={() => history.push('/become-pro')}>
              Upgrade
            </Button>
          </Toast.Body>
        </Toast>

        {/* Alert de limite atteinte */}
        <Alert 
          show={showLimitAlert} 
          variant="danger" 
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 9999, minWidth: '300px' }}
          onClose={() => setShowLimitAlert(false)}
          dismissible
        >
          <div className="d-flex align-items-center gap-2">
            <span>⚠️</span>
            <div>
              <strong>Vous ne pouvez pas créer plus de canaux !</strong>
              <br />
              <small>Votre plan {planName} permet maximum {planLimits?.maxChannels || 1} canal. Passez à un plan supérieur.</small>
            </div>
          </div>
        </Alert>

        {/* En-tête */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-4 gap-3">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <h1 className="h2 fw-bold text-dark d-flex align-items-center gap-2 mb-0">
              <Tv className="text-primary" size={32} />
              Mes chaînes
              {userChannels.length > 0 && (
                <Badge bg="secondary" pill className="ms-2">{userChannels.length}</Badge>
              )}
            </h1>
            {renderPlanBadge()}
          </div>
         
        </div>

        {/* Information du plan et limites */}
        <div className="mb-4">
          {renderLimitInfo()}
        </div>

        {/* Liste des chaînes */}
        {userChannels.length === 0 ? (
          <Card className="text-center p-5 shadow-sm border-0">
            <Tv size={64} className="text-muted mx-auto mb-3" />
            <h5 className="text-muted">Vous n'avez encore aucune chaîne</h5>
            <p className="text-muted mb-4">Créez votre première chaîne pour commencer à publier des vidéos commerciales.</p>
            <Button 
              variant="primary" 
              onClick={handleCreateChannel} 
              className="mx-auto rounded-pill px-4"
              disabled={!canCreateNewChannel()}
            >
              <Plus size={18} className="me-2" /> Créer ma première chaîne
            </Button>
            {!canCreateNewChannel() && (
              <p className="text-danger mt-3 small">
                ⚠️ Vous avez atteint la limite de {planLimits?.maxChannels || 1} canal pour votre plan {planName}.
              </p>
            )}
          </Card>
        ) : (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {userChannels.map(channel => (
                <Col key={channel._id}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow transition-all">
                    <div className="position-relative bg-gradient-primary text-white p-3 rounded-top" style={{ height: '100px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
                      <div className="position-absolute bottom-0 start-50 translate-middle">
                        <div className="bg-white rounded-circle p-1 shadow-sm">
                          {channel.avatar ? (
                            <img src={channel.avatar} alt={channel.name} width="70" height="70" className="rounded-circle object-fit-cover" />
                          ) : (
                            <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                              <Building size={32} className="text-secondary" />
                            </div>
                          )}
                        </div>
                      </div>
                      {channel.isVerified && (
                        <Badge bg="info" className="position-absolute top-0 end-0 m-2 rounded-pill d-flex align-items-center gap-1">
                          <CheckCircle size={12} /> Vérifié
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="pt-5 text-center">
                      <Card.Title className="fw-bold">{channel.name}</Card.Title>
                      <div className="d-flex justify-content-center gap-2 mb-2">
                        <Badge bg="light" text="dark" className="rounded-pill px-3 py-1">
                          <Briefcase size={12} className="me-1" /> {channel.activity || 'Activité'}
                        </Badge>
                      </div>
                      {channel.wilaya && (
                        <div className="text-muted small mb-1">
                          <GeoAlt size={12} className="me-1" /> {channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}
                        </div>
                      )}
                      {channel.phone && (
                        <div className="text-muted small mb-1">
                          <Telephone size={12} className="me-1" /> {channel.phone}
                        </div>
                      )}
                      {channel.email && (
                        <div className="text-muted small mb-2 text-truncate">
                          <Envelope size={12} className="me-1" /> {channel.email}
                        </div>
                      )}
                      {channel.description && (
                        <div className="text-muted small mt-2 text-start border-top pt-2">
                          {channel.description.length > 80 ? channel.description.substring(0, 80) + '…' : channel.description}
                        </div>
                      )}
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0 d-flex justify-content-between">
                      <Link to={`/channel/${channel._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        <Eye size={14} className="me-1" /> Voir
                      </Link>
                      <Link to={`/channel/${channel._id}/settings`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                        <Pencil size={14} className="me-1" /> Modifier
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* Afficher les slots restants */}
            {canCreateNewChannel() && (
              <div className="text-center mt-4">
                <small className="text-muted">
                  ℹ️ Il vous reste {getRemainingChannels()} emplacement{getRemainingChannels() > 1 ? 's' : ''} disponible{getRemainingChannels() > 1 ? 's' : ''} pour créer de nouvelles chaînes.
                </small>
              </div>
            )}
          </>
        )}
      </Container>

      <style jsx="true">{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-shadow:hover { transform: translateY(-4px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
        .object-fit-cover { object-fit: cover; }
        
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
        
        .plan-days {
          font-size: 11px;
        }
        
        .plan-expired {
          font-size: 11px;
          color: #dc3545;
        }
        
        .plan-limit-card {
          background: white;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
        }
        
        .plan-limit-card.limit-reached {
          background: #fff3cd;
          border-color: #ffc107;
        }
        
        .progress {
          background-color: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .plan-badge {
            font-size: 11px;
            padding: 4px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default MisChannel;