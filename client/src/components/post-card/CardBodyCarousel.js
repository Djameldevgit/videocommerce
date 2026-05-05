// 📂 frontend/src/components/CardBodyCarousel.jsx
import React, { useState, useEffect } from 'react';
import { Carousel, Spinner, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Heart, HeartFill, Bookmark, BookmarkFill, Eye } from 'react-bootstrap-icons';
import { likePost, unLikePost, savePost, unSavePost } from '../../redux/actions/postAction';

const CardBodyCarousel = ({ post, customHeight }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const images = post?.images || [];

  const { auth } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estados de like y saved
  useEffect(() => {
    if (auth.user && post?.likes?.find(like => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post?.likes, auth.user]);

  useEffect(() => {
    if (auth.user && auth.user.saved?.includes(post?._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post?._id]);

  // Simular carga de imágenes
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!auth.token) return setShowModal(true);
    if (loadLike) return;

    setLoadLike(true);
    if (isLike) {
      await dispatch(unLikePost({ post, auth }));
    } else {
      await dispatch(likePost({ post, auth }));
    }
    setLoadLike(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!auth.token) return setShowModal(true);
    if (saveLoad) return;

    setSaveLoad(true);
    if (saved) {
      await dispatch(unSavePost({ post, auth }));
    } else {
      await dispatch(savePost({ post, auth }));
    }
    setSaveLoad(false);
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Altura de la imagen: customHeight si se proporciona, si no, valores responsive
  const getImageHeight = () => {
    if (customHeight) return customHeight;
    return isMobile ? '180px' : '220px';
  };

  const imageHeight = getImageHeight();

  // Tamaño de iconos según móvil
  const iconSize = isMobile ? 14 : 16;
  const buttonSize = isMobile ? 30 : 32;

  // Contenedor de imagen
  const ImageContainer = ({ src, alt }) => (
    <div 
      style={{
        width: '100%',
        height: imageHeight,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
        }}
      />
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Carrusel de imágenes */}
      <div onClick={() => history.push(`/post/${post._id}`)} style={{ cursor: 'pointer' }}>
        {loading ? (
          <div style={{ ...styles.loaderContainer, height: imageHeight }}>
            <Spinner animation="border" variant="secondary" size="sm" />
          </div>
        ) : images.length > 0 ? (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={images.length > 1}
            interval={null}
            controls={images.length > 1}
            touch={true}
            prevIcon={<span className="carousel-control-prev-icon" />}
            nextIcon={<span className="carousel-control-next-icon" />}
            style={styles.carousel}
          >
            {images.map((img, idx) => (
              <Carousel.Item key={idx}>
                <ImageContainer 
                  src={img.url || img} 
                  alt={`${post.title} - ${idx + 1}`}
                />
                
                {images.length > 1 && (
                  <div style={styles.imageCounter}>
                    {idx + 1}/{images.length}
                  </div>
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div style={{ ...styles.noImageContainer, height: imageHeight }}>
            Aucune image
          </div>
        )}
      </div>

      {/* Botón de guardado */}
      <button
        onClick={handleSave}
        disabled={saveLoad}
        style={{
          ...styles.actionButton,
          ...styles.saveButton,
          width: buttonSize,
          height: buttonSize,
          backgroundColor: saved ? '#ffc107' : '#ffffff'
        }}
      >
        {saveLoad ? (
          <Spinner size="sm" />
        ) : saved ? (
          <BookmarkFill size={iconSize} color="#ffffff" />
        ) : (
          <Bookmark size={iconSize} color="#6b7280" />
        )}
      </button>

     {/* Contador de views */}
{post?.views > 0 && (
  <div style={styles.viewCounter}>
    <Eye size={10} color="#ffffff" />
    <span>{post.views}</span>
  </div>
)}
      <button
        onClick={handleLike}
        disabled={loadLike}
        style={{
          ...styles.actionButton,
          ...styles.likeButton,
          width: buttonSize,
          height: buttonSize,
          backgroundColor: isLike ? '#dc2626' : '#ffffff'
        }}
      >
        {loadLike ? (
          <Spinner size="sm" />
        ) : isLike ? (
          <HeartFill size={iconSize} color="#ffffff" />
        ) : (
          <Heart size={iconSize} color="#6b7280" />
        )}
      </button>

      {/* Contador de likes */}
      {post?.likes?.length > 0 && (
        <div style={styles.likeCounter}>
          <HeartFill size={10} color="#dc2626" />
          <span>{post.likes.length}</span>
        </div>
      )}

      {/* Modal de autenticación (en francés) */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title style={styles.modalTitle}>
            <Heart size={18} color="#dc2626" />
            <span>Authentification requise</span>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <p style={styles.modalText}>
            Vous devez vous connecter ou vous inscrire pour aimer ou sauvegarder une annonce.
          </p>
          
          <div style={styles.modalButtons}>
            <Button
              variant="primary"
              size="sm"
              style={styles.modalButton}
              onClick={() => history.push("/login")}
            >
              Se connecter
            </Button>
            
            <Button
              variant="success"
              size="sm"
              style={styles.modalButton}
              onClick={() => history.push("/register")}
            >
              S'inscrire
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style>{styles.globalStyles}</style>
    </div>
  );
};

// Estilos en objeto
const styles = {
  container: {
    position: 'relative',
    width: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#ffffff'
  },
  carousel: {
    borderRadius: 0,
    overflow: 'hidden',
    width: '100%'
  },
  loaderContainer: {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noImageContainer: {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '14px'
  },
  actionButton: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 15,
    padding: 0,
    boxShadow: 'none'
  },
  saveButton: {
    top: '8px',
    right: '8px'
  },
  viewCounter: {
    position: 'absolute',
    top: '45px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 15
  },



  likeButton: {
    top: '8px',
    left: '8px'
  },
  imageCounter: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    zIndex: 10
  },
  likeCounter: {
    position: 'absolute',
    bottom: '8px',
    left: '8px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    zIndex: 15
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem'
  },
  modalText: {
    color: '#6b7280',
    marginBottom: '12px',
    fontSize: '0.9rem'
  },
  modalButtons: {
    display: 'flex',
    gap: '8px'
  },
  modalButton: {
    flex: 1
  },
  globalStyles: `
    .carousel-control-prev,
    .carousel-control-next {
      width: 10%;
      background: rgba(0,0,0,0.1);
      border: none;
    }
    
    .carousel-indicators {
      margin-bottom: 4px;
    }
    
    .carousel-indicators button {
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background-color: rgba(255,255,255,0.7);
      border: none;
      margin: 0 2px;
    }
    
    .carousel-indicators button.active {
      background-color: #ffffff;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .carousel-control-prev,
      .carousel-control-next {
        display: none;
      }
    }
  `
};

export default React.memo(CardBodyCarousel);