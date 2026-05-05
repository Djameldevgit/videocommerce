// 📂 pages/MesBoutiques.jsx - VERSIÓN COMPLETA CORREGIDA
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card, Modal } from 'react-bootstrap';
import { getUserBoutiques, deleteBoutique } from '../../redux/actions/boutiqueAction';
import { FaStore, FaPlus, FaBox, FaToggleOn, FaToggleOff, FaCreditCard, FaCheckCircle, FaClock, FaInfoCircle } from 'react-icons/fa';
import { Pencil, Plus, Eye, Filter, Trash } from 'react-bootstrap-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

moment.locale('fr');

const MesBoutiques = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading } = useSelector(state => state.boutique || { userBoutiques: [], loading: false });
  const [refresh, setRefresh] = useState(false);
  const [filteredBoutiques, setFilteredBoutiques] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const boutiquesPerPage = 9;

  useEffect(() => {
    if (auth?.token) {
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth, refresh]);

  useEffect(() => {
    if (userBoutiques && userBoutiques.length > 0) {
      filterBoutiquesByStatus(userBoutiques, filterStatus);
    } else {
      setFilteredBoutiques([]);
    }
  }, [userBoutiques, filterStatus]);

  const filterBoutiquesByStatus = (boutiques, status) => {
    let filtered = [];
    
    if (status === 'all') {
      filtered = [...boutiques];
    } else if (status === 'pending') {
      filtered = boutiques.filter(boutique => boutique.pendiente === true);
    } else if (status === 'active') {
      filtered = boutiques.filter(boutique => boutique.isActive === true && boutique.pendiente === false);
    } else if (status === 'inactive') {
      filtered = boutiques.filter(boutique => boutique.isActive === false && boutique.pendiente === false);
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredBoutiques(filtered);
    setPage(1);
    setHasMore(filtered.length > boutiquesPerPage);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleDelete = async (boutiqueId, e) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette boutique ? Tous les produits seront également supprimés.')) {
      try {
        await dispatch(deleteBoutique({ boutiqueId, auth }));
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting boutique:', error);
      }
    }
  };

  const handleActivateBoutique = (boutique, e) => {
    e.stopPropagation();
    
    if (!boutique.isActive && !boutique.pendiente) {
      history.push(`/payment-boutique/${boutique._id}`, { 
        boutiqueName: boutique.nom_boutique,
        boutiqueId: boutique._id
      });
    } else if (boutique.isActive) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { info: "Votre boutique est déjà active et visible par tous les utilisateurs." }
      });
    } else if (boutique.pendiente) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { info: "Votre boutique est en attente de vérification par l'administrateur." }
      });
    }
  };

  const handleBoutiqueClick = (boutique) => {
    // Si la boutique está pendiente, mostrar modal informativo
    if (boutique.pendiente === true) {
      setSelectedBoutique(boutique);
      setShowPendingModal(true);
      return;
    }
    
    // Si la boutique está inactiva (solo para planes de pago)
    if (boutique.isActive === false && boutique.pendiente === false) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { 
          info: "Votre boutique est approuvée mais en attente de paiement pour être activée. Veuillez procéder au paiement pour la rendre visible au public." 
        }
      });
      return;
    }
    
    // Si está activa y aprobada, ir a la página
    history.push(`/boutique/${boutique._id}`);
  };

  const handleCreateBoutique = () => {
    history.push('/create-boutique');
  };

  const loadMoreBoutiques = () => {
    if (filteredBoutiques.length > page * boutiquesPerPage) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const displayedBoutiques = filteredBoutiques.slice(0, page * boutiquesPerPage);

  const stats = {
    total: userBoutiques?.length || 0,
    pending: userBoutiques?.filter(b => b.pendiente === true).length || 0,
    active: userBoutiques?.filter(b => b.isActive === true && b.pendiente === false).length || 0,
    inactive: userBoutiques?.filter(b => b.isActive === false && b.pendiente === false).length || 0
  };

  // Tarjeta compacta
  const CompactBoutiqueCard = ({ boutique }) => {
    const isPending = boutique.pendiente === true;
    const isActive = boutique.isActive === true;
    const isInactive = !boutique.isActive && !boutique.pendiente;
    
    const getFirstImage = () => {
      if (boutique.images && boutique.images.length > 0) {
        const firstImage = boutique.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      if (boutique.header_images && boutique.header_images.length > 0) {
        const firstImage = boutique.header_images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      return null;
    };

    const imageUrl = getFirstImage();

    return (
      <Card 
        className={`border-0 shadow-sm h-100 overflow-hidden`}
        style={{ 
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: '#ffffff',
          borderTop: `4px solid ${
            isPending ? '#ffc107' : (isActive ? '#198754' : '#6c757d')
          }`
        }}
        onClick={() => handleBoutiqueClick(boutique)}
      >
        <div className="badges-container">
          <div className="badge-left">
            {isPending ? (
              <span className="badge-pending">
                <FaClock size={10} className="me-1" /> En attente
              </span>
            ) : (
              <span className="badge-approved">
                <FaCheckCircle size={10} className="me-1" /> Vérifié
              </span>
            )}
          </div>
          
          <div className="badge-right">
            {isActive ? (
              <span className="badge-active">
                <FaToggleOn size={10} className="me-1" /> Actif
              </span>
            ) : isInactive ? (
              <span className="badge-inactive">
                <FaToggleOff size={10} className="me-1" /> Inactif
              </span>
            ) : null}
          </div>
        </div>
        
        <Row className="g-0">
          <Col xs={4} md={4} className="p-2">
            <div 
              className="image-container"
              style={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5'
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={boutique.nom_boutique || 'Boutique'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#adb5bd'
                  }}
                >
                  <FaStore size={24} />
                </div>
              )}
            </div>
          </Col>
          
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              <Card.Title 
                className="fw-bold mb-1"
                style={{ 
                  fontSize: '0.95rem',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {boutique.nom_boutique || 'Boutique sans nom'}
              </Card.Title>
              
              {boutique.slogan_boutique && (
                <p className="text-muted small mb-1" style={{ 
                  fontSize: '0.7rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {boutique.slogan_boutique}
                </p>
              )}
              
              <div className="d-flex gap-3 mt-1 mb-1">
                <div className="d-flex align-items-center">
                  <FaBox size={10} className="text-muted me-1" />
                  <span className="small">{boutique.stats?.produits || 0}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-eye me-1" style={{ fontSize: '0.6rem' }}></i>
                  <span className="small">{boutique.views || 0}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-heart me-1" style={{ fontSize: '0.6rem', color: '#dc3545' }}></i>
                  <span className="small">{boutique.likes?.length || 0}</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(boutique.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        <div className="action-buttons">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); handleBoutiqueClick(boutique); }}
            title="Voir la boutique"
          >
            <Eye size={12} />
          </Button>
          
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); history.push(`/edit-boutique/${boutique._id}`); }}
            title="Modifier la boutique"
          >
            <Pencil size={12} />
          </Button>
          
          {!boutique.pendiente && (
            <Button
              variant={isActive ? "secondary" : "warning"}
              size="sm"
              className="rounded-circle p-1 shadow-sm"
              onClick={(e) => handleActivateBoutique(boutique, e)}
              title={isActive ? "Boutique active" : (isInactive ? "Activer la boutique" : "En attente")}
            >
              {isActive ? <FaToggleOff size={12} /> : <FaCreditCard size={12} />}
            </Button>
          )}
          
          <Button
            variant="danger"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => handleDelete(boutique._id, e)}
            title="Supprimer la boutique"
          >
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos boutiques...</p>
      </Container>
    );
  }

  if (!auth?.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos boutiques.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="mes-boutiques-page">
      <Container className="py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 className="h3 mb-0 d-flex align-items-center gap-2">
            <FaStore /> Mes Boutiques
            <Badge bg="secondary" className="ms-2">{stats.total}</Badge>
          </h1>
          
          <Button 
            variant="primary" 
            className="rounded-pill px-4"
            onClick={handleCreateBoutique}
          >
            <Plus className="me-1" size={15} />
            Créer une boutique
          </Button>
        </div>

        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center me-2">
              <Filter className="text-muted me-2" size={18} />
              <span className="text-muted">Filtrer:</span>
            </div>
            
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('all')}
            >
              Toutes <Badge bg="secondary" className="ms-1">{stats.total}</Badge>
            </Button>
            
            <Button
              variant={filterStatus === 'active' ? 'success' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('active')}
            >
              <FaToggleOn className="me-1" /> Actives <Badge bg="success" className="ms-1">{stats.active}</Badge>
            </Button>
            
            <Button
              variant={filterStatus === 'inactive' ? 'warning' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('inactive')}
            >
              <FaToggleOff className="me-1" /> Inactives <Badge bg="warning" className="ms-1">{stats.inactive}</Badge>
            </Button>
            
            <Button
              variant={filterStatus === 'pending' ? 'secondary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('pending')}
            >
              <FaClock className="me-1" /> En attente <Badge bg="secondary" className="ms-1">{stats.pending}</Badge>
            </Button>
          </div>
        </div>

        {filteredBoutiques.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedBoutiques.length}
            next={loadMoreBoutiques}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-muted small">Chargement...</p>
              </div>
            }
            endMessage={
              displayedBoutiques.length > 0 && displayedBoutiques.length >= filteredBoutiques.length && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">Vous avez vu toutes vos boutiques</p>
                </div>
              )
            }
          >
            <Row>
              {displayedBoutiques.map((boutique) => (
                <Col key={boutique._id} xs={12} md={6} lg={4} className="mb-4">
                  <CompactBoutiqueCard boutique={boutique} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaStore size={60} className="text-muted" />
            </div>
            <h4 className="h5 mb-2">Aucune boutique</h4>
            <p className="text-muted mb-4">
              {filterStatus !== 'all' 
                ? 'Aucune boutique dans cette catégorie'
                : 'Commencez par créer votre première boutique'}
            </p>
            <Button 
              variant="primary" 
              className="rounded-pill px-4"
              onClick={handleCreateBoutique}
            >
              <Plus className="me-2" size={18} />
              Créer une boutique
            </Button>
          </div>
        )}
      </Container>

      {/* Modal para boutiques en attente de validation */}
      <Modal 
        show={showPendingModal} 
        onHide={() => setShowPendingModal(false)}
        centered
        size="lg"
      >
        <Modal.Header className="border-0 pb-0">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                <FaClock size={24} className="text-warning" />
              </div>
              <Modal.Title className="fw-bold">Boutique en attente de validation</Modal.Title>
            </div>
            <Button 
              variant="link" 
              className="text-muted p-0" 
              onClick={() => setShowPendingModal(false)}
            >
              ✕
            </Button>
          </div>
        </Modal.Header>
        
        <Modal.Body className="pt-0">
          {selectedBoutique && (
            <>
              <div className="text-center mb-4">
                <div className="bg-light rounded-3 p-3 d-inline-block mb-3">
                  {selectedBoutique.images?.[0]?.url ? (
                    <img 
                      src={selectedBoutique.images[0].url} 
                      alt={selectedBoutique.nom_boutique}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ) : (
                    <FaStore size={50} className="text-muted" />
                  )}
                </div>
                <h5 className="fw-bold mb-1">{selectedBoutique.nom_boutique}</h5>
                <p className="text-muted small">{selectedBoutique.domaine_boutique}</p>
              </div>
              
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 mb-4">
                <div className="d-flex gap-3 align-items-start">
                  <FaInfoCircle size={20} className="text-warning mt-1" />
                  <div>
                    <p className="fw-bold mb-1">Votre boutique est en cours de vérification</p>
                    <p className="small text-muted mb-0">
                      Notre équipe examine actuellement votre boutique pour s'assurer qu'elle respecte nos conditions d'utilisation. 
                      Ce processus peut prendre 24 à 48 heures. Vous recevrez une notification dès que votre boutique sera approuvée.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-light rounded-3 p-3">
                <p className="fw-bold mb-2">Que faire en attendant ?</p>
                <ul className="small mb-0 ps-3">
                  <li className="mb-1">✓ Complétez les informations de votre boutique</li>
                  <li className="mb-1">✓ Ajoutez des produits de qualité</li>
                  <li className="mb-1">✓ Soignez les photos et descriptions</li>
                  <li>✓ Préparez vos offres promotionnelles</li>
                </ul>
              </div>
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0">
          <Button 
            variant="secondary" 
            onClick={() => setShowPendingModal(false)}
          >
            Compris
          </Button>
          {selectedBoutique && (
            <Button 
              variant="outline-primary"
              onClick={() => {
                setShowPendingModal(false);
                history.push(`/edit-boutique/${selectedBoutique._id}`);
              }}
            >
              Modifier la boutique
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Estilos */}
      <style jsx="true">{`
        .badges-container {
          position: absolute;
          top: 10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          z-index: 10;
          pointer-events: none;
        }
        
        .badge-left, .badge-right {
          pointer-events: auto;
        }
        
        .badge-pending {
          background-color: #ffc107;
          color: #000;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .badge-approved {
          background-color: #198754;
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .badge-active {
          background-color: #198754;
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .badge-inactive {
          background-color: #ffc107;
          color: #000;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .action-buttons {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        
        .action-buttons .btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border: 1px solid #e9ecef;
          border-radius: 50% !important;
          transition: all 0.2s ease;
        }
        
        .action-buttons .btn:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .card {
          position: relative;
          transition: all 0.2s ease;
          overflow: visible !important;
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
        }
        
        .image-container {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default MesBoutiques;