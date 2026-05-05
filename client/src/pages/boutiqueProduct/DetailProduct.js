// 📂 pages/DetailProduct.jsx - VERSIÓN SIMPLIFICADA

import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Badge, Spinner, Alert, Breadcrumb } from 'react-bootstrap';
import { FaStore, FaBoxOpen, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaHourglassHalf } from 'react-icons/fa';
import { getBoutiqueProductById, clearBoutiqueProductDetail } from '../../redux/actions/boutiqueProductAction';
import SameBoutiqueProducts from './SameBoutiqueProducts';
import SimilarProducts from './SimilarProducts';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const DetailProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { currentProduct, loadingProducts } = useSelector(state => state.boutiqueProduct || {});
  const { auth } = useSelector(state => state);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  // Cargar producto
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      dispatch(getBoutiqueProductById(productId))
        .finally(() => setIsLoading(false));
    }
    
    return () => {
      dispatch(clearBoutiqueProductDetail());
    };
  }, [dispatch, productId]);

  const product = currentProduct;
  const isOwner = auth?.user?._id === product?.user?._id;
  const isPending = product?.pendiente === true;
  const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'moderator';
  const canEdit = isOwner || isAdmin;

  // 🔥 AHORA LAS IMÁGENES YA VIENEN NORMALIZADAS COMO STRINGS
  const images = product?.images || [];
  const mainImage = images[selectedImage] || null;

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleGoBack = () => history.goBack();
  
  const handleEdit = () => {
    const boutiqueId = product?.boutique?._id;
    if (boutiqueId) {
      history.push(`/boutique/${boutiqueId}/products/edit/${product._id}`);
    }
  };

  if (isLoading || loadingProducts) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du produit...</p>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>❌ Produit non trouvé</h5>
          <p>Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button variant="primary" onClick={handleGoBack}>Retour</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="detail-product-page">
      <Container className="py-4">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item onClick={() => history.push('/')}>Accueil</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => history.push(`/boutique/${product.boutique?._id}`)}>
            {product.boutique?.nom_boutique || 'Boutique'}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{product.title?.substring(0, 30)}...</Breadcrumb.Item>
        </Breadcrumb>

        {isPending && (
          <Alert variant="warning" className="mb-4 d-flex align-items-center gap-2">
            <FaHourglassHalf /> Ce produit est en attente de validation par un modérateur.
          </Alert>
        )}

        <Row className="g-4">
          {/* COLUMNA DE IMÁGENES - SIMPLIFICADA */}
          <Col lg={6}>
            <div className="main-image-container mb-3">
              {mainImage && !imageErrors[selectedImage] ? (
                <img 
                  src={mainImage} 
                  alt={product.title}
                  style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px' }}
                  onError={() => handleImageError(selectedImage)}
                />
              ) : (
                <div style={{ height: '400px', background: '#f8f9fa', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaBoxOpen size={64} className="text-muted" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="d-flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      cursor: 'pointer',
                      border: selectedImage === idx ? '2px solid #6366F1' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#f5f5f5'
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => handleImageError(idx)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Col>

          {/* Columna de información */}
          <Col lg={6}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h1 className="mb-2" style={{ fontSize: '1.75rem', fontWeight: '700' }}>{product.title}</h1>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Badge style={{ backgroundColor: product.boutique?.couleur_theme || '#6366F1' }} className="px-3 py-2 rounded-pill">
                    <FaStore className="me-1" size={12} /> {product.boutique?.nom_boutique}
                  </Badge>
                  {isPending ? (
                    <Badge bg="warning" className="px-3 py-2 rounded-pill">⏳ En attente</Badge>
                  ) : (
                    <Badge bg="success" className="px-3 py-2 rounded-pill">✓ Vérifié</Badge>
                  )}
                </div>
              </div>
              {canEdit && (
                <Button variant="outline-primary" size="sm" className="rounded-pill" onClick={handleEdit}>
                  ✏️ Modifier
                </Button>
              )}
            </div>

            <div className="mb-4">
              <span className="price" style={{ fontSize: '2rem', fontWeight: '700', color: product.boutique?.couleur_theme || '#6366F1' }}>
                {product.price?.toLocaleString()} DA
              </span>
            </div>

            <div className="d-flex gap-4 mb-4">
              <div className="d-flex align-items-center gap-2 text-muted"><FaEye /> {product.views || 0} vues</div>
              <div className="d-flex align-items-center gap-2 text-muted"><FaCalendarAlt /> {moment(product.createdAt).format('DD/MM/YYYY')}</div>
            </div>

            <div className="mb-4">
              <h5 className="mb-3">Description</h5>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#4b5563', background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {product.description || 'Aucune description fournie.'}
              </div>
            </div>

            {product.categorySpecificData && Object.keys(product.categorySpecificData).length > 0 && (
              <div className="mb-4">
                <h5 className="mb-3">Caractéristiques</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {Object.entries(product.categorySpecificData).map(([key, value]) => (
                    <div key={key} style={{ background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                      <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4 p-3 rounded-3" style={{ background: '#f8fafc' }}>
              <h5 className="mb-3">📍 Localisation & Contact</h5>
              <div className="d-flex flex-column gap-2">
                <div><FaMapMarkerAlt className="text-danger me-2" />{product.wilaya}{product.commune && `, ${product.commune}`}</div>
                {product.address && <div>📭 {product.address}</div>}
                <div><FaPhone className="text-primary me-2" /><a href={`tel:${product.phone}`} className="text-decoration-none">{product.phone}</a></div>
                {product.email && <div><FaEnvelope className="text-danger me-2" /><a href={`mailto:${product.email}`} className="text-decoration-none">{product.email}</a></div>}
              </div>
            </div>

            <div className="d-flex gap-3">
              <Button variant="primary" size="lg" className="rounded-pill px-4" onClick={() => window.location.href = `tel:${product.phone}`}>
                <FaPhone className="me-2" /> Contacter
              </Button>
              <Button variant="outline-secondary" size="lg" className="rounded-pill px-4" onClick={handleGoBack}>
                Retour
              </Button>
            </div>
          </Col>
        </Row>

        <SameBoutiqueProducts productId={productId} />
        <SimilarProducts productId={productId} />
      </Container>
    </div>
  );
};

export default DetailProduct;