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
  Bookmark, 
  Grid, 
  Heart,
  Camera,
  FileText,
  ChevronRight
} from 'react-bootstrap-icons';
import Info from '../../components/profile/Info';
import { getProfileUsers } from '../../redux/actions/profileAction';

const Profile = () => {
  const { profile, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  
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

  // Vérifications
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

  return (
    <div className="profile-page">
      <Container className="py-4">
        {/* En-tête avec bouton d'édition - visible seulement pour le propriétaire */}
        {isOwnProfile && (
          <div className="d-flex justify-content-end mb-3">
            <Button
              variant="outline-primary"
              onClick={() => history.push('/profile/settings')}
              className="rounded-pill px-4 d-flex align-items-center gap-2"
            >
              <Pencil size={16} />
              Modifier le profil
            </Button>
          </div>
        )}

        {/* Info du profil (avatar, nom, bio, etc.) */}
        <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

        {/* Statistiques du profil */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <Grid className="text-primary" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Publications</small>
                  <h5 className="mb-0 fw-bold">
                    {currentUser?.posts?.length || currentUser?.postCount || 0}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                  <Heart className="text-success" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Abonnés</small>
                  <h5 className="mb-0 fw-bold">
                    {currentUser?.followers?.length || 0}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <Camera className="text-info" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Abonnements</small>
                  <h5 className="mb-0 fw-bold">
                    {currentUser?.following?.length || 0}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cartes de navigation vers les autres sections - visible seulement pour le propriétaire */}
        {isOwnProfile && (
          <>
            <h5 className="mb-3">Mes sections</h5>
            <Row className="g-3 mb-4">
              {/* Vers Mes Annonces */}
              <Col md={6}>
                <Card 
                  className="border-0 shadow-sm navigation-card"
                  onClick={() => history.push('/mes-annonces')}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <FileText className="text-primary" size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Mes annonces</h6>
                        <small className="text-muted">
                          Gérer vos publications
                        </small>
                      </div>
                    </div>
                    <ChevronRight className="text-primary" size={20} />
                  </Card.Body>
                </Card>
              </Col>

              {/* Vers Sauvegardés */}
              <Col md={6}>
                <Card 
                  className="border-0 shadow-sm navigation-card"
                  onClick={() => history.push(`/profile/${id}/saved`)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                        <Bookmark className="text-success" size={24} />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold">Mes favoris</h6>
                        <small className="text-muted">
                          Publications sauvegardées
                        </small>
                      </div>
                    </div>
                    <ChevronRight className="text-success" size={20} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Section À propos - toujours visible */}
        <Card className="border-0 shadow-sm mt-4">
          <Card.Body className="p-4">
            <h5 className="mb-3">À propos</h5>
            
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
                    <a href={currentUser.website} target="_blank" rel="noopener noreferrer">
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
            Membre depuis {new Date(currentUser?.createdAt).toLocaleDateString('fr-FR', {
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
          background: #f8f9fa;
        }

        .navigation-card {
          transition: all 0.2s;
        }

        .navigation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2) !important;
        }

        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
      `}</style>
    </div>
  );
};

export default Profile;