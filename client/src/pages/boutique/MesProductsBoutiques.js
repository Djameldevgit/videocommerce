// 📂 pages/MesProductsBoutiques.jsx - VERSIÓN CORREGIDA con acciones reales
import React, { useEffect, useState  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Pencil, Plus, Eye, Filter, Trash } from 'react-bootstrap-icons';
import { FaStore, FaBoxOpen } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';

// ✅ ACCIONES CORRECTAS - usando boutiqueProductAction
import { 
  getBoutiqueProducts, 
  deleteBoutiqueProduct,
  resetBoutiqueProducts 
} from '../../redux/actions/boutiqueProductAction';
import { getUserBoutiques } from '../../redux/actions/boutiqueAction';

moment.locale('fr');

const MesProductsBoutiques = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading: loadingBoutiques } = useSelector(state => state.boutique || { userBoutiques: [], loading: false });
  
  // Estado para productos agrupados por boutique
  const boutiqueProductState = useSelector(state => state.boutiqueProduct);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [refresh, setRefresh] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending
  const [filterBoutique, setFilterBoutique] = useState('all'); // all, boutiqueId
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 9;

  // Cargar boutiques del usuario
  useEffect(() => {
    if (auth?.token) {
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth, refresh]);

  // Cargar productos de CADA boutique del usuario
  useEffect(() => {
    const loadAllUserProducts = async () => {
      if (!auth?.token || !userBoutiques || userBoutiques.length === 0) {
        setAllProducts([]);
        return;
      }
      
      setLoadingProducts(true);
      let allProductsArray = [];
      
      try {
        // Iterar sobre cada boutique del usuario y cargar sus productos
        for (const boutique of userBoutiques) {
          console.log(`🔄 Cargando productos de boutique: ${boutique.nom_boutique}`);
          
          // Resetear productos de esta boutique antes de cargar
          dispatch(resetBoutiqueProducts(boutique._id));
          
          // Cargar productos de la boutique
          const result = await dispatch(getBoutiqueProducts(boutique._id, { page: 1, limit: 100 }, true));
          
          // Obtener los productos del estado
          const boutiqueProducts = boutiqueProductState.products?.[boutique._id]?.products || [];
          
          // Agregar información de la boutique a cada producto
          const productsWithBoutique = boutiqueProducts.map(product => ({
            ...product,
            boutiqueInfo: {
              _id: boutique._id,
              nom_boutique: boutique.nom_boutique,
              couleur_theme: boutique.couleur_theme
            }
          }));
          
          allProductsArray = [...allProductsArray, ...productsWithBoutique];
        }
        
        console.log(`✅ Total productos cargados: ${allProductsArray.length}`);
        setAllProducts(allProductsArray);
        
      } catch (error) {
        console.error('❌ Error cargando productos:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    loadAllUserProducts();
  }, [dispatch, auth, userBoutiques, refresh]);

  // Filtrar productos cuando cambien los datos o los filtros
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      filterProducts(allProducts, filterStatus, filterBoutique);
    } else {
      setFilteredProducts([]);
    }
  }, [allProducts, filterStatus, filterBoutique]);

  // Función para filtrar productos
  const filterProducts = (products, status, boutiqueId) => {
    let filtered = [...products];
    
    // Filtrar por estado de aprobación
    if (status === 'pending') {
      filtered = filtered.filter(product => product.pendiente === true);
    }
    
    // Filtrar por boutique
    if (boutiqueId !== 'all') {
      filtered = filtered.filter(product => 
        product.boutiqueInfo?._id === boutiqueId || 
        product.boutiqueId === boutiqueId
      );
    }
    
    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredProducts(filtered);
    setPage(1);
    setHasMore(filtered.length > productsPerPage);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleBoutiqueFilterChange = (boutiqueId) => {
    setFilterBoutique(boutiqueId);
  };

  // ✅ Eliminar producto usando deleteBoutiqueProduct
  const handleDeleteProduct = async (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutiqueInfo?._id || product.boutiqueId;
    
    if (window.confirm('Supprimer ce produit ? Cette action est irréversible.')) {
      try {
        await dispatch(deleteBoutiqueProduct({ 
          boutiqueId, 
          productId: product._id, 
          auth 
        }));
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression du produit');
      }
    }
  };

  // Ver producto
  const handleViewProduct = (productId) => {
    history.push(`/product/${productId}`);
  };

  // Editar producto
  const handleEditProduct = (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutiqueInfo?._id || product.boutiqueId;
    history.push(`/edit-boutique-product/${boutiqueId}/${product._id}`);
  };

  // Crear nuevo producto
  const handleCreateProduct = () => {
    // Si tiene boutiques, redirigir a selección o a la primera boutique
    if (userBoutiques && userBoutiques.length > 0) {
      history.push(`/create-product/${userBoutiques[0]._id}`);
    } else {
      alert('Veuillez créer une boutique d\'abord');
      history.push('/create-boutique');
    }
  };

  // Verificar si un producto está pendiente
  const isProductPending = (product) => {
    return product.pendiente === true;
  };

  // Cargar más productos
  const loadMoreProducts = () => {
    if (filteredProducts.length > page * productsPerPage) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const displayedProducts = filteredProducts.slice(0, page * productsPerPage);

  // Estadísticas
  const stats = {
    total: allProducts?.length || 0,
    pending: allProducts?.filter(p => p.pendiente === true).length || 0,
    approved: allProducts?.filter(p => p.pendiente === false).length || 0,
    byBoutique: allProducts?.reduce((acc, p) => {
      const boutiqueName = p.boutiqueInfo?.nom_boutique || p.boutiqueId || 'Sans boutique';
      acc[boutiqueName] = (acc[boutiqueName] || 0) + 1;
      return acc;
    }, {})
  };

  // Componente de tarjeta compacta para producto
  const CompactProductCard = ({ product }) => {
    const isPending = isProductPending(product);
    const boutiqueName = product.boutiqueInfo?.nom_boutique || 'Boutique';
    const themeColor = product.boutiqueInfo?.couleur_theme || '#6366F1';
    
    // Obtener la primera imagen
    // En MesProductsBoutiques.jsx - dentro de CompactProductCard
const getFirstImage = () => {
  console.log('🔍 Producto:', product._id, product.title);
  console.log('📦 images:', product.images);
  
  if (!product.images || product.images.length === 0) {
    console.log('❌ No hay imágenes');
    return null;
  }
  
  const firstImage = product.images[0];
  console.log('🖼️ Primera imagen:', firstImage);
  
  if (typeof firstImage === 'string') {
    console.log('✅ Es string:', firstImage);
    return firstImage;
  }
  
  if (typeof firstImage === 'object' && firstImage.url) {
    console.log('✅ Es objeto con url:', firstImage.url);
    return firstImage.url;
  }
  
  console.log('❌ Formato no reconocido');
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
        {/* Badge flotante según estado */}
        <div className="status-badge">
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
        
        {/* Badge de boutique */}
        <div className="boutique-badge">
          <Badge style={{ backgroundColor: themeColor, fontSize: '0.65rem' }} className="px-2 py-1 rounded-pill">
            <FaStore size={8} className="me-1" /> {boutiqueName}
          </Badge>
        </div>
        
        <Row className="g-0">
          {/* Imagen pequeña - columna izquierda */}
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
                  alt={product.title || 'Produit'}
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
                  <FaBoxOpen size={24} />
                </div>
              )}
            </div>
          </Col>
          
          {/* Contenido - columna derecha */}
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              {/* Título */}
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
                {product.title || 'Produit sans titre'}
              </Card.Title>
              
              {/* Precio */}
              {product.price && (
                <div className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: themeColor }}>
                  {product.price.toLocaleString()} DA
                </div>
              )}
              
              {/* Fecha de publicación */}
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(product.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        {/* Botones de acción flotantes */}
        <div className="action-buttons">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); handleViewProduct(product._id); }}
            title="Voir"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Eye size={12} />
          </Button>
          
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => handleEditProduct(product, e)}
            title="Modifier"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Pencil size={12} />
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => handleDeleteProduct(product, e)}
            title="Supprimer"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };

  // Estados de carga
  if ((loadingProducts || loadingBoutiques) && allProducts.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos produits...</p>
      </Container>
    );
  }

  // Verificar autenticación
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
      <Container className="py-2">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 className="h3 mb-0 d-flex align-items-center gap-2">
            <FaBoxOpen /> Mes Produits
            <Badge bg="secondary" className="ms-2">{stats.total}</Badge>
          </h1>
          
          <Button 
            variant="primary" 
            className="rounded-pill px-4"
            onClick={handleCreateProduct}
            disabled={!userBoutiques || userBoutiques.length === 0}
          >
            <Plus className="me-1" size={15} />
            Ajouter un produit
          </Button>
        </div>

        {/* Filtros */}
        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Filter className="text-muted" size={18} />
              <span className="text-muted">Filtrer:</span>
            </div>
            
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('all')}
            >
              Tous <Badge bg="secondary" className="ms-1">{stats.total}</Badge>
            </Button>
            
            <Button
              variant={filterStatus === 'pending' ? 'warning' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('pending')}
            >
              En attente <Badge bg="warning" className="ms-1">{stats.pending}</Badge>
            </Button>

            {/* Filtro por boutique */}
            {userBoutiques && userBoutiques.length > 1 && (
              <Form.Select 
                size="sm" 
                value={filterBoutique} 
                onChange={(e) => handleBoutiqueFilterChange(e.target.value)}
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <option value="all">Toutes les boutiques</option>
                {userBoutiques.map(b => (
                  <option key={b._id} value={b._id}>{b.nom_boutique}</option>
                ))}
              </Form.Select>
            )}
          </div>
        </div>

        {/* Listado de productos */}
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
                  <p className="text-muted mb-0">Vous avez vu tous vos produits</p>
                </div>
              )
            }
          >
            <Row>
              {displayedProducts.map((product) => (
                <Col key={product._id} xs={12} md={6} lg={4} className="mb-4">
                  <CompactProductCard product={product} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaBoxOpen size={60} className="text-muted" />
            </div>
            <h4 className="h5 mb-2">Aucun produit</h4>
            <p className="text-muted mb-4">
              {filterStatus !== 'all' 
                ? 'Aucun produit en attente de vérification'
                : !userBoutiques || userBoutiques.length === 0
                  ? 'Commencez par créer une boutique'
                  : 'Commencez par ajouter des produits à vos boutiques'}
            </p>
            {!userBoutiques || userBoutiques.length === 0 ? (
              <Button 
                variant="primary" 
                className="rounded-pill px-4"
                onClick={() => history.push('/create-boutique')}
              >
                <Plus className="me-2" size={18} />
                Créer une boutique
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="rounded-pill px-4"
                onClick={handleCreateProduct}
              >
                <Plus className="me-2" size={18} />
                Ajouter un produit
              </Button>
            )}
          </div>
        )}
      </Container>

      {/* Estilos */}
      <style jsx="true">{`
        .pending-card {
          border-left: 4px solid #ffc107 !important;
        }
        .approved-card {
          border-left: 4px solid #198754 !important;
        }
        .status-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 10;
        }
        .boutique-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
        }
        .action-buttons {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          z-index: 10;
        }
        .action-buttons .btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border: 1px solid #e9ecef;
        }
        .action-buttons .btn:hover {
          transform: scale(1.05);
        }
        .card {
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default MesProductsBoutiques;