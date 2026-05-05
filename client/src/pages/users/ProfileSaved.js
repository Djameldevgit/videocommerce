// src/pages/ProfileSaved.jsx - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert,
  Button,
  Card
} from 'react-bootstrap';
import { 
  Bookmark, 
  ArrowLeft,
  Heart,
  Grid
} from 'react-bootstrap-icons';
import PostThumb from '../../components/PostThumb';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import LoadIcon from '../../images/loading.gif';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const ProfileSaved = () => {
  // ✅ Utiliser useSelector au lieu des props
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [savePosts, setSavePosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // ✅ Vérifier que auth existe
    if (!auth?.token) {
      setInitialLoad(false);
      return;
    }

    setLoad(true);
    getDataAPI('getSavePosts', auth.token)
      .then(res => {
        setSavePosts(res.data.savePosts || []);
        setResult(res.data.result || 0);
        setLoad(false);
        setInitialLoad(false);
      })
      .catch(err => {
        console.error('❌ Erreur chargement saved posts:', err);
        dispatch({ 
          type: GLOBALTYPES.ALERT, 
          payload: { error: err.response?.data?.msg || 'Erreur lors du chargement' } 
        });
        setLoad(false);
        setInitialLoad(false);
      });

    return () => setSavePosts([]);
  }, [auth?.token, dispatch]);

  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(`getSavePosts?limit=${page * 9}`, auth.token);
      setSavePosts(res.data.savePosts || []);
      setResult(res.data.result || 0);
      setPage(page + 1);
    } catch (err) {
      console.error('❌ Erreur chargement plus:', err);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: err.response?.data?.msg || 'Erreur lors du chargement' } 
      });
    } finally {
      setLoad(false);
    }
  };

  // ✅ Vérification d'authentification
  if (!auth?.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos publications sauvegardées.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  if (initialLoad) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos favoris...</p>
      </Container>
    );
  }

  return (
    <div className="profile-saved-page">
      <Container className="py-4">
        {/* En-tête avec retour */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <button 
              onClick={() => history.push(`/profile/${auth.user._id}`)}
              className="btn btn-outline-secondary rounded-circle p-2"
              style={{ width: '40px', height: '40px' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="h3 fw-bold mb-1">
                <Bookmark className="me-2 text-primary" size={28} />
                Mes favoris
              </h2>
              <p className="text-muted mb-0">
                {savePosts.length} publication{savePosts.length > 1 ? 's' : ''} sauvegardée{savePosts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <Bookmark className="text-primary" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Sauvegardées</small>
                  <h5 className="mb-0 fw-bold">{savePosts.length}</h5>
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
                  <small className="text-muted d-block">J'aime reçus</small>
                  <h5 className="mb-0 fw-bold">
                    {savePosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col xs={6} md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <Grid className="text-info" size={20} />
                </div>
                <div>
                  <small className="text-muted d-block">Publications</small>
                  <h5 className="mb-0 fw-bold">
                    {auth.user?.posts?.length || 0}
                  </h5>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Grille des posts sauvegardés */}
        {savePosts.length > 0 ? (
          <>
            <PostThumb posts={savePosts} result={result} />
            
            {load && (
              <div className="text-center mt-4">
                <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
              </div>
            )}

            <LoadMoreBtn 
              result={result} 
              page={page}
              load={load} 
              handleLoadMore={handleLoadMore} 
            />
          </>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state">
              <Bookmark size={48} className="text-muted mb-3" />
              <h4>Aucun favori</h4>
              <p className="text-muted mb-4">
                Vous n'avez pas encore sauvegardé de publications.
              </p>
              <Button 
                variant="primary"
                onClick={() => history.push('/')}
                className="rounded-pill px-4"
              >
                Découvrir des publications
              </Button>
            </div>
          </div>
        )}
      </Container>

      <style jsx="true">{`
        .profile-saved-page {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .empty-state {
          max-width: 400px;
          margin: 0 auto;
          padding: 3rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
      `}</style>
    </div>
  );
};

export default ProfileSaved;