// 📂 pages/MesProductsBoutiques.jsx - CON DRAWER LATERAL DE BOUTIQUES

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card, Offcanvas } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Pencil, Plus, Eye, Filter, Trash, List, X } from 'react-bootstrap-icons';
import { FaStore, FaBoxOpen, FaChevronRight, FaBuilding, FaCar, FaTv, FaMobile, FaUtensils } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';

import { getUserProducts, deleteBoutiqueProduct } from '../../redux/actions/boutiqueProductAction';
import { getUserBoutiques } from '../../redux/actions/boutiqueAction';

moment.locale('fr');

// Iconos por tipo de boutique
const getBoutiqueIcon = (categorie) => {
  const icons = {
    immobilier: <FaBuilding />,
    vehicules: <FaCar />,
    automobile: <FaCar />,
    electromenager: <FaTv />,
    electronique: <FaMobile />,
    alimentaire: <FaUtensils />,
    restaurant: <FaUtensils />
  };
  return icons[categorie?.toLowerCase()] || <FaStore />;
};

const MesProductsBoutiques = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  // Selectores
  const { auth } = useSelector(state => state);
  const { userBoutiques = [], loading: loadingBoutiques } = useSelector(state => state.boutique || {});
  const boutiqueProductState = useSelector(state => state.boutiqueProduct);
  
  const userProducts = boutiqueProductState?.userProducts || { products: [], total: 0 };
  const loadingProducts = boutiqueProductState?.loadingProducts || false;
  
  const productsList = useMemo(() => userProducts?.products || [], [userProducts]);
  
  // Estados
  const [refresh, setRefresh] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBoutique, setSelectedBoutique] = useState(null); // Boutique seleccionada
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false); // Estado del drawer
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const productsPerPage = 9;

  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar productos
  const loadUserProducts = useCallback(async () => {
    if (!auth?.token) return;
    try {
      const res = await dispatch(getUserProducts(auth));
      return res;
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  }, [dispatch, auth]);

  // Cargar boutiques del usuario
  useEffect(() => {
    if (auth?.token) {
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth]);

  // Cargar productos del usuario
  useEffect(() => {
    if (auth?.token && isInitialLoad) {
      loadUserProducts().finally(() => {
        setIsInitialLoad(false);
      });
    }
  }, [auth, isInitialLoad, loadUserProducts]);

  // Recargar cuando refresh cambia
  useEffect(() => {
    if (auth?.token && !isInitialLoad && refresh) {
      loadUserProducts().finally(() => {
        setRefresh(false);
      });
    }
  }, [auth, refresh, isInitialLoad, loadUserProducts]);

  // Filtrar productos cuando cambia la boutique seleccionada o el estado
  useEffect(() => {
    if (productsList.length > 0) {
      const filtered = filterProductsList(productsList, filterStatus, selectedBoutique);
      setFilteredProducts(filtered);
      setPage(1);
      setHasMore(filtered.length > productsPerPage);
    } else {
      setFilteredProducts([]);
      setHasMore(false);
    }
  }, [productsList, filterStatus, selectedBoutique]);

  const filterProductsList = (products, status, boutique) => {
    let filtered = [...products];
    
    // Filtrar por boutique seleccionada
    if (boutique) {
      filtered = filtered.filter(product => 
        product.boutique?._id === boutique._id || 
        product.boutiqueId === boutique._id
      );
    }
    
    // Filtrar por estado
    if (status === 'pending') {
      filtered = filtered.filter(product => product.pendiente === true);
    } else if (status === 'approved') {
      filtered = filtered.filter(product => product.pendiente === false);
    }
    
    // Ordenar por fecha
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  };

  // Seleccionar una boutique
  const handleSelectBoutique = (boutique) => {
    setSelectedBoutique(boutique);
    setShowDrawer(false); // Cerrar drawer después de seleccionar
    setFilterStatus('all'); // Resetear filtro de estado al cambiar de boutique
  };

  // Limpiar filtro de boutique
  const handleClearBoutiqueFilter = () => {
    setSelectedBoutique(null);
    setFilterStatus('all');
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleDeleteProduct = async (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutique?._id || product.boutiqueId;
    
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await dispatch(deleteBoutiqueProduct({ 
          boutiqueId, 
          productId: product._id, 
          auth 
        }));
        setRefresh(true);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleViewProduct = (productId) => {
    history.push(`/product/${productId}`);
  };
  const handleEditProduct = (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutique?._id || product.boutiqueId;
    history.push(`/boutique/${boutiqueId}/products/edit/${product._id}`);
  };

  const handleCreateProduct = () => {
    if (userBoutiques && userBoutiques.length > 0) {
      if (selectedBoutique) {
        history.push(`/boutique/${selectedBoutique._id}/products/new`);
      } else if (userBoutiques.length === 1) {
        history.push(`/boutique/${userBoutiques[0]._id}/products/new`);
      } else {
        // Si hay múltiples boutiques, abrir drawer para seleccionar
        setShowDrawer(true);
      }
    } else {
      alert('Veuillez créer une boutique d\'abord');
      history.push('/create-boutique');
    }
  };

  const loadMoreProducts = () => {
    const nextPage = page + 1;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (nextPage <= totalPages) {
      setPage(nextPage);
    } else {
      setHasMore(false);
    }
  };

  const displayedProducts = useMemo(() => {
    const end = page * productsPerPage;
    return filteredProducts.slice(0, end);
  }, [filteredProducts, page, productsPerPage]);

  // Estadísticas
  const stats = useMemo(() => {
    const byBoutique = userBoutiques.map(boutique => ({
      ...boutique,
      productCount: productsList.filter(p => 
        p.boutique?._id === boutique._id || p.boutiqueId === boutique._id
      ).length,
      pendingCount: productsList.filter(p => 
        (p.boutique?._id === boutique._id || p.boutiqueId === boutique._id) && p.pendiente === true
      ).length,
      approvedCount: productsList.filter(p => 
        (p.boutique?._id === boutique._id || p.boutiqueId === boutique._id) && p.pendiente === false
      ).length
    }));

    return {
      total: productsList.length,
      pending: productsList.filter(p => p.pendiente === true).length,
      approved: productsList.filter(p => p.pendiente === false).length,
      byBoutique
    };
  }, [productsList, userBoutiques]);

  // Componente de tarjeta de producto
  const CompactProductCard = useCallback(({ product }) => {
    const isPending = product.pendiente === true;
    const boutiqueName = product.boutique?.nom_boutique || 'Boutique';
    const themeColor = product.boutique?.couleur_theme || '#6366F1';
    
    const getFirstImage = () => {
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      return null;
    };

    const imageUrl = getFirstImage();

    return (
      <Card 
        className={`border-0 shadow-sm h-100 overflow-hidden ${isPending ? 'pending-card' : 'approved-card'}`}
        style={{ 
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: isPending ? '#fffbea' : '#ffffff'
        }}
        onClick={() => handleViewProduct(product._id)}
      >
        <div className="status-badge" style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
          {isPending ? (
            <Badge bg="warning" className="px-2 py-1 rounded-pill">
              ⏳ En attente
            </Badge>
          ) : (
            <Badge bg="success" className="px-2 py-1 rounded-pill">
              ✓ Vérifié
            </Badge>
          )}
        </div>
        
        <div className="boutique-badge" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
          <Badge style={{ backgroundColor: themeColor, fontSize: '0.65rem' }} className="px-2 py-1 rounded-pill">
            <FaStore size={8} className="me-1" /> {boutiqueName}
          </Badge>
        </div>
        
        <Row className="g-0">
          <Col xs={4} md={4} className="p-2">
            <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.title} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                  <FaBoxOpen size={24} />
                </div>
              )}
            </div>
          </Col>
          
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              <Card.Title className="fw-bold mb-1" style={{ fontSize: '0.95rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.title || 'Produit sans titre'}
              </Card.Title>
              
              {product.price > 0 && (
                <div className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: themeColor }}>
                  {product.price.toLocaleString()} DA
                </div>
              )}
              
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(product.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        <div className="action-buttons" style={{ position: 'absolute', bottom: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => { e.stopPropagation(); handleViewProduct(product._id); }} title="Voir" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={12} />
          </Button>
          
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => handleEditProduct(product, e)} title="Modifier" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Pencil size={12} />
          </Button>
          
          <Button variant="danger" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => handleDeleteProduct(product, e)} title="Supprimer" style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  }, []);

  // Estados de carga
  if ((loadingProducts || loadingBoutiques) && productsList.length === 0 && isInitialLoad) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos produits...</p>
      </Container>
    );
  }

  if (!auth?.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos produits.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="mes-products-boutiques-page">
      <Container fluid className="py-4">
        {/* Header con botón para abrir drawer */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            {/* Botón para abrir drawer de boutiques */}
            <Button 
              variant="light" 
              className="rounded-circle p-2 shadow-sm"
              onClick={() => setShowDrawer(true)}
              style={{ width: '44px', height: '44px' }}
            >
              <List size={20} />
            </Button>
            <div>
              <h1 className="h3 mb-0 d-flex align-items-center gap-2">
                <FaBoxOpen /> Mes Produits
                <Badge bg="secondary" className="ms-2">{filteredProducts.length}/{stats.total}</Badge>
              </h1>
              <p className="text-muted small mb-0 mt-1">
                {selectedBoutique ? (
                  <>Produits de <strong>{selectedBoutique.nom_boutique}</strong></>
                ) : (
                  'Tous vos produits de boutique'
                )}
              </p>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            className="rounded-pill px-4 py-2" 
            onClick={handleCreateProduct} 
            disabled={!userBoutiques || userBoutiques.length === 0}
          >
            <Plus className="me-2" size={18} />
            Ajouter un produit
          </Button>
        </div>

        {/* Filtro de estado (aprobación) */}
        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Filter className="text-muted" size={18} />
              <span className="text-muted fw-semibold">Statut:</span>
            </div>
            
            <Button 
              variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'} 
              size="sm" 
              className="rounded-pill px-3" 
              onClick={() => handleFilterChange('all')}
            >
              Tous ({filteredProducts.length})
            </Button>
            
            <Button 
              variant={filterStatus === 'pending' ? 'warning' : 'outline-secondary'} 
              size="sm" 
              className="rounded-pill px-3" 
              onClick={() => handleFilterChange('pending')}
            >
              ⏳ En attente ({filteredProducts.filter(p => p.pendiente === true).length})
            </Button>

            <Button 
              variant={filterStatus === 'approved' ? 'success' : 'outline-secondary'} 
              size="sm" 
              className="rounded-pill px-3" 
              onClick={() => handleFilterChange('approved')}
            >
              ✓ Vérifiés ({filteredProducts.filter(p => p.pendiente === false).length})
            </Button>

            {/* Badge de boutique seleccionada con botón para limpiar */}
            {selectedBoutique && (
              <Badge 
                style={{ backgroundColor: selectedBoutique.couleur_theme || '#6366F1', cursor: 'pointer' }}
                className="px-3 py-2 rounded-pill d-flex align-items-center gap-2"
                onClick={handleClearBoutiqueFilter}
              >
                <FaStore size={12} />
                {selectedBoutique.nom_boutique}
                <X size={12} />
              </Badge>
            )}
          </div>
        </div>

        {/* Lista de productos */}
        {filteredProducts.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedProducts.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-muted small">Chargement...</p>
              </div>
            }
            endMessage={
              displayedProducts.length > 0 && displayedProducts.length >= filteredProducts.length && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">✨ Vous avez vu tous vos produits ✨</p>
                </div>
              )
            }
          >
            <Row className="g-4">
              {displayedProducts.map((product) => (
                <Col key={product._id} xs={12} sm={6} lg={4} xl={3}>
                  <CompactProductCard product={product} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaBoxOpen size={60} className="text-muted opacity-50" />
            </div>
            <h4 className="h5 mb-2">Aucun produit trouvé</h4>
            <p className="text-muted mb-4">
              {selectedBoutique ? (
                <>Vous n'avez pas encore de produits dans <strong>{selectedBoutique.nom_boutique}</strong></>
              ) : !userBoutiques || userBoutiques.length === 0 ? (
                'Commencez par créer une boutique'
              ) : (
                'Commencez par ajouter des produits à vos boutiques'
              )}
            </p>
            {!userBoutiques || userBoutiques.length === 0 ? (
              <Button variant="primary" className="rounded-pill px-4" onClick={() => history.push('/create-boutique')}>
                <Plus className="me-2" size={18} />
                Créer une boutique
              </Button>
            ) : (
              <Button variant="primary" className="rounded-pill px-4" onClick={handleCreateProduct}>
                <Plus className="me-2" size={18} />
                Ajouter un produit
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* 🔥 DRAWER LATERAL DE BOUTIQUES */}
      <Offcanvas 
        show={showDrawer} 
        onHide={() => setShowDrawer(false)}
        placement="start"
        style={{ width: isMobile ? '85%' : '320px' }}
      >
        <Offcanvas.Header className="border-bottom">
          <Offcanvas.Title>
            <FaStore className="me-2" />
            Mes Boutiques
          </Offcanvas.Title>
          <Button variant="link" className="text-dark p-0" onClick={() => setShowDrawer(false)}>
            <X size={20} />
          </Button>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="p-0">
          {/* Boutique "Toutes" */}
          <div 
            className={`boutique-drawer-item ${!selectedBoutique ? 'active' : ''}`}
            onClick={() => {
              handleSelectBoutique(null);
              setShowDrawer(false);
            }}
          >
            <div className="boutique-icon" style={{ backgroundColor: '#6366F1' }}>
              <FaStore size={20} />
            </div>
            <div className="boutique-info">
              <div className="boutique-name">Toutes les boutiques</div>
              <div className="boutique-stats">
                {stats.total} produit{stats.total > 1 ? 's' : ''}
                {stats.pending > 0 && ` • ${stats.pending} en attente`}
              </div>
            </div>
            {!selectedBoutique && <FaChevronRight className="ms-auto text-muted" />}
          </div>

          {/* Separador */}
          <div className="drawer-divider">
            <span>MES BOUTIQUES</span>
          </div>

          {/* Lista de boutiques del usuario */}
          {stats.byBoutique.length > 0 ? (
            stats.byBoutique.map((boutique) => (
              <div 
                key={boutique._id}
                className={`boutique-drawer-item ${selectedBoutique?._id === boutique._id ? 'active' : ''}`}
                onClick={() => handleSelectBoutique(boutique)}
              >
                <div 
                  className="boutique-icon" 
                  style={{ backgroundColor: boutique.couleur_theme || '#6366F1' }}
                >
                  {getBoutiqueIcon(boutique.domaine_boutique)}
                </div>
                <div className="boutique-info">
                  <div className="boutique-name">{boutique.nom_boutique}</div>
                  <div className="boutique-stats">
                    {boutique.productCount} produit{boutique.productCount > 1 ? 's' : ''}
                    {boutique.pendingCount > 0 && (
                      <Badge bg="warning" className="ms-2 text-dark">
                        {boutique.pendingCount} en attente
                      </Badge>
                    )}
                  </div>
                  {boutique.approvedCount > 0 && (
                    <div className="boutique-approved text-success small">
                      ✓ {boutique.approvedCount} vérifié{boutique.approvedCount > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                {selectedBoutique?._id === boutique._id && (
                  <FaChevronRight className="ms-auto text-muted" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">
              <FaStore size={32} className="mb-2 opacity-50" />
              <p>Aucune boutique créée</p>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-pill"
                onClick={() => {
                  setShowDrawer(false);
                  history.push('/create-boutique');
                }}
              >
                Créer une boutique
              </Button>
            </div>
          )}

          {/* Footer del drawer */}
          <div className="drawer-footer">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="rounded-pill w-100"
              onClick={() => {
                setShowDrawer(false);
                history.push('/create-boutique');
              }}
            >
              <Plus size={14} className="me-1" />
              Nouvelle boutique
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Estilos CSS */}
      <style jsx="true">{`
        .pending-card { 
          border-left: 4px solid #ffc107 !important; 
        }
        .approved-card { 
          border-left: 4px solid #198754 !important; 
        }
        .card {
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
        }
        .action-buttons .btn {
          transition: all 0.2s ease;
        }
        .action-buttons .btn:hover {
          transform: scale(1.1);
        }
        .filters-section {
          background: white;
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        
        /* Estilos del Drawer */
        .boutique-drawer-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        
        .boutique-drawer-item:hover {
          background-color: #f8fafc;
        }
        
        .boutique-drawer-item.active {
          background-color: #eef2ff;
          border-left-color: #6366F1;
        }
        
        .boutique-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .boutique-info {
          flex: 1;
        }
        
        .boutique-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .boutique-stats {
          font-size: 0.7rem;
          color: #64748b;
        }
        
        .boutique-approved {
          font-size: 0.65rem;
          margin-top: 2px;
        }
        
        .drawer-divider {
          margin: 12px 0;
          position: relative;
          text-align: center;
        }
        
        .drawer-divider span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
          background: white;
          padding: 0 10px;
        }
        
        .drawer-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
          z-index: 0;
        }
        
        .drawer-divider span {
          position: relative;
          z-index: 1;
        }
        
        .drawer-footer {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
          margin-top: 16px;
        }
        
        @media (max-width: 768px) {
          .boutique-drawer-item {
            padding: 12px 14px;
          }
          
          .boutique-icon {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default MesProductsBoutiques;