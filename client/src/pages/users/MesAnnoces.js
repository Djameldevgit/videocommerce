// src/pages/MesAnnoces.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getProfileUsers } from '../../redux/actions/profileAction';
import { deletePost } from '../../redux/actions/postAction';
import { Pencil, Trash, Plus, Eye, Filter } from 'react-bootstrap-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const MesAnnoces = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { auth, profile } = useSelector(state => state);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  // Obtener el ID del usuario actual
  const userId = auth.user?._id;

  // Cargar posts del usuario
  useEffect(() => {
    if (!userId || !auth.token) return;

    const loadUserPosts = async () => {
      try {
        setLoading(true);
        console.log('📦 Cargando posts para usuario:', userId);
        
        const existingUserPosts = profile.posts.find(p => p._id === userId);
        
        if (!existingUserPosts) {
          await dispatch(getProfileUsers({ id: userId, auth }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error cargando posts:', error);
        setLoading(false);
      }
    };

    loadUserPosts();
  }, [userId, auth, dispatch, profile.posts]);

  // Extraer y procesar los posts del usuario desde el store
  useEffect(() => {
    if (userId && profile.posts.length > 0) {
      const userPostsData = profile.posts.find(p => p._id === userId);
      
      if (userPostsData && userPostsData.posts) {
        console.log(`✅ ${userPostsData.posts.length} posts encontrados para el usuario`);
        
        // 🔥 Depuración: ver el campo pendiente de cada post
        userPostsData.posts.forEach((post, index) => {
          console.log(`📝 Post ${index + 1}:`, {
            id: post._id,
            title: post.title,
            pendiente: post.pendiente
          });
        });
        
        const sortedPosts = [...userPostsData.posts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setUserPosts(sortedPosts);
        filterPostsByStatus(sortedPosts, filterStatus);
      } else {
        setUserPosts([]);
        setFilteredPosts([]);
      }
    }
  }, [userId, profile.posts, filterStatus]);

  // Función para filtrar posts por estado
  const filterPostsByStatus = (posts, status) => {
    if (status === 'all') {
      setFilteredPosts(posts);
    } else if (status === 'pending') {
      // Filtrar posts pendientes (pendiente === true)
      const filtered = posts.filter(post => post.pendiente === true);
      setFilteredPosts(filtered);
    }
    
    setPage(1);
    setHasMore(posts.length > postsPerPage);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    filterPostsByStatus(userPosts, status);
  };

  // Manejar edición de post
  const handleEditPost = (postId, e) => {
    e.stopPropagation();
    history.push(`/edit-post/${postId}`);
  };

  // Manejar eliminación de post
  const handleDeletePost = async (postId, e) => {
    e.stopPropagation();
    
    if (window.confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      try {
        await dispatch(deletePost({ postId, auth }));
        
        const updatedPosts = userPosts.filter(post => post._id !== postId);
        setUserPosts(updatedPosts);
        filterPostsByStatus(updatedPosts, filterStatus);
        
      } catch (error) {
        console.error('Error eliminando post:', error);
        alert('Error al eliminar el anuncio');
      }
    }
  };

  // Ver post
  const handleViewPost = (postId) => {
    history.push(`/post/${postId}`);
  };

  // Crear nuevo anuncio
  const handleCreatePost = () => {
    history.push('/creer-annonce');
  };

  // Cargar más posts para infinite scroll
  const loadMorePosts = useCallback(() => {
    if (filteredPosts.length > page * postsPerPage) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  }, [filteredPosts.length, page, postsPerPage]);

  // Posts a mostrar según la página actual
  const displayedPosts = filteredPosts.slice(0, page * postsPerPage);

  // 🔥 Función para verificar si un post está pendiente
  const isPostPending = (post) => {
    return post.pendiente === true;
  };

  // Estadísticas - solo total y pendientes
  const stats = {
    total: userPosts.length,
    pending: userPosts.filter(p => p.pendiente === true).length,
    approved: userPosts.filter(p => p.pendiente === false).length
  };

  // Estados de carga
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos annonces...</p>
      </Container>
    );
  }

  // Verificar autenticación
  if (!auth.token || !userId) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos annonces.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  // Componente de tarjeta pequeña para cada post
  const SmallPostCard = ({ post }) => {
    const isPending = isPostPending(post);
    
    // Obtener la primera imagen del post
    const getFirstImage = () => {
      if (post.images && post.images.length > 0) {
        const firstImage = post.images[0];
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
        onClick={() => handleViewPost(post._id)}
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
                  alt={post.title || 'Annonce'}
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
                  <i className="fas fa-image fa-2x"></i>
                </div>
              )}
            </div>
          </Col>
          
          {/* Contenido - columna derecha */}
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              {/* Título */}
              <Card.Title 
                className="fw-bold mb-2"
                style={{ 
                  fontSize: '0.95rem',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {post.title || 'Annonce'}
              </Card.Title>
              
              {/* Fecha de publicación */}
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(post.createdAt).format('DD/MM/YYYY')}</span>
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
            onClick={(e) => { e.stopPropagation(); handleViewPost(post._id); }}
            title="Voir"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Eye size={12} />
          </Button>
          
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); handleEditPost(post._id, e); }}
            title="Modifier"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Pencil size={12} />
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); handleDeletePost(post._id, e); }}
            title="Supprimer"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="mes-annoces-page">
      <Container className="py-2">
        {/* Header con título y botón crear */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        
          <Button 
            variant="primary" 
            className="rounded-pill px-4"
            onClick={handleCreatePost}
          >
            <Plus className="me-1" size={15} />
            Nouvelle annonce
          </Button>
        </div>
 
        {/* Filtros - simplificados */}
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
          </div>
        </div>

        {/* Listado de anuncios */}
        {filteredPosts.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedPosts.length}
            next={loadMorePosts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-muted small">Chargement...</p>
              </div>
            }
            endMessage={
              displayedPosts.length > 0 && displayedPosts.length >= filteredPosts.length && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">Vous avez vu toutes vos annonces</p>
                </div>
              )
            }
          >
            <Row>
              {displayedPosts.map((post) => (
                <Col key={post._id} xs={12} md={6} lg={4} className="mb-4">
                  <SmallPostCard post={post} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <i className="fas fa-box-open fa-4x text-muted"></i>
            </div>
            <h4 className="h5 mb-2">Aucune annonce</h4>
            <p className="text-muted mb-4">
              {filterStatus !== 'all' 
                ? 'Aucune annonce en attente de vérification'
                : 'Commencez par publier votre première annonce'}
            </p>
            <Button 
              variant="primary" 
              className="rounded-pill px-4"
              onClick={handleCreatePost}
            >
              <Plus className="me-2" size={18} />
              Publier une annonce
            </Button>
          </div>
        )}
      </Container>

      <style jsx="true">{`
        .stats-card {
          transition: transform 0.2s;
        }
        .stats-card:hover {
          transform: translateY(-2px);
        }
        .stats-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-state {
          opacity: 0.7;
        }
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
        .action-buttons {
          position: absolute;
          top: 8px;
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

export default MesAnnoces;