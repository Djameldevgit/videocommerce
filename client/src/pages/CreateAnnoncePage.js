// 📂 pages/CreateAnnoncePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost } from '../redux/actions/postAction';
import { getCategoriesForAccordion } from '../redux/actions/categoryAction';
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';
import { generateTitle, getTitlePreview } from '../components/CATEGORIES/GeneracionTitulo';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const CreateAnnoncePage = () => {
  // ============ HOOKS ============
  const { auth, category: categoryState, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { id: postId } = useParams();
  const isRTL = i18n.language === 'ar';
  const isEdit = location.state?.isEdit || !!postId;
  const postToEdit = location.state?.postData || null;

  // ============ ESTADOS ============
  const autoAdvanceTimeout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Estados de datos separados por tipo
  const [categoryData, setCategoryData] = useState({
    categorie: '',
    articleType: '',
    subCategory: ''
  });

  const [specificData, setSpecificData] = useState({});
  const [commonData, setCommonData] = useState({});
  const [images, setImages] = useState([]);

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [isLoadingEditData, setIsLoadingEditData] = useState(true);
  const [hasManuallyGoneBack, setHasManuallyGoneBack] = useState(false);
  const [editDataLoaded, setEditDataLoaded] = useState(false);

  // Estado para el título generado (para mostrar preview)
  const [generatedTitle, setGeneratedTitle] = useState('');

  // ============ EFECTOS ============

  // 📥 Cargar categorías para el accordion
  useEffect(() => {
    if (categoryState.accordionCategories?.length === 0 && !categoryState.accordionLoading) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, categoryState.accordionCategories, categoryState.accordionLoading]);

  // 🎯 Actualizar título generado cuando cambian los datos
  useEffect(() => {
    if (categoryData.categorie) {
      const newTitle = generateTitle(categoryData, specificData, commonData);
      setGeneratedTitle(newTitle);
    }
  }, [categoryData, specificData, commonData]);

  // 📥 Cargar datos de edición
  useEffect(() => {
    const loadEditData = async () => {
      if (!isEdit) {
        setIsLoadingEditData(false);
        return;
      }

      setIsLoadingEditData(true);

      try {
        let postDataToLoad = postToEdit;

        if (postId) {
          const res = await axios.get(`${BASE_URL}/api/posts/${postId}`);
          postDataToLoad = res.data.post;
        }

        if (postDataToLoad) {
          console.log('📦 postDataToLoad original:', {
            categorie: postDataToLoad.categorie,
            subCategory: postDataToLoad.subCategory,
            articleType: postDataToLoad.articleType
          });

          // Reconstruir slugs correctos si están mal guardados
          let loadedCategoryData = {
            categorie: postDataToLoad.categorie || '',
            subCategory: postDataToLoad.subCategory || '',
            articleType: postDataToLoad.articleType || ''
          };

          if (loadedCategoryData.subCategory && !loadedCategoryData.articleType) {
            const categories = categoryState.accordionCategories || [];
            const mainCat = categories.find(c =>
              c.slug === loadedCategoryData.categorie || c.name === loadedCategoryData.categorie
            );
            if (mainCat) {
              for (const level1 of mainCat.children || []) {
                const level2 = level1.children?.find(ch =>
                  ch.slug === loadedCategoryData.subCategory || ch.name === loadedCategoryData.subCategory
                );
                if (level2) {
                  loadedCategoryData = {
                    categorie: mainCat.slug,
                    subCategory: level1.slug,
                    articleType: level2.slug
                  };
                  break;
                }
              }
            }
          }

          // Cargar datos comunes
          const excludeFromCommon = [
            'categorie', 'subCategory', 'articleType', 'images', '_id',
            'createdAt', 'updatedAt', 'user', 'categorySpecificData',
            '__v', 'likes', 'comments', 'views'
          ];

          const loadedCommonData = {};
          Object.entries(postDataToLoad).forEach(([key, value]) => {
            if (!excludeFromCommon.includes(key) && value !== undefined && value !== null && value !== '') {
              loadedCommonData[key] = value;
            }
          });

          // Cargar datos específicos
          const loadedSpecificData = postDataToLoad.categorySpecificData || {};

          // Cargar imágenes
          const loadedImages = [];
          if (postDataToLoad.images && Array.isArray(postDataToLoad.images)) {
            postDataToLoad.images.forEach((img, index) => {
              if (typeof img === 'string') {
                loadedImages.push({ url: img, public_id: `existing_${index}`, isExisting: true });
              } else if (img && img.url) {
                loadedImages.push({ url: img.url, public_id: img.public_id || `existing_${index}`, isExisting: true });
              }
            });
          }

          // Actualizar estados
          setCategoryData(loadedCategoryData);
          setCommonData(loadedCommonData);
          setSpecificData(loadedSpecificData);
          setImages(loadedImages);
          setEditDataLoaded(true);

          setAlert({ show: true, message: "📝 Mode édition activé", variant: "info" });

        } else {
          setAlert({ show: true, message: "⚠️ Impossible de charger les données", variant: "warning" });
        }
      } catch (error) {
        console.error('❌ Error loading edit data:', error);
        setAlert({ show: true, message: `❌ Erreur: ${error.message}`, variant: "danger" });
      } finally {
        setIsLoadingEditData(false);
      }
    };

    loadEditData();
  }, [isEdit, postId, postToEdit, categoryState.accordionCategories]);

  // ⚡ Auto-avance SOLO para creación, NO para edición
  useEffect(() => {
    if (isEdit) return;

    if (hasManuallyGoneBack || currentStep !== 1) {
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
      return;
    }

    const hasCategory = categoryData.categorie && categoryData.subCategory;

    if (hasCategory) {
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = setTimeout(() => {
        const stillHasCategory = categoryData.categorie && categoryData.subCategory;
        if (stillHasCategory && currentStep === 1 && !hasManuallyGoneBack) {
          setCurrentStep(2);
         }
      }, 500);
    }

    return () => {
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    };
  }, [categoryData.categorie, categoryData.subCategory, currentStep, hasManuallyGoneBack, isEdit]);

  // ============ HANDLERS ============

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (['categorie', 'articleType', 'subCategory'].includes(name)) {
      setCategoryData(prev => {
        const newData = { ...prev, [name]: val };
        if (name === 'categorie') {
          newData.articleType = '';
          newData.subCategory = '';
          setSpecificData({});
          if (currentStep === 1) setHasManuallyGoneBack(false);
        } else if (name === 'articleType' && prev.articleType !== val) {
          setSpecificData({});
        } else if (name === 'subCategory' && prev.subCategory !== val) {
          setSpecificData({});
        }
        return newData;
      });
    } else if (['wilaya', 'commune', 'price', 'description', 'telephone', 'phone', 'email', 'address', 'etat'].includes(name)) {
      setCommonData(prev => ({ ...prev, [name]: val }));
    } else {
      setSpecificData(prev => {
        if (val === '' || val === undefined || val === null) {
          const { [name]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [name]: val };
      });
    }
  }, [currentStep]);

  const handleCategorySelect = useCallback((selected) => {
    if (selected.categorie) {
      handleInputChange({ target: { name: 'categorie', value: selected.categorie } });
    }
    if (selected.subCategory) {
      handleInputChange({ target: { name: 'subCategory', value: selected.subCategory } });
    }
    if (selected.articleType) {
      handleInputChange({ target: { name: 'articleType', value: selected.articleType } });
    }
    setAlert({ show: true, message: `✅ "${selected.subCategory || selected.categorie}" sélectionnée`, variant: "success" });
  }, [handleInputChange]);

  const handleStepChange = useCallback((newStep) => {
    if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    if (newStep === 1) {
      setHasManuallyGoneBack(true);
    } else if (newStep > currentStep) {
      setHasManuallyGoneBack(false);
    }
    setCurrentStep(newStep);
  }, [currentStep]);

  const showAlertMessage = useCallback((message, variant = 'info', duration = 4000) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), duration);
  }, []);

  // 🔥 VALIDACIÓN ACTUALIZADA - Título ya no es obligatorio
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return categoryData.categorie && categoryData.subCategory;
      case 2:
        // Solo description es obligatoria (el título se genera automáticamente)
        return commonData.description && commonData.description.trim() !== '';
      case 3: return commonData.price && commonData.price.toString().trim() !== '';
      case 4: return commonData.wilaya && commonData.wilaya.toString().trim() !== '' &&
        commonData.commune && commonData.commune.toString().trim() !== '';
      case 5: return images.length > 0;
      default: return true;
    }
  };

  // 🔥 HANDLE SUBMIT ACTUALIZADO - Usa título generado
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (images.length === 0) return showAlertMessage("Ajoutez des photos.", "danger");
    if (!categoryData.categorie || !categoryData.subCategory) {
      return showAlertMessage("Sélectionnez une catégorie.", "warning");
    }
    if (!commonData.description) {
      return showAlertMessage("Ajoutez une description.", "warning");
    }
    if (!commonData.wilaya || !commonData.commune) {
      return showAlertMessage("Renseignez la wilaya et la commune.", "warning");
    }

    setIsSubmitting(true);

    try {
      // 🎯 GENERAR TÍTULO AUTOMÁTICAMENTE
      const autoTitle = generateTitle(categoryData, specificData, commonData);

      console.log('🎯 Título generado automáticamente:', autoTitle);
      console.log('📊 Datos específicos:', specificData);
      console.log('📋 Datos comunes:', commonData);

      const postContent = {
        categorie: categoryData.categorie,
        subCategory: categoryData.subCategory,
        articleType: categoryData.articleType || '',
        title: autoTitle, // ← Usar título generado
        description: commonData.description || '',
        price: commonData.price || 0,
        etat: commonData.etat || 'occasion',
        wilaya: commonData.wilaya,
        commune: commonData.commune,
        address: commonData.address || '',
        phone: commonData.phone || commonData.telephone || '',
        email: commonData.email || '',
        categorySpecificData: specificData
      };

      if (isEdit && postToEdit?._id) {
        await dispatch(updatePost({ 
          postId: postToEdit._id, 
          postData: postContent, 
          images, 
          auth,
          socket,           // ✅ Añadir socket
          oldPostData: postToEdit  // ✅ Para notificar al dueño anterior si cambia
        }));
        showAlertMessage('✅ Modifié!', "success");
        setTimeout(() => history.push('/'), 1200);
      } else {
        await dispatch(createPost({ postData: postContent, images, auth, socket }));
        showAlertMessage('✅ Publié!', "success");
        setTimeout(() => history.push('/'), 1200);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      showAlertMessage(err.response?.data?.msg || err.message || 'Erreur de publication', "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para obtener nombres de categoría
  const getCategoryPathNames = useCallback(() => {
    const { categorie, subCategory, articleType } = categoryData;
    const categories = categoryState.accordionCategories || [];

    if (!categorie) return '';

    const mainCat = categories.find(c => c.slug === categorie || c.name === categorie);
    if (!mainCat) return categorie;

    let path = mainCat.name;

    if (subCategory) {
      const level1 = mainCat.children?.find(c => c.slug === subCategory || c.name === subCategory);
      if (level1) {
        path += ` → ${level1.name}`;
        if (articleType && articleType !== subCategory) {
          const level2 = level1.children?.find(c => c.slug === articleType || c.name === articleType);
          if (level2) {
            path += ` → ${level2.name}`;
          } else {
            path += ` (${articleType})`;
          }
        }
      } else {
        path += ` → ${subCategory}`;
      }
    }
    return path;
  }, [categoryData, categoryState.accordionCategories]);

  const getFullCategoryText = useCallback(() => getCategoryPathNames(), [getCategoryPathNames]);

  const renderCurrentStep = () => {
    if (isLoadingEditData) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des données...</p>
        </div>
      );
    }

    const allPostData = { ...categoryData, ...commonData, ...specificData };

    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
            <Card className="border-0">
              <div>
                <h5 className="text-center mb-3">{isEdit ? '✏️ Modifier la catégorie' : '🏷️ Sélectionnez une catégorie'}</h5>

                {isEdit && editDataLoaded && (
                  <div className="alert alert-info py-1 mb-3 small">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-edit me-1 text-info"></i>
                      <span><strong>Édition:</strong> "{commonData.title || 'Sans titre'}"</span>
                    </div>
                  </div>
                )}

                {(categoryData.categorie && categoryData.subCategory) && (
                  <div className={`alert ${hasManuallyGoneBack ? 'alert-warning' : 'alert-success'} py-1 mb-3 small`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className={`fas fa-${hasManuallyGoneBack ? 'exclamation-triangle' : 'check-circle'} me-1`}></i>
                        <span><strong>Catégorie:</strong> {getFullCategoryText()}</span>
                      </div>
                      {hasManuallyGoneBack && (
                        <Button variant="outline-primary" size="sm" className="py-0 px-2" onClick={() => {
                          setCategoryData({ categorie: '', articleType: '', subCategory: '' });
                          setSpecificData({});
                          setCommonData({});
                          setHasManuallyGoneBack(false);
                        }}>
                          <i className="fas fa-sync-alt"></i>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {categoryState.accordionLoading && (
                  <div className="text-center mb-3">
                    <Spinner size="sm" animation="border" className="me-2" />
                    <small className="text-muted">Chargement des catégories...</small>
                  </div>
                )}

                <div className="position-relative">
                  {isEdit && editDataLoaded && commonData.title && (
                    <div className="position-absolute top-0 start-50 translate-middle z-index-1" style={{ marginTop: '-10px' }}>
                      <Badge bg="warning" className="px-3 py-1 shadow-sm">
                        <i className="fas fa-box me-1"></i>
                        <span className="fw-bold">Article: </span>
                        <span className="text-truncate" style={{ maxWidth: '200px' }}>
                          {commonData.title.length > 30 ? commonData.title.substring(0, 30) + '...' : commonData.title}
                        </span>
                      </Badge>
                    </div>
                  )}

                  <CategoryAccordion
                    postData={categoryData}
                    handleChangeInput={handleInputChange}
                    onFieldChange={handleCategorySelect}
                    disabled={isSubmitting || categoryState.accordionLoading}
                  />
                </div>

                {categoryData.categorie && categoryData.subCategory && (
                  <div className="text-center mt-4">
                    <Button variant="primary" size="lg" onClick={() => handleStepChange(2)} disabled={categoryState.accordionLoading} className="px-5">
                      {isEdit ? 'Continuer la modification' : 'Continuer'}
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        );

      case 2:
      case 3:
      case 4:
        return (
          <motion.div key={`step${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
            <Card className="border-0">
              <div>
                {isEdit && commonData.title && (
                  <div className="alert alert-warning py-1 mb-3 small">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-edit me-1 text-warning"></i>
                      <span><strong>Édition:</strong> "{commonData.title}"</span>
                    </div>
                  </div>
                )}


                <div className="mb-3 p-2 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <small className="text-muted">Catégorie:</small>
                      <div>
                        <Badge bg="secondary" className="me-1">
                          {categoryState.accordionCategories?.find(c => c.slug === categoryData.categorie)?.name || categoryData.categorie}
                        </Badge>
                        {categoryData.subCategory && (
                          <Badge bg="info" className="me-1">
                            {categoryState.accordionCategories
                              ?.find(c => c.slug === categoryData.categorie)
                              ?.children?.find(ch => ch.slug === categoryData.subCategory)?.name || categoryData.subCategory}
                          </Badge>
                        )}
                        {categoryData.articleType && categoryData.articleType !== categoryData.subCategory && (
                          <Badge bg="light" text="dark">
                            {(() => {
                              const main = categoryState.accordionCategories?.find(c => c.slug === categoryData.categorie);
                              const level1 = main?.children?.find(ch => ch.slug === categoryData.subCategory);
                              const level2 = level1?.children?.find(gch => gch.slug === categoryData.articleType);
                              return level2?.name || categoryData.articleType;
                            })()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => handleStepChange(1)}>
                      <i className="fas fa-pencil-alt"></i>
                    </Button>
                  </div>
                </div>

                <DynamicFieldManager
                  mainCategory={categoryData.categorie}
                  subCategory={categoryData.subCategory}
                  articleType={categoryData.articleType}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  showNavigation={false}
                  isEdit={isEdit}
                  postData={allPostData}
                  handleChangeInput={handleInputChange}
                  isRTL={isRTL}
                />
              </div>
            </Card>
          </motion.div>
        );

      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
            <Card className="border-0">
              <div>
                {isEdit && commonData.title && (
                  <div className="alert alert-warning py-1 mb-3 small">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-edit me-1 text-warning"></i>
                      <span><strong>Édition:</strong> "{commonData.title}"</span>
                    </div>
                  </div>
                )}

                <div className="mb-3 p-2 bg-light rounded">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1">
                      <small className="text-muted">Catégorie:</small>
                      <div>
                        <Badge bg="secondary" className="me-1">
                          {categoryState.accordionCategories?.find(c => c.slug === categoryData.categorie)?.name || categoryData.categorie}
                        </Badge>
                        {categoryData.subCategory && (
                          <Badge bg="info" className="me-1">
                            {categoryState.accordionCategories
                              ?.find(c => c.slug === categoryData.categorie)
                              ?.children?.find(ch => ch.slug === categoryData.subCategory)?.name || categoryData.subCategory}
                          </Badge>
                        )}
                        {categoryData.articleType && categoryData.articleType !== categoryData.subCategory && (
                          <Badge bg="light" text="dark">
                            {(() => {
                              const main = categoryState.accordionCategories?.find(c => c.slug === categoryData.categorie);
                              const level1 = main?.children?.find(ch => ch.slug === categoryData.subCategory);
                              const level2 = level1?.children?.find(gch => gch.slug === categoryData.articleType);
                              return level2?.name || categoryData.articleType;
                            })()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="outline-secondary" size="sm" onClick={() => handleStepChange(1)}>
                      <i className="fas fa-pencil-alt"></i>
                    </Button>
                  </div>
                </div>

                <ImagesStep
                  images={images}
                  setImages={setImages}
                  isRTL={isRTL}
                  onComplete={handleSubmit}
                  onBack={() => handleStepChange(4)}
                  isEdit={isEdit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Contact', icon: '📍', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  return (
    <Container className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {alert.show && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })} className="mb-3 py-2">
              <div className="d-flex align-items-center">
                <i className={`fas fa-${alert.variant === 'success' ? 'check' : 'exclamation-triangle'} me-2`}></i>
                <span>{alert.message}</span>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-4">
        <h1 className="fw-bold mb-2">{isEdit ? '✏️ Modifier une annonce' : '➕ Publier une annonce'}</h1>
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {stepTitles.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="text-center flex-grow-1">
                <button
                  className={`step-indicator ${currentStep === step.step ? 'active' : ''}`}
                  onClick={() => handleStepChange(step.step)}
                  disabled={isSubmitting || (step.step > 1 && !categoryData.categorie)}
                >
                  <div className="step-icon-wrapper">
                    <span className="step-icon">{step.icon}</span>
                    {currentStep >= step.step && <span className="step-dot"></span>}
                  </div>
                  <div className="step-label mt-1">
                    <small className={`fw-medium ${currentStep === step.step ? 'text-primary' : 'text-muted'}`}>
                      {step.title}
                    </small>
                  </div>
                </button>
              </div>
              {index < stepTitles.length - 1 && (
                <div className="step-connector flex-grow-1">
                  <div className={`connector-line ${currentStep > step.step ? 'active' : ''}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="border-0 shadow-sm overflow-hidden rounded">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      <motion.div className="mt-4 pt-3 border-top" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Row className="g-3">
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="w-100 py-2"
            >
              <i className="fas fa-arrow-left me-2"></i> Retour
            </Button>
          </Col>
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (canProceedToNextStep()) {
                    handleStepChange(currentStep + 1);
                  } else {
                    let message = '';
                    switch (currentStep) {
                      case 1: message = "Sélectionnez une catégorie et sous-catégorie"; break;
                      case 2: message = "Ajoutez une description"; break;
                      case 3: message = "Indiquez un prix valide"; break;
                      case 4: message = "Renseignez la wilaya et la commune"; break;
                    }
                    showAlertMessage(`❌ ${message}`, "warning", 3000);
                  }
                }}
                disabled={isSubmitting || categoryState.accordionLoading || (currentStep === 1 && !categoryData.categorie)}
                className="w-100 py-2"
              >
                Suivant <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button
                variant={isEdit ? "warning" : "success"}
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-100 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    {isEdit ? 'Mise à jour...' : 'Publication...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEdit ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                    {isEdit ? 'Mettre à jour' : 'Publier'}
                  </>
                )}
              </Button>
            )}
          </Col>
        </Row>
      </motion.div>

      <style jsx>{`
        .step-content { min-height: 400px; padding: 5px; }
        .step-indicator { background: none; border: none; padding: 0; cursor: pointer; transition: all 0.2s ease; }
        .step-indicator.active .step-icon-wrapper { background: #4f46e5; color: white; transform: scale(1.1); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
        .step-indicator:disabled { opacity: 0.5; cursor: not-allowed; }
        .step-icon-wrapper { width: 50px; height: 50px; border-radius: 50%; background: #f8f9fa; display: flex; align-items: center; justify-content: center; margin: 0 auto; position: relative; transition: all 0.3s ease; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .step-icon { font-size: 20px; }
        .step-dot { position: absolute; bottom: -4px; right: -4px; width: 16px; height: 16px; background: #10b981; border-radius: 50%; border: 3px solid white; }
        .step-connector { display: flex; align-items: center; padding: 0 10px; }
        .connector-line { height: 3px; background: #e9ecef; width: 100%; transition: all 0.3s ease; }
        .connector-line.active { background: #4f46e5; }
        .step-label { font-size: 0.85rem; margin-top: 8px; }
        .z-index-1 { z-index: 1; }
      `}</style>
    </Container>
  );
};

export default CreateAnnoncePage;