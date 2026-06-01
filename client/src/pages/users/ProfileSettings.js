// src/pages/ProfileSettings.jsx - Version française complète

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Spinner, 
  Alert,
  Card,
  Modal
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { 
  Person, 
  Telephone, 
  GeoAlt, 
  Globe,
  Save,
  CheckCircle,
  ExclamationTriangle,
  Calendar,
  People,
  PersonBadge,
  Camera
} from 'react-bootstrap-icons';
import { updateProfileUser } from '../../redux/actions/profileAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
 
import { imageUpload } from '../../utils/imageUpload';
 
const ProfileSettings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { auth, theme = 'light' } = useSelector(state => state);
  const { alert } = useSelector(state => state);
  
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // État du formulaire
  const [userData, setUserData] = useState({
    fullname: '',
    mobile: '',
    address: '',
    website: '',
    story: ''
  });
  
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Charger les données utilisateur
  useEffect(() => {
    if (auth.user) {
      setUserData({
        fullname: auth.user.fullname || '',
        mobile: auth.user.mobile || '',
        address: auth.user.address || '',
        website: auth.user.website || '',
        story: auth.user.story || ''
      });
      
      if (auth.user.avatar) {
        setPreviewAvatar(auth.user.avatar);
      }
    }
  }, [auth.user]);

  // Gérer les alertes globales
  useEffect(() => {
    if (alert.success) {
      setAvatar(null);
      setTimeout(() => {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
      }, 3000);
    }
  }, [alert.success, dispatch]);

  // Changer l'avatar
  const changeAvatar = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.match(/image.*/)) {
      return dispatch({
        type: GLOBALTYPES.ALERT, 
        payload: {error: "Veuillez sélectionner une image valide"}
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return dispatch({
        type: GLOBALTYPES.ALERT, 
        payload: {error: "L'image ne peut pas dépasser 5MB"}
      });
    }

    setAvatar(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Gérer les champs de formulaire
  const handleInput = (e) => {
    const { name, value } = e.target;
    
    if (name === 'fullname' && value.length > 25) return;
    if (name === 'story' && value.length > 200) return;
    
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // SOUMETTRE LE FORMULAIRE (version française)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (userData.fullname && userData.fullname.length > 25) {
      return dispatch({
        type: GLOBALTYPES.ALERT, 
        payload: {error: "Le nom complet est trop long (max 25 caractères)"}
      });
    }

    if (userData.story && userData.story.length > 200) {
      return dispatch({
        type: GLOBALTYPES.ALERT, 
        payload: {error: "La description est trop longue (max 200 caractères)"}
      });
    }

    setLoading(true);
    
    try {
      let avatarUrl = auth.user.avatar;
      
      if (avatar) {
        console.log('📤 Préparation de l\'avatar:', avatar.name);
        
        const blobUrl = URL.createObjectURL(avatar);
        
        const avatarObject = {
          url: blobUrl,
          isExisting: false,
          name: avatar.name,
          type: avatar.type
        };
        
        const media = await imageUpload([avatarObject]);
        
        if (media && media[0] && media[0].url) {
          avatarUrl = media[0].url;
        } else {
          throw new Error("Erreur lors de l'upload de l'image");
        }
        
        URL.revokeObjectURL(blobUrl);
      }
      
      const updatedData = {
        fullname: userData.fullname || auth.user.fullname,
        mobile: userData.mobile || auth.user.mobile || '',
        address: userData.address || auth.user.address || '',
        story: userData.story || auth.user.story || '',
        website: userData.website || auth.user.website || '',
        avatar: avatarUrl
      };
      
      await dispatch(updateProfileUser({ 
        userData: updatedData,
        avatar: null,
        auth 
      }));
      
      setAvatar(null);
      
    } catch (error) {
      console.error('❌ Erreur:', error);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {error: error.message || 'Erreur lors de la mise à jour'}
      });
    } finally {
      setLoading(false);
    }
  };

  // Annuler les changements d'avatar
  const cancelAvatarChange = () => {
    setAvatar(null);
    setPreviewAvatar(auth.user?.avatar || null);
  };

  // Statistiques utilisateur
  const userStats = {
    posts: auth.user?.posts?.length || auth.user?.postCount || 0,
    followers: auth.user?.followers?.length || 0,
    following: auth.user?.following?.length || 0,
    memberSince: auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A'
  };

  // Vérifier l'authentification
  if (!auth.token || !auth.user) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className={`profile-settings ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="h3 fw-bold mb-1">Paramètres du profil</h2>
            <p className="text-muted mb-0">
              Gérez vos informations personnelles
            </p>
          </div>
          
          <Button 
            variant="outline-primary" 
            onClick={() => history.push(`/profile/${auth.user._id}`)}
            className="rounded-pill px-4"
          >
            <Person className="me-2" size={16} />
            Voir le profil
          </Button>
        </div>

        {/* Alertes */}
        {alert.success && (
          <Alert variant="success" className="d-flex align-items-center mb-4" dismissible>
            <CheckCircle className="me-2" size={20} />
            {alert.success}
          </Alert>
        )}
        
        {alert.error && (
          <Alert variant="danger" className="d-flex align-items-center mb-4" dismissible>
            <ExclamationTriangle className="me-2" size={20} />
            {alert.error}
          </Alert>
        )}

        {/* Cartes de statistiques */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <Person className="text-primary" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Publications</small>
                  <h5 className="mb-0 fw-bold">{userStats.posts}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <People className="text-success" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Abonnés</small>
                  <h5 className="mb-0 fw-bold">{userStats.followers}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <PersonBadge className="text-info" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Abonnements</small>
                  <h5 className="mb-0 fw-bold">{userStats.following}</h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3">
                  <Calendar className="text-warning" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Membre depuis</small>
                  <h6 className="mb-0 fw-bold">{userStats.memberSince}</h6>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulaire principal */}
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h4 className="mb-4">Modifier le profil</h4>
            
            <Form onSubmit={handleSubmit}>
              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="avatar-container">
                    <img 
                      src={previewAvatar || auth.user.avatar} 
                      alt="avatar" 
                      className="avatar-image"
                    />
                    
                    <label htmlFor="avatar-upload" className="avatar-overlay">
                      <Camera size={24} />
                      <span>Changer</span>
                    </label>
                    
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={changeAvatar}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
                
                {avatar && (
                  <div className="mt-2">
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={cancelAvatarChange}
                      className="text-danger"
                    >
                      Annuler
                    </Button>
                  </div>
                )}
                
                <p className="text-muted small mt-2">
                  JPG, PNG ou GIF. Maximum 5MB.
                </p>
              </div>

              {/* Champs du formulaire */}
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Nom complet</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      name="fullname"
                      value={userData.fullname}
                      onChange={handleInput}
                      placeholder="Votre nom complet"
                      maxLength="25"
                    />
                    <small className="character-count">
                      {userData.fullname?.length || 0}/25
                    </small>
                  </div>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Label>
                    <Telephone className="me-2" size={14} />
                    Téléphone
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleInput}
                    placeholder="+33 6 12 34 56 78"
                  />
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Label>
                    <GeoAlt className="me-2" size={14} />
                    Adresse
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleInput}
                    placeholder="Ville, Pays"
                  />
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Label>
                    <Globe className="me-2" size={14} />
                    Site web
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    value={userData.website}
                    onChange={handleInput}
                    placeholder="https://votresite.com"
                  />
                </Col>
                
                <Col xs={12} className="mb-4">
                  <Form.Label>Histoire / À propos</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      as="textarea"
                      name="story"
                      value={userData.story}
                      onChange={handleInput}
                      placeholder="Parlez-nous de vous..."
                      rows={4}
                      maxLength="200"
                    />
                    <small className="character-count bottom">
                      {userData.story?.length || 0}/200
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Boutons d'action */}
              <div className="d-flex justify-content-end gap-2">
                <Button 
                  variant="outline-secondary"
                  onClick={() => history.push(`/profile/${auth.user._id}`)}
                  className="rounded-pill px-4"
                >
                  Annuler
                </Button>
                
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={loading || alert.loading}
                  className="rounded-pill px-4"
                  style={{ minWidth: '200px' }}
                >
                  {loading || alert.loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="me-2" size={16} />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Zone de danger */}
        <Card className="border-0 shadow-sm border-danger mt-4">
          <Card.Body className="p-4">
            <h4 className="text-danger mb-3">Zone de danger</h4>
            
            <Alert variant="warning" className="mb-3">
              <ExclamationTriangle className="me-2" size={20} />
              <strong>Attention !</strong> Ces actions sont irréversibles.
            </Alert>
            
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h5 className="h6 mb-1">Supprimer le compte</h5>
                <p className="text-muted small mb-0">
                  Une fois supprimé, vous ne pourrez plus récupérer vos données.
                </p>
              </div>
              <Button 
                variant="outline-danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-pill px-4"
              >
                Supprimer
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Modal de confirmation */}
        <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">
              <ExclamationTriangle className="me-2" size={20} />
              Supprimer le compte
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <p className="mb-3">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
            </p>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button variant="danger">
              Confirmer
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Styles */}
      <style jsx="true">{`
        .avatar-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .avatar-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transform: translateY(100%);
          transition: transform 0.3s;
          cursor: pointer;
        }

        .avatar-container:hover .avatar-overlay {
          transform: translateY(0);
        }

        .avatar-container:hover .avatar-image {
          transform: scale(1.1);
        }

        .character-count {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          color: #dc3545;
          font-size: 0.75rem;
        }

        .character-count.bottom {
          top: auto;
          bottom: -20px;
          right: 0;
          transform: none;
        }

        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        
        .profile-settings {
          min-height: 100vh;
          padding-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
          .avatar-container {
            width: 120px;
            height: 120px;
          }
          
          .character-count {
            position: static;
            display: block;
            text-align: right;
            margin-top: 4px;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileSettings;