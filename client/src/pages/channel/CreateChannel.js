// src/pages/channel/CreateChannel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Tv, ArrowLeft, Building, InfoCircle, CheckCircle, Star, Rocket, Crown } from 'react-bootstrap-icons';
import { createChannel } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';
import WilayaCommuneField from './WilayaCommuneField';
import useUserPlan from '../../components/useUserPlan';
 
 
const CreateChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token, auth, socket } = useSelector(state => state.auth || {}); // ✅ Default empty object
  const { categories, loading: loadingCategories, error: categoriesError } = useSelector(state => state.category || {});
  
  // ✅ Verificar que auth existe antes de usar el hook
  const userPlanData = useUserPlan();
  const { 
    currentPlan = 'free', 
    planName = 'Gratuit', 
    planLimits = { maxChannels: 1, maxVideos: 5, maxDuration: 20 },
    isUserPro = false, 
    canCreateChannel: canCreateChannelFn = () => false,
    getDaysRemaining = () => 0,
    hasActivePlan = () => false,
    isExpired = () => false
  } = userPlanData || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userChannels, setUserChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    description: '',
    wilaya: '',
    commune: '',
    phone: '',
    email: '',
    website: ''
  });

  // ✅ Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!auth || !auth.user) {
      console.log('⚠️ Utilisateur non authentifié, redirection vers login');
      history.push('/login');
      return;
    }
  }, [auth, history]);

  // ✅ Cargar canales existentes del usuario
  useEffect(() => {
    const fetchUserChannels = async () => {
      // ✅ Verificar que auth y token existen
      if (!auth?.user?._id || !token) {
        console.log('⏳ Attente de chargement de l\'authentification...');
        return;
      }
      
      try {
        setLoadingChannels(true);
        const response = await fetch(`/api/channels/user/${auth.user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUserChannels(data.channels || []);
      } catch (err) {
        console.error('Error fetching user channels:', err);
      } finally {
        setLoadingChannels(false);
      }
    };
    
    fetchUserChannels();
  }, [auth?.user?._id, token]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getMainCategories(1, 100, false));
    }
  }, [dispatch, categories]);

  // ✅ Verificar si puede crear un nuevo canal
  const canCreateNewChannel = () => {
    const currentChannelCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    
    if (maxChannels === 'unlimited') return true;
    return currentChannelCount < maxChannels;
  };

  const getRemainingSlots = () => {
    const currentChannelCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    if (maxChannels === 'unlimited') return 'Illimité';
    const remaining = maxChannels - currentChannelCount;
    return remaining > 0 ? remaining : 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleWilayaChange = (wilaya) => {
    setFormData(prev => ({ ...prev, wilaya }));
    if (error) setError(null);
  };

  const handleCommuneChange = (commune) => {
    setFormData(prev => ({ ...prev, commune }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // ✅ Verificar autenticación
    if (!auth?.user?._id || !token) {
      setError("❌ Session expirée. Veuillez vous reconnecter.");
      setTimeout(() => history.push('/login'), 2000);
      return;
    }
    
    // Verificar límite de canales
    if (!canCreateNewChannel()) {
      setError(`❌ Limite atteinte ! Votre plan ${planName} permet maximum ${planLimits?.maxChannels || 1} canal${planLimits?.maxChannels > 1 ? 'x' : ''}. Passez à un plan supérieur pour créer plus de canaux.`);
      return;
    }
    
    // Validación del formulario HTML5
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    // Validación adicional del nombre
    if (!formData.name.trim()) {
      setError("Le nom de la chaîne est obligatoire");
      setValidated(true);
      return;
    }
  
    // Validación de categoría
    if (!formData.activity) {
      setError("Veuillez sélectionner une activité/secteur");
      setValidated(true);
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await dispatch(createChannel(formData, token, auth, socket));
      
      if (res?.success) {
        setSuccess(true);
        setUserChannels(prev => [...prev, res.channel]);
        setFormData({
          name: '',
          activity: '',
          description: '',
          wilaya: '',
          commune: '',
          phone: '',
          email: '',
          website: ''
        });
        setValidated(false);
        
        setTimeout(() => {
          history.push('/my-channels');
        }, 2000);
      } else {
        const errorMsg = res?.message || "Erreur lors de la création de la chaîne";
        
        if (errorMsg.includes('déjà') || errorMsg.includes('existe') || errorMsg.includes('Ya tienes')) {
          setError(`❌ Un canal avec le nom "${formData.name}" existe déjà. Veuillez choisir un autre nom.`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('❌ Error en createChannel:', err);
      
      if (err.message?.includes('Network')) {
        setError("❌ Problème de connexion réseau. Vérifiez votre connexion internet.");
      } else if (err.response?.status === 400) {
        const serverMsg = err.response?.data?.message;
        if (serverMsg?.includes('nom') || serverMsg?.includes('name')) {
          setError(`❌ Le nom "${formData.name}" est déjà utilisé. Choisissez un autre nom.`);
        } else {
          setError(serverMsg || "❌ Données invalides. Vérifiez les champs.");
        }
      } else if (err.response?.status === 401) {
        setError("❌ Session expirée. Veuillez vous reconnecter.");
        setTimeout(() => history.push('/login'), 2000);
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.message || "❌ Vous avez atteint la limite de canaux autorisés pour votre plan.");
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Renderizar badge del plan con verificaciones de seguridad
  const renderPlanBadge = () => {
    const planIcons = {
      free: '🆓',
      basic: '⭐',
      pro: '🚀',
      business: '👑'
    };
    
    const planColors = {
      free: '#6c757d',
      basic: '#667eea',
      pro: '#f093fb',
      business: '#f6b93b'
    };
    
    return (
      <div className="plan-badge-container" style={{ borderLeftColor: planColors[currentPlan] || '#6c757d' }}>
        <span className="plan-icon">{planIcons[currentPlan] || '🆓'}</span>
        <span className="plan-name" style={{ color: planColors[currentPlan] || '#6c757d' }}>
          Plan {planName}
        </span>
        {isUserPro && hasActivePlan() && getDaysRemaining() > 0 && (
          <span className="plan-days">({getDaysRemaining()} jours restants)</span>
        )}
        {isExpired() && (
          <span className="plan-expired">⚠️ Expiré</span>
        )}
      </div>
    );
  };

  // ✅ Renderizar información de límites
  const renderLimitInfo = () => {
    const currentCount = userChannels.length;
    const maxChannels = planLimits?.maxChannels || 1;
    const remaining = getRemainingSlots();
    const isLimitReached = !canCreateNewChannel();
    
    if (!isUserPro) {
      return (
        <Alert variant="info" className="mt-3">
          <div className="d-flex align-items-center gap-2">
            <InfoCircle />
            <div>
              <strong>Plan Gratuit</strong>
              <p className="mb-0 small">
                Vous avez {currentCount}/1 canal. Passez à <a href="/become-pro">UserPro</a> pour créer plus de canaux.
              </p>
            </div>
          </div>
        </Alert>
      );
    }
    
    return (
      <div className={`plan-limits-card ${isLimitReached ? 'limit-reached' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">📊 Canaux utilisés</span>
            <p className="mb-0">
              {currentCount} / {maxChannels === 'unlimited' ? '∞' : maxChannels}
            </p>
          </div>
          <div>
            <span className="fw-bold">📊 Restants</span>
            <p className="mb-0">{remaining === 'Illimité' ? '∞' : remaining}</p>
          </div>
          {maxChannels !== 'unlimited' && currentCount >= maxChannels && (
            <Button 
              size="sm" 
              variant="warning" 
              className="ms-3"
              onClick={() => history.push('/become-pro')}
            >
              ⬆️ Upgrade plan
            </Button>
          )}
        </div>
        <div className="progress mt-2" style={{ height: '8px' }}>
          <div 
            className={`progress-bar ${isLimitReached ? 'bg-danger' : 'bg-success'}`}
            style={{ 
              width: maxChannels === 'unlimited' ? '100%' : `${Math.min((currentCount / maxChannels) * 100, 100)}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        {isLimitReached && (
          <Alert variant="danger" className="mt-3 mb-0 py-2">
            ⚠️ Limite atteinte ! Vous ne pouvez pas créer plus de {maxChannels} canal{maxChannels > 1 ? 'x' : ''}.
            <a href="/become-pro" className="ms-2">Passez au plan supérieur</a>
          </Alert>
        )}
      </div>
    );
  };

  // ✅ Mostrar loading mientras se carga la autenticación
  if (!auth || !auth.user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <p className="ms-3">Chargement de votre session...</p>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Button 
          variant="link" 
          className="text-decoration-none mb-3 d-inline-flex align-items-center gap-1"
          onClick={() => history.goBack()}
        >
          <ArrowLeft size={16} /> Retour
        </Button>
        
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <Tv size={28} className="text-primary" />
                    <h2 className="h4 fw-bold mb-0">Créer une nouvelle chaîne</h2>
                  </div>
                  {renderPlanBadge()}
                </div>
                <p className="text-muted mt-2">Créez votre vitrine professionnelle pour partager vos vidéos commerciales</p>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="plan-info-section mb-4">
                  <h6 className="fw-bold mb-2">📋 Votre abonnement actuel</h6>
                  {renderLimitInfo()}
                </div>
                
                {error && (
                  <Alert 
                    variant="danger" 
                    className="mb-4"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span>⚠️</span>
                      <div>
                        <strong>Erreur :</strong> {error}
                      </div>
                    </div>
                  </Alert>
                )}
                
                {success && (
                  <Alert 
                    variant="success" 
                    className="mb-4"
                    onClose={() => setSuccess(false)}
                    dismissible
                  >
                    <div className="d-flex align-items-center gap-2">
                      <CheckCircle size={20} />
                      <div>
                        <strong>✅ Chaîne créée avec succès !</strong>
                        <br />
                        <small>Redirection vers vos chaînes...</small>
                      </div>
                    </div>
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Nom de la chaîne <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="ex: Électroménager Ben Omar"
                          isInvalid={validated && !formData.name.trim()}
                          disabled={loading || !canCreateNewChannel()}
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir le nom de votre chaîne.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Activité / Secteur <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="activity"
                          value={formData.activity}
                          onChange={handleChange}
                          required
                          disabled={loadingCategories || loading || !canCreateNewChannel()}
                          isInvalid={validated && !formData.activity}
                        >
                          <option value="">Sélectionnez un secteur</option>
                          {loadingCategories && (
                            <option value="" disabled>Chargement des catégories...</option>
                          )}
                          {!loadingCategories && categories && categories.length > 0 ? (
                            categories.map(cat => (
                              <option key={cat._id} value={cat._id}>
                                {cat.icon} {cat.name}
                              </option>
                            ))
                          ) : (
                            !loadingCategories && (
                              <option value="" disabled>Aucune catégorie disponible</option>
                            )
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Veuillez sélectionner un secteur d'activité.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Décrivez votre activité, vos produits, services, etc."
                          disabled={loading || !canCreateNewChannel()}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <WilayaCommuneField
                        postData={formData}
                        handleChangeInput={handleChange}
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+213 5XX XX XX XX"
                          disabled={loading || !canCreateNewChannel()}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contact@exemple.com"
                          disabled={loading || !canCreateNewChannel()}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Site web (optionnel)</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.monsite.com"
                          disabled={loading || !canCreateNewChannel()}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => history.push('/my-channels')}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || loadingCategories || !canCreateNewChannel()}
                      className="d-flex align-items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Building size={16} />
                          Créer la chaîne
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-muted small pb-4">
                <InfoCircle size={14} className="me-1" />
                Les informations de votre chaîne seront utilisées pour vos vidéos commerciales.
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <style>{`
        .plan-badge-container {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8f9fa;
          padding: 6px 12px;
          border-radius: 20px;
          border-left: 3px solid;
        }
        
        .plan-limits-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
        }
        
        .plan-limits-card.limit-reached {
          background: #fff3cd;
          border-color: #ffc107;
        }
        
        .plan-days {
          font-size: 11px;
          color: #28a745;
          margin-left: 4px;
        }
        
        .plan-expired {
          font-size: 11px;
          color: #dc3545;
          margin-left: 4px;
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CreateChannel;