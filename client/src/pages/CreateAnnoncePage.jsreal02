// 📂 pages/CreateAnnoncePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost } from '../redux/actions/postAction';
import { getCategoriesForAccordion } from '../redux/actions/categoryAction'; // Nueva acción
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const CreateAnnoncePage = () => {
  // ============ HOOKS ============
  const { auth, category: categoryState,socket } = useSelector((state) => state);
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

  // ============ EFECTOS ============

  // 📥 Cargar categorías para el accordion
  useEffect(() => {
    console.log('🔄 Cargando categorías para accordion...');

    // Verificar si ya tenemos categorías cargadas
    if (categoryState.accordionCategories?.length === 0 && !categoryState.accordionLoading) {
      dispatch(getCategoriesForAccordion())
        .then(result => {
          if (result.success) {
            console.log('✅ Categorías para accordion cargadas:', result.categories?.length);
          } else {
            console.warn('⚠️ No se pudieron cargar las categorías para accordion');
          }
        })
        .catch(error => {
          console.error('❌ Error cargando categorías:', error);
        });
    }
  }, [dispatch, categoryState.accordionCategories, categoryState.accordionLoading]);

  // 📥 Cargar datos de edición
  useEffect(() => {
    const loadEditData = async () => {
      // Si no es edición, no cargar nada
      if (!isEdit) {
        setIsLoadingEditData(false);
        return;
      }

      setIsLoadingEditData(true);

      try {
        let postDataToLoad = postToEdit;

        console.log('📝 DEBUG Edit Mode:', {
          isEdit,
          postId,
          hasPostToEdit: !!postToEdit,
          locationState: location.state
        });

        // 🧩 CASO 1: Si llegamos por URL directa o sin datos en state
        if (postId) {
          console.log('🔍 Fetching post from backend with ID:', postId);

          try {
            const res = await axios.get(`${BASE_URL}/api/posts/${postId}`);
            console.log('✅ Backend response:', res.data);
            postDataToLoad = res.data.post;
          } catch (fetchError) {
            console.error('❌ Error fetching post:', fetchError);
            throw new Error(`Failed to load post: ${fetchError.message}`);
          }
        }

        // 🧩 CASO 2: Tenemos datos de state
        if (postDataToLoad) {
          console.log('📋 Post data to load:', postDataToLoad);

          // 1. Cargar datos de categoría
          const loadedCategoryData = {
            categorie: postDataToLoad.categorie || '',
            subCategory: postDataToLoad.subCategory || '',
            articleType: postDataToLoad.articleType || ''
          };

          console.log('📊 Loaded category data:', loadedCategoryData);

          // 2. Cargar datos comunes
          const excludeFromCommon = [
            'categorie', 'subCategory', 'articleType', 'images', '_id',
            'createdAt', 'updatedAt', 'user', 'categorySpecificData',
            '__v', 'likes', 'comments', 'views'
          ];

          const loadedCommonData = {};
          Object.entries(postDataToLoad).forEach(([key, value]) => {
            if (!excludeFromCommon.includes(key) &&
              value !== undefined &&
              value !== null &&
              value !== '') {
              loadedCommonData[key] = value;
            }
          });

          console.log('📊 Loaded common data:', loadedCommonData);

          // 3. Cargar datos específicos
          const loadedSpecificData = postDataToLoad.categorySpecificData || {};
          console.log('📊 Loaded specific data:', loadedSpecificData);

          // 4. Cargar imágenes
          const loadedImages = [];
          if (postDataToLoad.images && Array.isArray(postDataToLoad.images)) {
            postDataToLoad.images.forEach((img, index) => {
              if (typeof img === 'string') {
                loadedImages.push({
                  url: img,
                  public_id: `existing_${index}`,
                  isExisting: true
                });
              } else if (img && img.url) {
                loadedImages.push({
                  url: img.url,
                  public_id: img.public_id || `existing_${index}`,
                  isExisting: true
                });
              }
            });
          }

          console.log('🖼️ Loaded images:', loadedImages);

          // 5. Actualizar estados
          setCategoryData(loadedCategoryData);
          setCommonData(loadedCommonData);
          setSpecificData(loadedSpecificData);
          setImages(loadedImages);

          // 6. Si tiene categoría completa, ir al paso 2
          if (loadedCategoryData.categorie && loadedCategoryData.subCategory) {
            setCurrentStep(2);
            setHasManuallyGoneBack(true);
            setAlert({
              show: true,
              message: "📝 Mode édition activé. Vous pouvez modifier l'annonce.",
              variant: "info"
            });
          }
        } else {
          console.warn('⚠️ No post data found for editing');
          setAlert({
            show: true,
            message: "⚠️ Impossible de charger les données de l'annonce. Créez une nouvelle annonce.",
            variant: "warning"
          });
        }

      } catch (error) {
        console.error('❌ Error loading edit data:', error);
        setAlert({
          show: true,
          message: `❌ Erreur: ${error.message}`,
          variant: "danger"
        });
      } finally {
        setIsLoadingEditData(false);
      }
    };

    loadEditData();
  }, [isEdit, postId, postToEdit, location.state]);

  // ⚡ Avance automático al step 2
  useEffect(() => {
    if (hasManuallyGoneBack || isEdit || currentStep !== 1) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      return;
    }

    const hasCategory = categoryData.categorie && categoryData.subCategory;

    if (hasCategory) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }

      autoAdvanceTimeout.current = setTimeout(() => {
        const stillHasCategory = categoryData.categorie && categoryData.subCategory;

        if (stillHasCategory && currentStep === 1 && !hasManuallyGoneBack) {
          setCurrentStep(2);
          setAlert({
            show: true,
            message: "✅ Catégorie sélectionnée. Complétez les détails.",
            variant: "success"
          });
        }
      }, 500);
    }

    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, [categoryData.categorie, categoryData.subCategory, currentStep, hasManuallyGoneBack, isEdit]);

  // ============ HANDLERS ============

  // 🎯 Handler único para cambios de input
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    // 1. Campos de categoría
    if (['categorie', 'articleType', 'subCategory'].includes(name)) {
      setCategoryData(prev => {
        const newData = { ...prev, [name]: val };

        // Resetear si cambia la categoría principal
        if (name === 'categorie') {
          newData.articleType = '';
          newData.subCategory = '';
          setSpecificData({});
          if (currentStep === 1) {
            setHasManuallyGoneBack(false);
          }
        } else if (name === 'articleType' && prev.articleType !== val) {
          setSpecificData({});
        } else if (name === 'subCategory' && prev.subCategory !== val) {
          setSpecificData({});
        }

        return newData;
      });
    }
    // 2. Campos comunes
    else if (['wilaya', 'commune', 'price', 'description', 'title', 'telephone', 'phone', 'email', 'address', 'etat'].includes(name)) {
      setCommonData(prev => ({
        ...prev,
        [name]: val
      }));
    }
    // 3. Campos específicos
    else {
      setSpecificData(prev => {
        if (val === '' || val === undefined || val === null) {
          const { [name]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [name]: val };
      });
    }
  }, [currentStep]);

  // 🔄 Handler específico para cuando el CategoryAccordion selecciona una categoría
  const handleCategorySelect = useCallback((selected) => {
    console.log('✅ Categoría seleccionada desde accordion:', selected);

    // Crear un evento sintético para mantener compatibilidad
    if (selected.categorie) {
      const categorieEvent = {
        target: {
          name: 'categorie',
          value: selected.categorie
        }
      };
      handleInputChange(categorieEvent);
    }

    if (selected.subCategory) {
      const subCategoryEvent = {
        target: {
          name: 'subCategory',
          value: selected.subCategory
        }
      };
      handleInputChange(subCategoryEvent);
    }

    if (selected.articleType) {
      const articleTypeEvent = {
        target: {
          name: 'articleType',
          value: selected.articleType
        }
      };
      handleInputChange(articleTypeEvent);
    }

    // Mostrar mensaje de éxito
    setAlert({
      show: true,
      message: `✅ "${selected.subCategory || selected.categorie}" sélectionnée`,
      variant: "success"
    });

  }, [handleInputChange]);

  // 🔄 Cambiar de paso
  const handleStepChange = useCallback((newStep) => {
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }

    if (newStep === 1) {
      setHasManuallyGoneBack(true);
    } else if (newStep > currentStep) {
      setHasManuallyGoneBack(false);
    }

    setCurrentStep(newStep);
  }, [currentStep]);

  // 📢 Mostrar alertas
  const showAlertMessage = useCallback((message, variant = 'info', duration = 4000) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: 'info' });
    }, duration);
  }, []);

  // ✅ Validación de pasos
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return categoryData.categorie && categoryData.subCategory;
      case 2:
        return commonData.title && commonData.title.trim() !== '' &&
          commonData.description && commonData.description.trim() !== '';
      case 3:
        return commonData.price && commonData.price.toString().trim() !== '';
      case 4:
        return commonData.wilaya && commonData.wilaya.toString().trim() !== '' &&
          commonData.commune && commonData.commune.toString().trim() !== '';
      case 5:
        return images.length > 0;
      default:
        return true;
    }
  };

  // 🚀 Enviar formulario
  // 🔷 SOUMETTRE ANNONCE - VERSIÓN SIMPLIFIÉE SANS BOUTIQUE
// 🚀 Enviar formulario - VERSIÓN CORREGIDA
// 🚀 Enviar formulario - CON LOGS DE DEPURACIÓN
// 🚀 Enviar formulario - Mismo patrón simple
// 🚀 Enviar formulario - Versión simplificada SIN status
// En CreateAnnoncePage.js - handleSubmit CORREGIDO
// En CreateAnnoncePage.js - handleSubmit CORREGIDO
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if(images.length === 0) {
    return showAlertMessage("Ajoutez des photos.", "danger");
  }

  // Validación básica
  if(!categoryData.categorie || !categoryData.subCategory || 
     !commonData.title || !commonData.wilaya || !commonData.commune) {
    return showAlertMessage("Remplissez les champs requis.", "warning");
  }

  setIsSubmitting(true);

  try {
    // 🎯 Preparar los datos - AHORA CON categorySpecificData
    const postContent = {
      // Datos de categoría
      categorie: categoryData.categorie,
      subCategory: categoryData.subCategory,
      articleType: categoryData.articleType || '',
      
      // Datos comunes
      title: commonData.title,
      description: commonData.description || '',
      price: commonData.price || 0,
      etat: commonData.etat || 'occasion',
      wilaya: commonData.wilaya,
      commune: commonData.commune,
      address: commonData.address || '',
      phone: commonData.phone || commonData.telephone || '',
      email: commonData.email || '',
      
      // 🎯 IMPORTANTE: Enviar campos específicos DENTRO de categorySpecificData
      categorySpecificData: specificData
    };

    console.log('📤 Enviando postContent:', {
      common: {
        categorie: postContent.categorie,
        subCategory: postContent.subCategory,
        title: postContent.title,
        price: postContent.price
      },
      specificData: postContent.categorySpecificData  // ← Esto es lo importante
    });

    if (isEdit && postToEdit?._id) {
      await dispatch(updatePost({
        postId: postToEdit._id,
        postData: postContent,
        images, 
        auth
      }));
      
      showAlertMessage('✅ Modifié!', "success");
      setTimeout(() => history.push('/'), 1200);
      
    } else {
      await dispatch(createPost({
        postData: postContent,
        images,
        auth,
        socket
      }));
      
      showAlertMessage('✅ Publié!', "success");
      setTimeout(() => history.push('/'), 1200);
    }

  } catch (err) {
    console.error('❌ Error en handleSubmit:', err);
    showAlertMessage(
      err.response?.data?.msg || 
      err.message || 
      'Erreur de publication', 
      "danger"
    );
  } finally {
    setIsSubmitting(false);
  }
};
  // 🎯 Renderizar contenido del paso actual
  const renderCurrentStep = () => {
    if (isLoadingEditData) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des données...</p>
        </div>
      );
    }

    // Combinar todos los datos para pasar a los componentes
    const allPostData = {
      ...categoryData,
      ...commonData,
      ...specificData
    };

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <Card className="border-0">
               
                <h5 className="text-center mb-3">
                  {isEdit ? '✏️ Modifier la catégorie' : '🏷️ Sélectionnez une catégorie'}
                </h5>

                {/* Mostrar categoría actual si existe */}
                {(categoryData.categorie && categoryData.subCategory) && (
                  <div className={`alert ${hasManuallyGoneBack ? 'alert-info' : 'alert-success'} py-2 mb-3`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className={`fas fa-${hasManuallyGoneBack ? 'info-circle' : 'check-circle'} me-2`}></i>
                        <small>
                          <strong>{categoryData.categorie}</strong>
                          {categoryData.subCategory && <span> → {categoryData.subCategory}</span>}
                          {categoryData.articleType && <span> ({categoryData.articleType})</span>}
                        </small>
                      </div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setCategoryData({
                            categorie: '',
                            articleType: '',
                            subCategory: ''
                          });
                          setSpecificData({});
                          setCommonData({});
                          setHasManuallyGoneBack(false);
                        }}
                      >
                        <i className="fas fa-sync-alt me-1"></i>
                        Changer
                      </Button>
                    </div>
                  </div>
                )}

                {/* Información de carga */}
                {categoryState.accordionLoading && (
                  <div className="text-center mb-3">
                    <Spinner size="sm" animation="border" className="me-2" />
                    <small className="text-muted">Chargement des catégories...</small>
                  </div>
                )}

                {/* Componente de categorías (NUEVA VERSIÓN) */}
                <CategoryAccordion
                  postData={categoryData}
                  handleChangeInput={handleInputChange}
                  onFieldChange={handleCategorySelect}
                  disabled={isSubmitting || categoryState.accordionLoading}
                />

                {/* Botón manual para avanzar */}
                {categoryData.categorie && categoryData.subCategory && hasManuallyGoneBack && (
                  <div className="text-center mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStepChange(2)}
                      disabled={categoryState.accordionLoading}
                    >
                      <i className="fas fa-arrow-right me-1"></i>
                      Continuer avec cette catégorie
                    </Button>
                  </div>
                )}
            
            </Card>
          </motion.div>
        );

      case 2:
      case 3:
      case 4:
        return (
          <motion.div
            key={`step${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            {/* Botón para volver a categoría en modo edición */}
            {isEdit && currentStep > 1 && (
              <div className="text-center mb-3">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => handleStepChange(1)}
                  className="px-3"
                  disabled={isSubmitting}
                >
                  <i className="fas fa-edit me-1"></i>
                  Modifier la catégorie
                </Button>
              </div>
            )}

            {/* Info de categoría seleccionada */}
            <div className="mb-3 p-2 bg-light rounded">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <small className="text-muted">Catégorie sélectionnée:</small>
                  <div>
                    <Badge bg="secondary" className="me-1">
                      {categoryData.categorie}
                    </Badge>
                    {categoryData.subCategory && (
                      <>
                        <Badge bg="info" className="me-1">
                          {categoryData.subCategory}
                        </Badge>
                      </>
                    )}
                    {categoryData.articleType && (
                      <Badge bg="light" text="dark">
                        {categoryData.articleType}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleStepChange(1)}
                >
                  <i className="fas fa-pencil-alt"></i>
                </Button>
              </div>
            </div>

            {/* Gestor de campos dinámicos */}

            <DynamicFieldManager
              mainCategory={categoryData.categorie}           // ✅ CORRECTO
              subCategory={categoryData.subCategory}          // ✅ CORRECTO
              articleType={categoryData.articleType}          // ✅ CORRECTO
              currentStep={currentStep}
              onStepChange={handleStepChange}
              showNavigation={false}
              isEdit={isEdit}
              postData={allPostData}                          // ✅ TODOS LOS DATOS
              handleChangeInput={handleInputChange}           // ✅ HANDLER ORIGINAL
              isRTL={isRTL}
            />

          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            {/* Componente de imágenes */}
            <ImagesStep
              images={images}
              setImages={setImages}
              isRTL={isRTL}
              onComplete={handleSubmit}
              onBack={() => handleStepChange(4)}
              isEdit={isEdit}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ============ UI ============

  // Títulos de pasos
  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Contact', icon: '📍', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  return (
    <Container className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Alerta */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert
              variant={alert.variant}
              dismissible
              onClose={() => setAlert({ ...alert, show: false })}
              className="mb-3 py-2"
            >
              <div className="d-flex align-items-center">
                <i className={`fas fa-${alert.variant === 'success' ? 'check' : 'exclamation-triangle'} me-2`}></i>
                <span>{alert.message}</span>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encabezado */}
      <div className="text-center mb-4">
        <h1 className="fw-bold mb-2">
          {isEdit ? '✏️ Modifier une annonce' : '➕ Publier une annonce'}
        </h1>

        {isEdit && currentStep > 1 && (
          <Badge bg="warning" className="px-3 py-2">
            <i className="fas fa-edit me-1"></i>
            Mode édition
          </Badge>
        )}
      </div>

      {/* Indicador de pasos */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {stepTitles.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="text-center flex-grow-1">
                <button
                  className={`step-indicator ${currentStep === step.step ? 'active' : ''}`}
                  onClick={() => handleStepChange(step.step)}
                  disabled={isSubmitting}
                >
                  <div className="step-icon-wrapper">
                    <span className="step-icon">{step.icon}</span>
                    {currentStep >= step.step && (
                      <span className="step-dot"></span>
                    )}
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

      {/* Contenido del paso */}
      <div className="border-0 shadow-sm overflow-hidden rounded">
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>

      {/* Navegación inferior */}
      <motion.div
        className="mt-4 pt-3 border-top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Row className="g-3">
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="w-100 py-2"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Retour
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
                      case 2: message = "Complétez le titre et la description"; break;
                      case 3: message = "Indiquez un prix valide"; break;
                      case 4: message = "Renseignez la wilaya et la commune"; break;
                    }
                    showAlertMessage(`❌ ${message}`, "warning", 3000);
                  }
                }}
                disabled={isSubmitting || categoryState.accordionLoading}
                className="w-100 py-2"
              >
                Suivant
                <i className="fas fa-arrow-right ms-2"></i>
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

        {/* Mensaje de validación para paso 4 */}
        {currentStep === 4 && !canProceedToNextStep() && (
          <div className="alert alert-warning mt-3 mb-0 py-2">
            <i className="fas fa-exclamation-circle me-2"></i>
            <small>Veuillez remplir la wilaya et la commune pour continuer.</small>
          </div>
        )}
      </motion.div>

      {/* Estilos CSS */}
      <style jsx>{`
        .step-content {
          min-height: 400px;
          padding: 10px;
        }
        
        .step-indicator {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .step-indicator.active .step-icon-wrapper {
          background: #4f46e5;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .step-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          transition: all 0.3s ease;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .step-icon {
          font-size: 20px;
        }
        
        .step-dot {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid white;
        }
        
        .step-connector {
          display: flex;
          align-items: center;
          padding: 0 10px;
        }
        
        .connector-line {
          height: 3px;
          background: #e9ecef;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .connector-line.active {
          background: #4f46e5;
        }
        
        .step-label {
          font-size: 0.85rem;
          margin-top: 8px;
        }
      `}</style>
    </Container>
  );
};

export default CreateAnnoncePage;