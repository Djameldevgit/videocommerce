// 📂 components/boutique/boutiquePost/BoutiqueProductCard.jsx - VERSIÓN CORREGIDA

import React, { useState, useRef, useEffect } from 'react';
import { Card, Badge, Modal, Button, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaStore, FaMapMarkerAlt, FaTag, FaEye, FaClock, FaEdit, FaTrash, FaArchive,
  FaHeart, FaRegHeart, FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaCopy, FaCheck,
  FaStar, FaRegStar, FaEllipsisV
} from 'react-icons/fa';
import { deleteBoutiqueProduct, updateBoutiqueProduct } from '../../redux/actions/boutiqueProductAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const BoutiqueProductCard = ({ post, boutique }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  
  // Obtener auth de Redux
  const auth = useSelector(state => state.auth);
  
  // Estados del componente
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const menuRef = useRef(null);

  // 🔥 PERMISOS CORRECTOS PARA PRODUCTOS DE BOUTIQUE
  const currentUserId = auth?.user?._id;
  
  // 1. Dueño de la boutique (el que creó la boutique)
  const isBoutiqueOwner = currentUserId === boutique?.user?._id;
  
  // 2. Creador del producto (el que publicó este producto específico)
  const isProductCreator = currentUserId === post.user?._id;
  
  // 3. Admin
  const isAdmin = auth?.user?.role === 'admin';
  
  // 🔥 Puede editar si es dueño de la boutique, creador del producto, o admin
  const canEdit = isBoutiqueOwner || isProductCreator || isAdmin;

  // Verificar like
  const isLiked = post.likes?.includes(currentUserId) || false;
  const likesCount = post.likes?.length || 0;
  const mainColor = boutique?.couleur_theme || '#6366F1';

  // Log para depuración
  useEffect(() => {
    console.log('🔍 [CARD] Permisos:', {
      currentUserId,
      boutiqueOwnerId: boutique?.user?._id,
      productCreatorId: post.user?._id,
      isBoutiqueOwner,
      isProductCreator,
      isAdmin,
      canEdit
    });
  }, [currentUserId, boutique, post, isBoutiqueOwner, isProductCreator, isAdmin, canEdit]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const stopPropagation = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // 🔥 CORREGIDO: Usar /product/ en lugar de /post/
  const handleCardClick = (e) => {
    if (showMenu) return;
    if (e.target.closest('button') || e.target.closest('.menu-button')) {
      return;
    }
    history.push(`/product/${post._id}`);
  };

  // EDITAR PRODUCTO
  const handleEdit = (e) => {
    stopPropagation(e);
    setShowMenu(false);
    
    console.log('✏️ Editando producto:', post._id);
    console.log('🔑 Auth disponible:', !!auth?.token);
    
    const editUrl = `/boutique/${boutique?._id}/products/edit/${post._id}`;
    
    history.push({
      pathname: editUrl,
      state: {
        isEdit: true,
        postData: post,
        boutiqueData: boutique
      }
    });
  };

  // ELIMINAR PRODUCTO
  const handleDelete = async (e) => {
    stopPropagation(e);
    setShowMenu(false);
    setIsDeleting(true);
    
    console.log('🗑️ Eliminando producto:', post._id);
    
    if (!auth?.token) {
      console.error('❌ No hay token para eliminar');
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: 'Veuillez vous reconnecter pour supprimer ce produit' }
      });
      setIsDeleting(false);
      return;
    }
    
    try {
      await dispatch(deleteBoutiqueProduct({ 
        boutiqueId: boutique?._id, 
        productId: post._id, 
        auth 
      }));
      setShowDeleteModal(false);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { success: '✅ Produit supprimé avec succès!' }
      });
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: error.response?.data?.message || 'Erreur lors de la suppression' }
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ACTIVAR/DESACTIVAR PRODUCTO
  const handleToggleActive = async (e) => {
    stopPropagation(e);
    setShowMenu(false);
    
    console.log('🔄 Cambiando estado del producto:', post._id);
    
    if (!auth?.token) {
      console.error('❌ No hay token para cambiar estado');
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: 'Veuillez vous reconnecter pour modifier ce produit' }
      });
      return;
    }
    
    try {
      await dispatch(updateBoutiqueProduct({ 
        boutiqueId: boutique?._id, 
        productId: post._id,
        productData: { isActive: !post.isActive },
        auth 
      }));
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { success: post.isActive ? '📦 Produit désactivé' : '📦 Produit activé' }
      });
    } catch (error) {
      console.error('❌ Error toggling product status:', error);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: error.response?.data?.message || 'Erreur lors de la modification' }
      });
    }
  };

  const handleLike = async (e) => {
    stopPropagation(e);
    if (isLiking) return;
    setIsLiking(true);
    try {
      console.log(`${isLiked ? 'Unlike' : 'Like'} producto:`, post._id);
    } catch (error) {
      console.error('Error liking product:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = (e) => {
    stopPropagation(e);
    setShowShareModal(true);
  };

  // 🔥 CORREGIDO: Usar /product/ en lugar de /post/
  const copyLink = async (e) => {
    stopPropagation(e);
    const url = `${window.location.origin}/product/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { success: 'Lien copié dans le presse-papier!' }
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 🔥 CORREGIDO: Usar /product/ en lugar de /post/ para compartir en redes sociales
  const getShareUrl = () => {
    return `${window.location.origin}/product/${post._id}`;
  };

  const getImage = () => {
    if (post.images && post.images.length > 0) {
      const firstImage = post.images[0];
      return firstImage.url || firstImage;
    }
    return null;
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratuit';
    return `${price.toLocaleString()} DA`;
  };

  const getEtatLabel = (etat) => {
    const etatMap = {
      'neuf': 'Neuf',
      'comme-neuf': 'Comme neuf',
      'bon-etat': 'Bon état',
      'correct': 'Correct'
    };
    return etatMap[etat] || etat;
  };

  const getEtatColor = (etat) => {
    const colorMap = {
      'neuf': '#28a745',
      'comme-neuf': '#20c997',
      'bon-etat': '#17a2b8',
      'correct': '#ffc107'
    };
    return colorMap[etat] || '#6c757d';
  };

  const getScoreStars = (score) => {
    if (!score && score !== 0) return null;
    const stars = [];
    const roundedScore = Math.round(score);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedScore) {
        stars.push(<FaStar key={i} size={10} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} size={10} className="text-secondary" />);
      }
    }
    return stars;
  };

  const imageUrl = getImage();
  const isActive = post.isActive !== false;
  const scoreStars = getScoreStars(post.score);
  const shareUrl = getShareUrl();

  const renderTooltip = (text) => (
    <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  return (
    <>
      <Card 
        className={`boutique-product-card h-100 border-0 ${!isActive ? 'opacity-50' : ''}`}
        onClick={handleCardClick}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          position: 'relative'
        }}
      >
        {/* ... resto del contenido del card (sin cambios) ... */}
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={post.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = '/uploads/placeholder.jpg';
                setImageError(true);
              }}
            />
          ) : (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: `${mainColor}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaStore size={48} color={mainColor} />
            </div>
          )}

          <Badge 
            className="position-absolute top-0 start-0 m-2"
            style={{
              backgroundColor: getEtatColor(post.etat),
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '500',
              zIndex: 2
            }}
          >
            {getEtatLabel(post.etat)}
          </Badge>

          <Badge 
            className="position-absolute bottom-0 end-0 m-2"
            style={{
              backgroundColor: mainColor,
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {formatPrice(post.price)}
          </Badge>

          {scoreStars && (
            <div 
              className="position-absolute top-0 end-0 m-2 d-flex gap-1"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.6)', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '20px',
                zIndex: 2
              }}
            >
              {scoreStars}
            </div>
          )}

          {/* MENÚ DE TRES PUNTOS */}
          {canEdit && (
            <div 
              ref={menuRef}
              className="position-absolute top-0 end-0 m-2"
              style={{ zIndex: 100 }}
            >
              <button
                className="menu-button"
                onClick={(e) => {
                  stopPropagation(e);
                  setShowMenu(!showMenu);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <FaEllipsisV size={14} color="white" />
              </button>
              
              {showMenu && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '40px',
                    right: '0',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: '180px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    padding: '8px 0'
                  }}
                >
                  <div 
                    onClick={handleEdit}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s ease',
                      fontSize: '14px',
                      color: '#333'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <FaEdit size={14} color="#007bff" />
                    <span>Modifier</span>
                  </div>
                  
                  <div 
                    onClick={handleToggleActive}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s ease',
                      fontSize: '14px',
                      color: '#333'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <FaArchive size={14} color="#ffc107" />
                    <span>{isActive ? 'Désactiver' : 'Activer'}</span>
                  </div>
                  
                  <div 
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s ease',
                      fontSize: '14px',
                      color: '#dc3545'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <FaTrash size={14} />
                    <span>Supprimer</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Overlay con botones de like y compartir */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              zIndex: 5,
              pointerEvents: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
          >
            <OverlayTrigger placement="top" overlay={renderTooltip(isLiked ? 'Retirer le like' : 'Aimer')}>
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle action-button"
                onClick={handleLike}
                disabled={isLiking}
                style={{ width: '36px', height: '36px', borderRadius: '50%', pointerEvents: 'auto' }}
              >
                {isLiking ? (
                  <Spinner size="sm" />
                ) : (
                  isLiked ? <FaHeart color="red" /> : <FaRegHeart />
                )}
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={renderTooltip('Partager')}>
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle action-button share-btn"
                onClick={handleShare}
                style={{ width: '36px', height: '36px', borderRadius: '50%', pointerEvents: 'auto' }}
              >
                <FaShare />
              </Button>
            </OverlayTrigger>
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-3">
          <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', lineHeight: '1.3' }}>
            {post.title}
          </h6>

          {post.description && (
            <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              {post.description.length > 100 
                ? `${post.description.substring(0, 100)}...` 
                : post.description}
            </p>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <OverlayTrigger placement="top" overlay={renderTooltip(`${post.views || 0} vues`)}>
              <div className="d-flex align-items-center text-muted small">
                <FaEye size={12} className="me-1" />
                <span>{post.views || 0}</span>
              </div>
            </OverlayTrigger>
            
            <OverlayTrigger placement="top" overlay={renderTooltip(`${likesCount} likes`)}>
              <div className="d-flex align-items-center text-muted small">
                <FaHeart size={12} className="me-1 text-danger" />
                <span>{likesCount}</span>
              </div>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={renderTooltip('Date de publication')}>
              <div className="d-flex align-items-center text-muted small">
                <FaClock size={12} className="me-1" />
                <span>
                  {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </OverlayTrigger>
          </div>

          {post.wilaya && (
            <div className="d-flex align-items-center text-muted small mt-2">
              <FaMapMarkerAlt size={10} className="me-1 text-danger" />
              <span>{post.wilaya}{post.commune ? `, ${post.commune}` : ''}</span>
            </div>
          )}

          {(post.categorie || post.subCategory) && (
            <div className="mt-2">
              <span 
                style={{
                  backgroundColor: `${mainColor}15`,
                  color: mainColor,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                <FaTag size={10} className="me-1" />
                {post.categorie}
                {post.subCategory && ` / ${post.subCategory}`}
              </span>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered onClick={stopPropagation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{post.title}</strong> ?</p>
          <p className="text-danger small">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" className="me-1" /> : null}
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔥 CORREGIDO: Modal de compartir con la nueva URL */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered onClick={stopPropagation}>
        <Modal.Header closeButton>
          <Modal.Title>Partager ce produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around py-3">
            <Button 
              variant="success" 
              className="rounded-circle" 
              style={{ width: '50px', height: '50px' }} 
              onClick={(e) => { 
                stopPropagation(e); 
                window.open(`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${shareUrl}`)}`, '_blank'); 
              }}
            >
              <FaWhatsapp size={24} />
            </Button>
            <Button 
              variant="primary" 
              className="rounded-circle" 
              style={{ width: '50px', height: '50px' }} 
              onClick={(e) => { 
                stopPropagation(e); 
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'); 
              }}
            >
              <FaFacebook size={24} />
            </Button>
            <Button 
              variant="info" 
              className="rounded-circle" 
              style={{ width: '50px', height: '50px' }} 
              onClick={(e) => { 
                stopPropagation(e); 
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank'); 
              }}
            >
              <FaTwitter size={24} />
            </Button>
            <Button 
              variant="secondary" 
              className="rounded-circle" 
              style={{ width: '50px', height: '50px' }} 
              onClick={copyLink}
            >
              {copied ? <FaCheck size={24} /> : <FaCopy size={24} />}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style jsx="true">{`
        .boutique-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
        }
        .boutique-product-card:hover img {
          transform: scale(1.05);
        }
        .action-button {
          transition: transform 0.2s ease;
        }
        .action-button:hover {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
};

export default BoutiqueProductCard;