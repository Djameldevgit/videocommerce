// src/pages/boutique/CreateBoutiqueProductPage.jsx - VERSIÓN MEJORADA

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Badge, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStore, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit, 
  FaCheckCircle, FaBox, FaTag, FaImage, FaInfoCircle, FaTruck, 
  FaClipboardList, FaCreditCard, FaStar, FaStarHalfAlt
} from 'react-icons/fa';

import { getBoutique } from '../../redux/actions/boutiqueAction';
import { createBoutiqueProduct, updateBoutiqueProduct } from '../../redux/actions/boutiqueProductAction';
import { getCategoryTree } from '../../redux/actions/categoryAction';

import BoutiqueCategoryDisplay from '../../components/boutique/BoutiqueCategoryDisplay';
import ImagesStep from './ImagesStep';

// Wilayas de Argelia
const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane'
];

// Estados del producto
const ETAT_OPTIONS = [
  { value: 'neuf', label: 'Neuf', icon: '✨', color: '#10b981', description: 'Jamais utilisé, parfait état' },
  { value: 'comme-neuf', label: 'Comme neuf', icon: '🌟', color: '#3b82f6', description: 'Très peu utilisé, impeccable' },
  { value: 'bon-etat', label: 'Bon état', icon: '👍', color: '#f59e0b', description: 'Usure normale, fonctionne parfaitement' },
  { value: 'correct', label: 'Correct', icon: '🆗', color: '#6b7280', description: 'Signes d\'usage, fonctionnel' }
];

const CreateBoutiqueProductPage = () => {
  const { boutiqueId, productId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const auth = useSelector(state => state.auth);
  const { currentBoutique, loading } = useSelector(state => state.boutique || {});
  const { categoryTree, loading: categoryLoading } = useSelector(state => state.category || {});

  const isEdit = location.state?.isEdit === true || !!productId;
  const productToEdit = location.state?.productData || location.state?.postData || null;

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    etat: 'neuf',
    stock: 1,
    wilaya: '',
    commune: '',
    address: '',
    phone: '',
    email: '',
    categorie: '',
    subCategory: '',
    articleType: ''
  });
  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [dynamicFields, setDynamicFields] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);
  const [formProgress, setFormProgress] = useState(0);

  // Calcular progreso del formulario
  useEffect(() => {
    let progress = 0;
    if (formData.categorie && formData.subCategory) progress += 20;
    if (formData.title && formData.description) progress += 20;
    if (formData.price) progress += 10;
    if (formData.etat) progress += 10;
    if (formData.wilaya && formData.commune && formData.phone) progress += 20;
    if (images.length > 0) progress += 20;
    setFormProgress(progress);
  }, [formData, images]);

  // Cargar datos
  useEffect(() => {
    if (boutiqueId) {
      dispatch(getBoutique(boutiqueId));
    }
    dispatch(getCategoryTree());
  }, [dispatch, boutiqueId]);

  // Cargar datos del producto en modo edición
  useEffect(() => {
    if (isEdit && productToEdit) {
      setFormData({
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        etat: productToEdit.etat || 'neuf',
        stock: productToEdit.stock || 1,
        wilaya: productToEdit.wilaya || '',
        commune: productToEdit.commune || '',
        address: productToEdit.address || '',
        phone: productToEdit.phone || '',
        email: productToEdit.email || '',
        categorie: productToEdit.categorie || '',
        subCategory: productToEdit.subCategory || '',
        articleType: productToEdit.articleType || ''
      });

      setSpecificData(productToEdit.categorySpecificData || {});

      if (productToEdit.images && productToEdit.images.length > 0) {
        const existingImages = productToEdit.images.map((img, index) => ({
          url: img.url || img,
          public_id: img.public_id || `existing_${index}`,
          isExisting: true
        }));
        setImages(existingImages);
      }

      setCurrentStep(2);
    }
  }, [isEdit, productToEdit]);

  // Precargar datos de la boutique
  useEffect(() => {
    if (currentBoutique && !isEdit && !formData.categorie) {
      setFormData(prev => ({
        ...prev,
        categorie: currentBoutique.categorie || '',
        subCategory: currentBoutique.subCategory || '',
        articleType: currentBoutique.articleType || '',
        wilaya: currentBoutique.proprietaire?.wilaya || '',
        commune: currentBoutique.proprietaire?.commune || '',
        address: currentBoutique.proprietaire?.adresse || '',
        phone: currentBoutique.proprietaire?.telephone || '',
        email: currentBoutique.proprietaire?.email || ''
      }));
    }
  }, [currentBoutique, isEdit]);

  // Cargar campos dinámicos
  const loadDynamicFieldsForArticle = useCallback((articleSlug) => {
    if (!categoryTree || categoryTree.length === 0) return [];

    const findArticleFields = (categories) => {
      for (let cat of categories) {
        if (cat.children) {
          for (let sub of cat.children) {
            if (sub.children) {
              for (let article of sub.children) {
                if (article.slug === articleSlug || article.name === articleSlug) {
                  return article.fields || [];
                }
              }
            }
          }
        }
      }
      return [];
    };

    return findArticleFields(categoryTree);
  }, [categoryTree]);

  useEffect(() => {
    if (formData.articleType) {
      const fields = loadDynamicFieldsForArticle(formData.articleType);
      setDynamicFields(fields);
    }
  }, [formData.articleType, loadDynamicFieldsForArticle]);

  // Obtener tipos de artículo
  useEffect(() => {
    if (formData.subCategory && categoryTree) {
      const findArticleTypes = () => {
        for (let cat of categoryTree) {
          if (cat.children) {
            for (let sub of cat.children) {
              if (sub.slug === formData.subCategory || sub.name === formData.subCategory) {
                return sub.children?.map(child => ({
                  value: child.slug,
                  label: child.name,
                  icon: child.icon
                })) || [];
              }
            }
          }
        }
        return [];
      };
      
      setArticleTypes(findArticleTypes());
    }
  }, [formData.subCategory, categoryTree]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecificFieldChange = (e) => {
    const { name, value } = e.target;
    setSpecificData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    window.scrollTo(0, 0);
  };

  const showAlert = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), 4000);
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.categorie) { showAlert("Veuillez sélectionner une catégorie", "warning"); return false; }
        if (!formData.subCategory) { showAlert("Veuillez sélectionner une sous-catégorie", "warning"); return false; }
        return true;
      case 2:
        if (!formData.title?.trim()) { showAlert("Veuillez entrer un titre", "warning"); return false; }
        if (!formData.description?.trim()) { showAlert("Veuillez entrer une description", "warning"); return false; }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.wilaya) { showAlert("Veuillez sélectionner une wilaya", "warning"); return false; }
        if (!formData.commune?.trim()) { showAlert("Veuillez entrer une commune", "warning"); return false; }
        if (!formData.phone?.trim()) { showAlert("Veuillez entrer un numéro de téléphone", "warning"); return false; }
        return true;
      case 5:
        if (images.length === 0) { showAlert("Veuillez ajouter au moins une image", "warning"); return false; }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    if (!auth?.token) {
      showAlert('Veuillez vous reconnecter', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      const productContent = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 1,
        categorySpecificData: specificData
      };

      if (isEdit && productId) {
        await dispatch(updateBoutiqueProduct({
          boutiqueId, productId, productData: productContent, images, auth, socket // ✅ Añadir socket
        }));
      } else {
        await dispatch(createBoutiqueProduct({
          boutiqueId, productData: productContent, images, auth, socket // ✅ Añadir socket
        }));
      }
      
      setTimeout(() => history.push(`/boutique/${boutiqueId}`), 1500);

    } catch (err) {
      showAlert(err.response?.data?.message || err.message || "Erreur lors de l'opération", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizado de steps con diseño mejorado
  const renderStepIndicator = () => (
    <div className="step-indicator mb-5">
      <div className="d-flex justify-content-between">
        {[
          { step: 1, label: 'Catégorie', icon: <FaTag /> },
          { step: 2, label: 'Détails', icon: <FaClipboardList /> },
          { step: 3, label: 'Caractéristiques', icon: <FaInfoCircle /> },
          { step: 4, label: 'Localisation', icon: <FaMapMarkerAlt /> },
          { step: 5, label: 'Photos', icon: <FaImage /> }
        ].map((item) => (
          <div 
            key={item.step}
            className={`step-item text-center ${currentStep >= item.step ? 'active' : ''} ${currentStep > item.step ? 'completed' : ''}`}
            onClick={() => currentStep > item.step && handleStepChange(item.step)}
            style={{ cursor: currentStep > item.step ? 'pointer' : 'default' }}
          >
            <div className="step-circle mx-auto mb-2">
              {currentStep > item.step ? <FaCheckCircle /> : item.icon}
            </div>
            <div className="step-label small">{item.label}</div>
          </div>
        ))}
      </div>
      <ProgressBar now={formProgress} className="mt-3" style={{ height: '6px', borderRadius: '3px' }} />
    </div>
  );

  const renderStep1Category = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-4">
        <h5 className="fw-bold">Choisissez la catégorie de votre produit</h5>
        <p className="text-muted small">La catégorie détermine où votre produit sera affiché</p>
      </div>
      
      <BoutiqueCategoryDisplay 
        categoryData={{
          categorie: formData.categorie,
          subCategory: formData.subCategory,
          articleType: formData.articleType
        }}
        boutiqueInfo={currentBoutique}
      />

      {articleTypes.length > 0 && (
        <Form.Group className="mt-4">
          <Form.Label className="fw-bold">
            <FaStar className="me-2 text-warning" />
            Type d'article
          </Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {articleTypes.map(type => (
              <Button
                key={type.value}
                variant={formData.articleType === type.value ? "primary" : "outline-secondary"}
                className="rounded-pill px-4"
                onClick={() => setFormData(prev => ({ ...prev, articleType: type.value }))}
              >
                {type.icon && <span className="me-1">{type.icon}</span>}
                {type.label}
              </Button>
            ))}
          </div>
        </Form.Group>
      )}
    </motion.div>
  );

  const renderStep2Details = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-4">
        <h5 className="fw-bold">Détails du produit</h5>
        <p className="text-muted small">Décrivez votre produit de manière précise</p>
      </div>
      
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">
          <FaBox className="me-2 text-primary" />
          Titre du produit *
        </Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Ex: iPhone 14 Pro Max 256GB"
          className="py-2"
        />
        <Form.Text className="text-muted">Un titre clair attire plus d'acheteurs</Form.Text>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">Description *</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Décrivez votre produit en détail : caractéristiques, état, accessoires inclus..."
          className="py-2"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaCreditCard className="me-2 text-success" />
              Prix (DA)
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0"
              className="py-2"
            />
            <Form.Text className="text-muted">Prix en Dinar Algérien</Form.Text>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaTruck className="me-2 text-info" />
              Stock
            </Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              className="py-2"
            />
            <Form.Text className="text-muted">Quantité disponible</Form.Text>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label className="fw-bold">État du produit</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          {ETAT_OPTIONS.map(option => (
            <div
              key={option.value}
              className={`etat-card p-3 rounded-3 flex-grow-1 ${formData.etat === option.value ? 'selected' : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, etat: option.value }))}
              style={{
                border: formData.etat === option.value ? `2px solid ${option.color}` : '1px solid #e9ecef',
                backgroundColor: formData.etat === option.value ? `${option.color}10` : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{option.icon}</span>
                <div>
                  <div className="fw-bold" style={{ color: option.color }}>{option.label}</div>
                  <small className="text-muted">{option.description}</small>
                </div>
                {formData.etat === option.value && (
                  <FaCheckCircle className="ms-auto" style={{ color: option.color }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </Form.Group>
    </motion.div>
  );

  const renderStep3Specific = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-4">
        <h5 className="fw-bold">Caractéristiques spécifiques</h5>
        <p className="text-muted small">Informations supplémentaires selon la catégorie</p>
      </div>
      
      {dynamicFields.length > 0 ? (
        dynamicFields.map((field, index) => (
          <Form.Group key={index} className="mb-4">
            <Form.Label className="fw-bold">{field.label}</Form.Label>
            {field.type === 'select' ? (
              <Form.Select
                name={field.name}
                value={specificData[field.name] || ''}
                onChange={handleSpecificFieldChange}
                className="py-2"
              >
                <option value="">Sélectionnez...</option>
                {field.options?.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </Form.Select>
            ) : field.type === 'textarea' ? (
              <Form.Control
                as="textarea"
                rows={3}
                name={field.name}
                value={specificData[field.name] || ''}
                onChange={handleSpecificFieldChange}
                placeholder={field.placeholder || ''}
              />
            ) : (
              <Form.Control
                type={field.type || 'text'}
                name={field.name}
                value={specificData[field.name] || ''}
                onChange={handleSpecificFieldChange}
                placeholder={field.placeholder || ''}
              />
            )}
            {field.description && (
              <Form.Text className="text-muted">{field.description}</Form.Text>
            )}
          </Form.Group>
        ))
      ) : (
        <div className="text-center py-5 text-muted">
          <FaInfoCircle size={40} className="mb-3 opacity-50" />
          <p>Aucune caractéristique spécifique pour cette catégorie</p>
          <small>Vous pouvez passer à l'étape suivante</small>
        </div>
      )}
    </motion.div>
  );

  const renderStep4Location = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <div className="text-center mb-4">
        <h5 className="fw-bold">Localisation et contact</h5>
        <p className="text-muted small">Où se trouve votre produit ? Comment vous contacter ?</p>
      </div>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaMapMarkerAlt className="me-2 text-danger" />
              Wilaya *
            </Form.Label>
            <Form.Select
              name="wilaya"
              value={formData.wilaya}
              onChange={handleInputChange}
              className="py-2"
            >
              <option value="">Sélectionnez une wilaya</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Commune *</Form.Label>
            <Form.Control
              type="text"
              name="commune"
              value={formData.commune}
              onChange={handleInputChange}
              placeholder="Ex: Alger-Centre"
              className="py-2"
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Adresse complète</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Rue, numéro, bâtiment..."
          className="py-2"
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaPhone className="me-2 text-primary" />
              Téléphone *
            </Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="05 XX XX XX XX"
              className="py-2"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              <FaEnvelope className="me-2 text-danger" />
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contact@example.com"
              className="py-2"
            />
          </Form.Group>
        </Col>
      </Row>
    </motion.div>
  );

  const renderStep5Images = () => (
    <ImagesStep
      images={images}
      setImages={setImages}
      onComplete={handleSubmit}
      onBack={() => handleStepChange(4)}
      isEdit={isEdit}
      isSubmitting={isSubmitting}
    />
  );

  if (loading || categoryLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement...</p>
      </Container>
    );
  }

  if (!currentBoutique && !loading) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Boutique non trouvée</Alert.Heading>
          <p>La boutique que vous recherchez n'existe pas.</p>
          <Button variant="danger" onClick={() => history.goBack()}>Retour</Button>
        </Alert>
      </Container>
    );
  }

  const stepContent = {
    1: renderStep1Category(),
    2: renderStep2Details(),
    3: renderStep3Specific(),
    4: renderStep4Location(),
    5: renderStep5Images()
  };

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Button variant="link" className="p-0 me-3 text-dark" onClick={() => history.goBack()}>
            <FaArrowLeft size={20} />
          </Button>
          <div>
            <h4 className="mb-1 fw-bold">
              {isEdit ? (
                <><FaEdit className="me-2 text-primary" />Modifier le produit</>
              ) : (
                <>Ajouter un produit</>
              )}
            </h4>
            <div className="d-flex align-items-center text-muted small">
              <FaStore className="me-1" />
              <span>{currentBoutique?.nom_boutique || 'Boutique'}</span>
              <Badge bg="secondary" className="ms-2">
                {currentBoutique?.plan === 'gratuit' ? 'Plan Gratuit' : 'Plan Premium'}
              </Badge>
            </div>
          </div>
        </div>
        {formProgress === 100 && (
          <Badge bg="success" className="p-2">
            <FaCheckCircle className="me-1" /> Formulaire complet
          </Badge>
        )}
      </div>

      {/* Alertas */}
      <AnimatePresence>
        {alert.show && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({...alert, show: false})}>
              {alert.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de pasos */}
      {renderStepIndicator()}

      {/* Contenido del paso */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <AnimatePresence mode="wait">
            {stepContent[currentStep]}
          </AnimatePresence>
        </Card.Body>
      </Card>

      {/* Botones de navegación */}
      <div className="mt-4">
        <Row>
          <Col xs={6}>
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={() => handleStepChange(currentStep - 1)} 
              disabled={currentStep === 1 || isSubmitting} 
              className="w-100 py-3 rounded-pill"
            >
              ← Retour
            </Button>
          </Col>
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => handleStepChange(currentStep + 1)} 
                className="w-100 py-3 rounded-pill"
              >
                Suivant →
              </Button>
            ) : (
              <Button 
                variant={isEdit ? "warning" : "success"} 
                size="lg" 
                onClick={handleSubmit} 
                disabled={isSubmitting || images.length === 0} 
                className="w-100 py-3 rounded-pill"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {isEdit ? 'Mise à jour...' : 'Publication...'}
                  </>
                ) : (
                  <>{isEdit ? 'Mettre à jour' : 'Publier dans la boutique'} <FaCheckCircle className="ms-2" /></>
                )}
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {/* Estilos CSS */}
      <style jsx="true">{`
        .step-item {
          flex: 1;
        }
        .step-circle {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .step-item.active .step-circle {
          border-color: #6366F1;
          background: #6366F1;
          color: white;
        }
        .step-item.completed .step-circle {
          border-color: #10b981;
          background: #10b981;
          color: white;
        }
        .step-label {
          color: #6c757d;
          font-size: 0.75rem;
        }
        .step-item.active .step-label {
          color: #6366F1;
          font-weight: 600;
        }
        .step-item.completed .step-label {
          color: #10b981;
        }
        .etat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .etat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
    </Container>
  );
};

export default CreateBoutiqueProductPage;