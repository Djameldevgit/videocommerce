// 📂 components/boutique/BoutiqueProductCard2.jsx - COMPONENTE INDEPENDIENTE

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

const BoutiqueProductCard2 = ({ product, boutique }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  
  // Estados
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const menuRef = useRef(null);

  // 🔥 PERMISOS
  const currentUserId = auth?.user?._id;
  const isBoutiqueOwner = currentUserId === boutique?.user?._id;
  const isProductCreator = currentUserId === product?.user?._id;
  const isAdmin = auth?.user?.role === 'admin';
  const canEdit = isBoutiqueOwner || isProductCreator || isAdmin;

  const mainColor = boutique?.couleur_theme || '#6366F1';
  const isActive = product?.isActive !== false;

  // 🔥 FUNCIÓN PARA OBTENER LA URL CORRECTA DE LA IMAGEN
  const getImageUrl = () => {
    if (!product?.images || product.images.length === 0) return null;
    
    const firstImage = product.images[currentImageIndex];
    if (!firstImage) return null;
    
    // Si es string
    if (typeof firstImage === 'string') return firstImage;
    
    // Si es objeto con url
    if (typeof firstImage === 'object' && firstImage.url) return firstImage.url;
    
    return null;
  };

  const imageUrl = getImageUrl();
  const hasMultipleImages = product?.images?.length > 1;

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

  // 🔥 NAVEGAR AL DETALLE DEL PRODUCTO (NO POST)
  const handleCardClick = (e) => {
    if (showMenu) return;
    if (e.target.closest('button') || e.target.closest('.menu-button')) {
      return;
    }
    history.push(`/product/${product._id}`);
  };

  // 🔥 EDITAR PRODUCTO
  const handleEdit = (e) => {
    stopPropagation(e);
    setShowMenu(false);
    history.push(`/boutique/${boutique?._id}/products/edit/${product._id}`);
  };

  // 🔥 ELIMINAR PRODUCTO
  const handleDelete = async (e) => {
    stopPropagation(e);
    setShowMenu(false);
    setIsDeleting(true);
    
    if (!auth?.token) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Veuillez vous reconnecter' } });
      setIsDeleting(false);
      return;
    }
    
    try {
      await dispatch(deleteBoutiqueProduct({ 
        boutiqueId: boutique?._id, 
        productId: product._id, 
        auth 
      }));
      setShowDeleteModal(false);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: '✅ Produit supprimé!' } });
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Erreur lors de la suppression' } });
    } finally {
      setIsDeleting(false);
    }
  };

  // 🔥 ACTIVAR/DESACTIVAR PRODUCTO
  const handleToggleActive = async (e) => {
    stopPropagation(e);
    setShowMenu(false);
    
    try {
      await dispatch(updateBoutiqueProduct({ 
        boutiqueId: boutique?._id, 
        productId: product._id,
        productData: { isActive: !product.isActive },
        auth 
      }));
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: product.isActive ? '📦 Produit désactivé' : '📦 Produit activé' } });
    } catch (error) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Erreur' } });
    }
  };

  // 🔥 COMPARTIR
  const handleShare = (e) => {
    stopPropagation(e);
    setShowShareModal(true);
  };

  const copyLink = async (e) => {
    stopPropagation(e);
    const url = `${window.location.origin}/product/${product._id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Lien copié!' } });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = `${window.location.origin}/product/${product._id}`;

  // 🔥 NAVEGAR ENTRE IMÁGENES
  const nextImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
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
      stars.push(
        i <= roundedScore ? 
          <FaStar key={i} size={10} className="text-warning" /> : 
          <FaRegStar key={i} size={10} className="text-secondary" />
      );
    }
    return stars;
  };

  const scoreStars = getScoreStars(product.score);
  const renderTooltip = (text) => <Tooltip id="button-tooltip">{text}</Tooltip>;

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
        {/* SECCIÓN DE IMAGEN */}
        <div className="position-relative" style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          {imageUrl && !imageError ? (
            <>
              <img 
                src={imageUrl}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onError={() => setImageError(true)}
              />
              
              {/* Botones de navegación de imágenes */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      zIndex: 5
                    }}
                  >
                    ›
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 5
                  }}>
                    {product.images.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(idx);
                        }}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: currentImageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
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

          {/* Badge de estado del producto */}
          <Badge 
            className="position-absolute top-0 start-0 m-2"
            style={{
              backgroundColor: getEtatColor(product.etat),
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              fontWeight: '500',
              zIndex: 2
            }}
          >
            {getEtatLabel(product.etat)}
          </Badge>

          {/* Badge de precio */}
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
            {formatPrice(product.price)}
          </Badge>

          {/* Stars de score */}
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
            <div ref={menuRef} className="position-absolute top-0 end-0 m-2" style={{ zIndex: 100 }}>
              <button
                className="menu-button"
                onClick={(e) => { stopPropagation(e); setShowMenu(!showMenu); }}
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
                <div style={{
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
                }}>
                  <div onClick={handleEdit} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaEdit size={14} color="#007bff" /> <span>Modifier</span>
                  </div>
                  <div onClick={handleToggleActive} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaArchive size={14} color="#ffc107" /> <span>{isActive ? 'Désactiver' : 'Activer'}</span>
                  </div>
                  <div onClick={() => setShowDeleteModal(true)} style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc3545' }}>
                    <FaTrash size={14} /> <span>Supprimer</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Overlay con botones de compartir */}
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
            <OverlayTrigger placement="top" overlay={renderTooltip('Partager')}>
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle action-button"
                onClick={handleShare}
                style={{ width: '36px', height: '36px', borderRadius: '50%', pointerEvents: 'auto' }}
              >
                <FaShare />
              </Button>
            </OverlayTrigger>
          </div>
        </div>

        {/* CUERPO DE LA TARJETA */}
        <Card.Body className="d-flex flex-column p-3">
          <h6 className="fw-bold mb-2" style={{ fontSize: '1rem', lineHeight: '1.3' }}>
            {product.title}
          </h6>

          {product.description && (
            <p className="text-muted small mb-2" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
            </p>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <div className="d-flex align-items-center text-muted small">
              <FaEye size={12} className="me-1" />
              <span>{product.views || 0}</span>
            </div>
            <div className="d-flex align-items-center text-muted small">
              <FaClock size={12} className="me-1" />
              <span>{new Date(product.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
            </div>
          </div>

          {product.wilaya && (
            <div className="d-flex align-items-center text-muted small mt-2">
              <FaMapMarkerAlt size={10} className="me-1 text-danger" />
              <span>{product.wilaya}{product.commune ? `, ${product.commune}` : ''}</span>
            </div>
          )}

          {(product.categorie || product.subCategory) && (
            <div className="mt-2">
              <span style={{
                backgroundColor: `${mainColor}15`,
                color: mainColor,
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '500',
                display: 'inline-block'
              }}>
                <FaTag size={10} className="me-1" />
                {product.categorie}
                {product.subCategory && ` / ${product.subCategory}`}
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
          <p>Êtes-vous sûr de vouloir supprimer le produit <strong>{product.title}</strong> ?</p>
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

      {/* Modal de compartir */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered onClick={stopPropagation}>
        <Modal.Header closeButton>
          <Modal.Title>Partager ce produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-around py-3">
            <Button variant="success" className="rounded-circle" style={{ width: '50px', height: '50px' }} onClick={(e) => { stopPropagation(e); window.open(`https://wa.me/?text=${encodeURIComponent(`${product.title} - ${shareUrl}`)}`, '_blank'); }}>
              <FaWhatsapp size={24} />
            </Button>
            <Button variant="primary" className="rounded-circle" style={{ width: '50px', height: '50px' }} onClick={(e) => { stopPropagation(e); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank'); }}>
              <FaFacebook size={24} />
            </Button>
            <Button variant="info" className="rounded-circle" style={{ width: '50px', height: '50px' }} onClick={(e) => { stopPropagation(e); window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(product.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank'); }}>
              <FaTwitter size={24} />
            </Button>
            <Button variant="secondary" className="rounded-circle" style={{ width: '50px', height: '50px' }} onClick={copyLink}>
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

export default BoutiqueProductCard2;