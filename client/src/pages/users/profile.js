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
  ChevronRight,
  Tv
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

  return (
    <div className="profile-page">
      <Container className="py-4">
        {/* En-tête avec boutons d'action */}
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

        {/* Info du profil (avatar, nom, bio, etc.) */}
        <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />

        {/* Statistiques modernisées */}
        <Row className="g-3 mb-5">
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

      {/* Styles améliorés et responsifs */}
      <style jsx="true">{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          padding-bottom: 2rem;
        }

        /* Boutons d'action */
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .action-btn {
          font-size: 0.9rem;
          padding: 0.5rem 1.2rem;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        /* Cartes statistiques */
        .stats-card {
          border: none;
          border-radius: 1.25rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
          background: white;
        }
        .stats-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.08);
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

        /* Titres de section */
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #1e293b;
          border-left: 4px solid #0d6efd;
          padding-left: 12px;
        }

        /* Cartes de navigation */
        .nav-card {
          border: none;
          border-radius: 1rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
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

        /* Carte À propos */
        .about-card {
          border: none;
          border-radius: 1.25rem;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
        }

        /* Responsive pour mobiles (Android) */
        @media (max-width: 576px) {
          .action-buttons {
            justify-content: stretch;
          }
          .action-btn {
            flex: 1;
            justify-content: center;
            padding: 0.6rem 0.8rem;
            font-size: 0.85rem;
          }
          .stat-icon {
            width: 44px;
            height: 44px;
          }
          .stat-icon svg {
            width: 18px;
            height: 18px;
          }
          .stats-card h4 {
            font-size: 1.2rem;
          }
          .stats-card small {
            font-size: 0.7rem;
          }
          .section-title {
            font-size: 1.1rem;
          }
          .nav-icon {
            width: 40px;
            height: 40px;
          }
          .nav-icon svg {
            width: 20px;
            height: 20px;
          }
          .nav-card h6 {
            font-size: 0.9rem;
          }
          .nav-card small {
            font-size: 0.7rem;
          }
          .about-card .p-4 {
            padding: 1rem !important;
          }
        }

        /* Ajustes para tablets */
        @media (min-width: 577px) and (max-width: 768px) {
          .action-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }
          .stat-icon {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;