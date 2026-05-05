// 📂 pages/CreateBoutiqueWizard.jsx - VERSIÓN CON NOTIFICACIONES
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import ImageUploadBoutique from '../../components/boutique/ImageUploadBoutique';
import Planes from './Planes';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';

// Logo por defecto para boutiques gratuitas
const DEFAULT_LOGO = 'https://res.cloudinary.com/dfjipgj2o/image/upload/q_auto/f_auto/v1775747960/boutique_to7oea.jpg';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state); // ✅ Añadir socket

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId] = useState('BTR-' + Date.now().toString().slice(-6));
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Estado del plan seleccionado
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isFreePlan, setIsFreePlan] = useState(true);
  const [planConfirmed, setPlanConfirmed] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    _id: null,
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    date_debut: new Date().toISOString().split('T')[0],
    categorie: '',
    subCategory: '',
    plan: 'gratuit',
    duree: '1',
    proprietaire: {
      nom: auth?.user?.name || '',
      email: auth?.user?.email || '',
      telephone: auth?.user?.mobile || '',
      wilaya: '',
      adresse: ''
    },
    user: auth?.user?._id || null,
    reseaux_sociaux: {
      facebook: '',
      instagram: '',
      tiktok: '',
      whatsapp: '',
      website: ''
    },
    couleur_theme: '#2563eb',
    montant_initial: 0,
    mois_offerts: 0,
    montant_ttc: 0,
    methode_paiement: '',
    client_nom: auth?.user?.name || '',
    client_telephone: auth?.user?.mobile || '',
    accepte_conditions: false
  });
  
  const [images, setImages] = useState([]);
  
  const colorPalette = [
    '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f59e0b', '#ec4899', '#06b6d4', '#6b7280', '#8b5cf6', '#10b981'
  ];
  
  const methodesPaiement = [
    { value: 'ccp', label: 'CCP', icon: 'fa-credit-card', description: 'Compte de Chèque Postal' },
    { value: 'cib', label: 'CIB', icon: 'fa-university', description: 'Carte Interbancaire' },
    { value: 'edahabia', label: 'Edahabia', icon: 'fa-mobile-alt', description: 'Carte Edahabia' },
    { value: 'baridimob', label: 'BaridiMob', icon: 'fa-mobile-alt', description: 'Mobile Money' },
    { value: 'virement', label: 'Virement', icon: 'fa-exchange-alt', description: 'Virement bancaire' }
  ];
  
  const handleChangeImages = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      const isValidType = file.type.startsWith('image/');
      if (!isValidSize) setError('Image trop volumineuse (max 5MB)');
      if (!isValidType) setError('Format non supporté');
      return isValidSize && isValidType;
    });
    
    if (validFiles.length > 0) {
      const newImages = validFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
        isExisting: false
      }));
      setImages(prev => [...prev, ...newImages]);
      setSuccess(`${validFiles.length} image(s) ajoutée(s)`);
      setTimeout(() => setSuccess(''), 2000);
    }
  };
  
  const deleteImages = (index) => {
    if (images[index]?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(images[index].url);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.url?.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (name === 'nom_boutique' && !formData.domaine_boutique && !isEdit) {
      const domaine = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      const finalDomaine = domaine || 'boutique-' + Date.now().toString().slice(-4);
      setFormData(prev => ({ ...prev, domaine_boutique: finalDomaine }));
    }
  };
  
  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, couleur_theme: color.hex }));
  };
  
  const handlePlanSelect = (planData) => {
    console.log('🎯 handlePlanSelect recibió:', planData);
    
    setSelectedPlan(planData);
    setIsFreePlan(planData.isFree);
    setPlanConfirmed(true);
    
    setFormData(prev => ({
      ...prev,
      categorie: planData.categorie,
      subCategory: planData.subCategory,
      plan: planData.plan,
      duree: planData.duree,
      montant_initial: planData.montant || 0,
      montant_ttc: planData.montant || 0
    }));
  };
  
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return planConfirmed;
      case 2:
        return formData.nom_boutique?.trim() !== '' &&
          formData.description_boutique?.trim() !== '';
      case 3:
        if (!isFreePlan) {
          return formData.methode_paiement !== '' &&
            formData.accepte_conditions === true &&
            formData.client_telephone?.trim() !== '';
        }
        return true;
      default:
        return false;
    }
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      let message = '';
      switch (currentStep) {
        case 1:
          message = 'Veuillez sélectionner et confirmer votre formule';
          break;
        case 2:
          if (!formData.nom_boutique) message = 'Nom de la boutique requis';
          else if (!formData.description_boutique) message = 'Description requise';
          break;
        case 3:
          if (!formData.methode_paiement) message = 'Mode de paiement requis';
          else if (!formData.client_telephone) message = 'Téléphone requis';
          else if (!formData.accepte_conditions) message = 'Vous devez accepter les conditions';
          break;
      }
      setError(message || 'Veuillez remplir tous les champs');
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };
  
  const generateUniqueSlug = (base) => {
    const cleanBase = base
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const finalBase = cleanBase || 'boutique';
    const timestamp = Date.now().toString().slice(-6);
    return `${finalBase}-${timestamp}`;
  };
  
  const prepareSubmitData = () => {
    const generateSubCategory = (categorie) => {
      if (!categorie) return '';
      return 'boutique-' + categorie
        .toLowerCase()
        .replace(/[&]/g, 'et')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    };
    
    const baseSlug = formData.nom_boutique || 'boutique';
    const slug = generateUniqueSlug(baseSlug);
    const domaine_boutique = formData.domaine_boutique?.trim() || slug;
    const subCategory = generateSubCategory(formData.categorie);
    
    let userId = null;
    if (typeof formData.user === 'object' && formData.user?._id) {
      userId = formData.user._id;
    } else if (formData.user) {
      userId = formData.user;
    } else if (auth?.user?._id) {
      userId = auth.user._id;
    } else if (auth?.user?.id) {
      userId = auth.user.id;
    }
    
    console.log('👤 User ID obtenido:', userId);
    
    if (!userId) {
      console.error('❌ No se pudo obtener el userId');
      throw new Error('Utilisateur non identifié');
    }
    
    const submitData = {
      nom_boutique: formData.nom_boutique || '',
      categorie: formData.categorie || '',
      user: userId,
      domaine_boutique: domaine_boutique,
      slug: slug,
      slogan_boutique: formData.slogan_boutique || '',
      description_boutique: formData.description_boutique || '',
      date_debut: formData.date_debut || new Date().toISOString().split('T')[0],
      subCategory: subCategory,
      plan: formData.plan || 'gratuit',
      duree_abonnement: formData.duree === '1' ? '1mois' : 
                       formData.duree === '3' ? '3mois' :
                       formData.duree === '6' ? '6mois' : '1an',
      date_expiration: formData.date_expiration || null,
      proprietaire: {
        nom: formData.proprietaire?.nom || auth?.user?.name || '',
        email: formData.proprietaire?.email || auth?.user?.email || '',
        telephone: formData.proprietaire?.telephone || auth?.user?.mobile || '',
        wilaya: formData.proprietaire?.wilaya || '',
        adresse: formData.proprietaire?.adresse || ''
      },
      reseaux_sociaux: formData.reseaux_sociaux || {
        facebook: '',
        instagram: '',
        tiktok: '',
        whatsapp: '',
        website: ''
      },
      couleur_theme: formData.couleur_theme || '#2563eb',
      montant_initial: formData.montant_initial || 0,
      mois_offerts: formData.mois_offerts || 0,
      montant_ttc: formData.montant_ttc || 0,
      methode_paiement: formData.methode_paiement || '',
      transaction_id: transactionId,
      client_nom: formData.client_nom || auth?.user?.name || '',
      client_telephone: formData.client_telephone || auth?.user?.mobile || ''
    };
    
    console.log('📦 Datos preparados para enviar:', {
      nom_boutique: submitData.nom_boutique,
      categorie: submitData.categorie,
      user: submitData.user,
      domaine_boutique: submitData.domaine_boutique,
      plan: submitData.plan
    });
    
    return submitData;
  };
  
  // ✅ HANDLE SUBMIT ACTUALIZADO CON SOCKET
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom_boutique?.trim()) {
      setError('Le nom de la boutique est requis');
      return;
    }
    
    if (!formData.categorie) {
      setError('La catégorie est requise');
      return;
    }
    
    if (!auth?.user?._id && !formData.user) {
      setError('Utilisateur non identifié');
      return;
    }
    
    if (!isFreePlan && images.length === 0) {
      setError('Au moins une image est requise pour votre boutique');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const submitData = prepareSubmitData();
      console.log('📦 Enviando al backend:', submitData);
      
      // ✅ Pasar socket a la acción createBoutique
      const result = await dispatch(createBoutique({ 
        boutiqueData: submitData, 
        images: isFreePlan ? [] : images, 
        auth,
        socket  // ✅ Añadir socket
      }));
      
      setSuccess(result?.message || 'Boutique créée avec succès!');
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result?.boutique);
        } else {
          history.push('/mes-boutiques');
        }
      }, 2000);
      
    } catch (err) {
      console.error('❌ Error en submit:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (isEdit && boutiqueData) {
      const newFormData = {
        _id: boutiqueData._id || boutiqueData.id,
        nom_boutique: boutiqueData.nom_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        date_debut: boutiqueData.date_debut?.split('T')[0] || new Date().toISOString().split('T')[0],
        categorie: boutiqueData.categorie || '',
        subCategory: boutiqueData.subCategory || '',
        plan: boutiqueData.plan || 'gratuit',
        duree: boutiqueData.duree_abonnement === '1mois' ? '1' : 
               boutiqueData.duree_abonnement === '3mois' ? '3' :
               boutiqueData.duree_abonnement === '6mois' ? '6' : '12',
        proprietaire: {
          nom: boutiqueData.proprietaire?.nom || auth?.user?.name || '',
          email: boutiqueData.proprietaire?.email || auth?.user?.email || '',
          telephone: boutiqueData.proprietaire?.telephone || auth?.user?.mobile || '',
          wilaya: boutiqueData.proprietaire?.wilaya || '',
          adresse: boutiqueData.proprietaire?.adresse || ''
        },
        user: boutiqueData.user?._id || boutiqueData.user || auth?.user?._id,
        reseaux_sociaux: {
          facebook: boutiqueData.reseaux_sociaux?.facebook || '',
          instagram: boutiqueData.reseaux_sociaux?.instagram || '',
          tiktok: boutiqueData.reseaux_sociaux?.tiktok || '',
          whatsapp: boutiqueData.reseaux_sociaux?.whatsapp || '',
          website: boutiqueData.reseaux_sociaux?.website || ''
        },
        couleur_theme: boutiqueData.couleur_theme || '#2563eb',
        montant_initial: boutiqueData.montant_initial || 0,
        mois_offerts: boutiqueData.mois_offerts || 0,
        montant_ttc: boutiqueData.montant_ttc || 0,
        methode_paiement: boutiqueData.methode_paiement || '',
        client_nom: boutiqueData.client_nom || auth?.user?.name || '',
        client_telephone: boutiqueData.client_telephone || auth?.user?.mobile || '',
        accepte_conditions: false
      };
      
      setFormData(newFormData);
      setIsFreePlan(newFormData.plan === 'gratuit');
      setPlanConfirmed(true);
      setSelectedPlan({ plan: newFormData.plan, isFree: newFormData.plan === 'gratuit' });
      
      if (boutiqueData.images?.length > 0 && newFormData.plan !== 'gratuit') {
        setImages(boutiqueData.images.map((img, idx) => ({
          url: img.url,
          public_id: img.public_id || `existing_${idx}`,
          isExisting: true
        })));
      }
    }
  }, [isEdit, boutiqueData, auth]);
  
  useEffect(() => {
    if (alert.error) setError(alert.error);
    if (alert.success) setSuccess(alert.success);
  }, [alert]);
  
  const totalSteps = isFreePlan ? 2 : 3;
  
  return (
    <div className="create-boutique-wizard">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          {isEdit ? '✏️ Modifier votre boutique' : '🏪 Créer votre boutique'}
        </h2>
        <p className="text-muted">
          {isEdit ? 'Mettez à jour vos informations' : 'Créez votre boutique en ligne'}
        </p>
      </div>
      
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {[1, 2, ...(isFreePlan ? [] : [3])].map((step) => (
            <div key={step} className="text-center" style={{ flex: 1 }}>
              <div
                className={`step-circle ${currentStep >= step ? 'completed' : ''} ${currentStep === step ? 'active' : ''}`}
                style={{ margin: '0 auto', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                {currentStep > step ? '✓' : step === 1 ? '💎' : step === 2 ? '📝' : '💳'}
              </div>
              <small className={`step-label ${currentStep === step ? 'active' : ''}`}>
                {step === 1 ? 'Formule' : step === 2 ? 'Informations' : 'Paiement'}
              </small>
            </div>
          ))}
        </div>
        <ProgressBar now={(currentStep / totalSteps) * 100} variant="primary" className="mt-2" style={{ height: '4px' }} />
      </div>
      
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          {currentStep === 1 && (
            <Planes 
              onSelect={handlePlanSelect}
              initialData={{
                categorie: formData.categorie,
                subCategory: formData.subCategory,
                plan: formData.plan,
                duree: formData.duree
              }}
            />
          )}
          
          {currentStep === 2 && (
            <StepInformations
              formData={formData}
              handleInputChange={handleInputChange}
              isFreePlan={isFreePlan}
              images={images}
              handleChangeImages={handleChangeImages}
              deleteImages={deleteImages}
              colorPalette={colorPalette}
              handleColorChange={handleColorChange}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />
          )}
          
          {currentStep === 3 && !isFreePlan && (
            <StepPaiement
              formData={formData}
              methodesPaiement={methodesPaiement}
              handleInputChange={handleInputChange}
              transactionId={transactionId}
              selectedPlan={selectedPlan}
            />
          )}
        </Card.Body>
      </Card>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
          <i className="fas fa-exclamation-circle me-2"></i> {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-3">
          <i className="fas fa-check-circle me-2"></i> {success}
        </Alert>
      )}
      
      <div className="d-flex justify-content-between">
        {currentStep > 1 && (
          <Button variant="outline-secondary" onClick={prevStep} disabled={isSubmitting} size="lg" className="px-4">
            <i className="fas fa-arrow-left me-2"></i> Retour
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={isSubmitting || !validateStep(currentStep)}
            size="lg"
            className="px-4 ms-auto"
          >
            Suivant <i className="fas fa-arrow-right ms-2"></i>
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="px-4 ms-auto"
          >
            {isSubmitting ? (
              <><Spinner size="sm" animation="border" className="me-2" /> Création...</>
            ) : (
              <><i className="fas fa-check-circle me-2"></i> {isFreePlan ? 'Créer ma boutique gratuite' : (isEdit ? 'Mettre à jour' : 'Confirmer et payer')}</>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============ STEP 2: INFORMATIONS ============
const StepInformations = ({ formData, handleInputChange, isFreePlan, images, handleChangeImages, deleteImages, colorPalette, handleColorChange, showColorPicker, setShowColorPicker }) => {
  return (
    <div>
      {isFreePlan && (
        <Alert variant="info" className="mb-4">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Formule Gratuite</strong> - Votre boutique utilisera un logo par défaut. Vous pourrez le modifier plus tard.
        </Alert>
      )}
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom de la boutique <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="nom_boutique" value={formData.nom_boutique} onChange={handleInputChange} placeholder="Ex: Fashion Store Algérie" required />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Domaine <span className="text-danger">*</span></Form.Label>
            <div className="input-group">
              <Form.Control type="text" name="domaine_boutique" value={formData.domaine_boutique} onChange={handleInputChange} placeholder="ma-boutique" required />
              <span className="input-group-text">.marketplace.dz</span>
            </div>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Slogan</Form.Label>
            <Form.Control type="text" name="slogan_boutique" value={formData.slogan_boutique} onChange={handleInputChange} placeholder="Ex: La mode à prix discount" />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date de début</Form.Label>
            <Form.Control type="date" name="date_debut" value={formData.date_debut} onChange={handleInputChange} />
          </Form.Group>
        </Col>
        
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Description <span className="text-danger">*</span></Form.Label>
            <Form.Control as="textarea" rows={3} name="description_boutique" value={formData.description_boutique} onChange={handleInputChange} placeholder="Décrivez votre boutique, vos produits, vos services..." required />
          </Form.Group>
        </Col>
        
        {!isFreePlan && (
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Label>Logo <span className="text-danger">*</span></Form.Label>
              <ImageUploadBoutique images={images} handleChangeImages={handleChangeImages} deleteImages={deleteImages} />
              {images.length === 0 && <Form.Text className="text-danger">Le logo est obligatoire</Form.Text>}
            </Form.Group>
          </Col>
        )}
        
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label><i className="fas fa-palette me-2 text-primary"></i> Couleur du thème</Form.Label>
            <div className="d-flex align-items-center">
              <div className="current-color-preview me-3" style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: formData.couleur_theme, border: '2px solid #ddd', cursor: 'pointer' }} onClick={() => setShowColorPicker(!showColorPicker)} />
              <Form.Control type="text" value={formData.couleur_theme} onChange={(e) => handleColorChange({ hex: e.target.value })} placeholder="#2563eb" style={{ width: '120px' }} />
              <Button variant="outline-primary" size="sm" className="ms-2" onClick={() => setShowColorPicker(!showColorPicker)}><i className="fas fa-paint-brush me-1"></i> Personnaliser</Button>
            </div>
            {showColorPicker && (
              <div className="color-picker-popover mt-2 position-relative">
                <div className="position-fixed top-0 start-0 end-0 bottom-0" onClick={() => setShowColorPicker(false)} />
                <ChromePicker color={formData.couleur_theme} onChange={handleColorChange} />
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
      
      <hr className="my-4" />
      <h5 className="mb-4"><i className="fas fa-user text-primary me-2"></i> Propriétaire</h5>
      <Row>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Nom complet</Form.Label><Form.Control type="text" name="proprietaire.nom" value={formData.proprietaire.nom} onChange={handleInputChange} /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="proprietaire.email" value={formData.proprietaire.email} onChange={handleInputChange} /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Téléphone</Form.Label><Form.Control type="tel" name="proprietaire.telephone" value={formData.proprietaire.telephone} onChange={handleInputChange} placeholder="05 XX XX XX XX" /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label>Wilaya</Form.Label><Form.Control type="text" name="proprietaire.wilaya" value={formData.proprietaire.wilaya} onChange={handleInputChange} /></Form.Group></Col>
        <Col xs={12}><Form.Group className="mb-3"><Form.Label>Adresse</Form.Label><Form.Control type="text" name="proprietaire.adresse" value={formData.proprietaire.adresse} onChange={handleInputChange} /></Form.Group></Col>
      </Row>
      
      <hr className="my-4" />
      <h5 className="mb-4"><i className="fas fa-share-alt text-primary me-2"></i> Réseaux sociaux</h5>
      <Row>
        <Col md={6}><Form.Group className="mb-3"><Form.Label><i className="fab fa-facebook text-primary me-1"></i> Facebook</Form.Label><Form.Control type="url" name="reseaux_sociaux.facebook" value={formData.reseaux_sociaux.facebook} onChange={handleInputChange} placeholder="https://facebook.com/..." /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label><i className="fab fa-instagram text-danger me-1"></i> Instagram</Form.Label><Form.Control type="url" name="reseaux_sociaux.instagram" value={formData.reseaux_sociaux.instagram} onChange={handleInputChange} placeholder="https://instagram.com/..." /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label><i className="fab fa-tiktok me-1"></i> TikTok</Form.Label><Form.Control type="url" name="reseaux_sociaux.tiktok" value={formData.reseaux_sociaux.tiktok} onChange={handleInputChange} placeholder="https://tiktok.com/..." /></Form.Group></Col>
        <Col md={6}><Form.Group className="mb-3"><Form.Label><i className="fab fa-whatsapp text-success me-1"></i> WhatsApp</Form.Label><Form.Control type="text" name="reseaux_sociaux.whatsapp" value={formData.reseaux_sociaux.whatsapp} onChange={handleInputChange} placeholder="05 XX XX XX XX" /></Form.Group></Col>
        <Col xs={12}><Form.Group className="mb-3"><Form.Label><i className="fas fa-globe me-1"></i> Site web</Form.Label><Form.Control type="url" name="reseaux_sociaux.website" value={formData.reseaux_sociaux.website} onChange={handleInputChange} placeholder="https://..." /></Form.Group></Col>
      </Row>
    </div>
  );
};

// ============ STEP 3: PAIEMENT ============
const StepPaiement = ({ formData, methodesPaiement, handleInputChange, transactionId, selectedPlan }) => {
  return (
    <div>
      <h4 className="mb-4"><i className="fas fa-credit-card me-2 text-primary"></i> Paiement de votre boutique</h4>
      
      <Card className="mb-4 border-0 bg-light">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6"><div className="text-muted small">Transaction #</div><div className="h5">{transactionId}</div></div>
            <div className="col-md-6 text-md-end"><div className="text-muted small">Date</div><div className="h5">{new Date().toLocaleDateString('fr-FR')}</div></div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light"><tr><th>Désignation</th><th>Montant</th></tr></thead>
              <tbody>
                <tr>
                  <td><span className="fw-bold">{formData.nom_boutique || 'Boutique'}</span><br /><small className="text-muted">Pack {selectedPlan?.planData?.name} - {selectedPlan?.dureeData?.name}</small></td>
                  <td className="fw-bold text-primary">{selectedPlan?.montant?.toLocaleString()} DA</td>
                </tr>
              </tbody>
              <tfoot className="table-secondary"><tr><td className="text-end fw-bold">Total TTC</td><td className="fw-bold"><span className="text-primary">{selectedPlan?.montant?.toLocaleString()} DA</span></td></tr></tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
      
      <Row>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4"><i className="fas fa-user-circle me-2 text-primary"></i> Informations client</h5>
              <Form.Group className="mb-4"><Form.Label className="fw-bold">Nom complet</Form.Label><Form.Control type="text" name="client_nom" value={formData.client_nom || ''} onChange={handleInputChange} placeholder="Entrez votre nom complet" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label className="fw-bold">Téléphone</Form.Label><Form.Control type="tel" name="client_telephone" value={formData.client_telephone || ''} onChange={handleInputChange} placeholder="05 XX XX XX XX" required /></Form.Group>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4"><i className="fas fa-credit-card me-2 text-primary"></i> Méthode de paiement</h5>
              <Form.Group className="mb-4">
                <Form.Select name="methode_paiement" value={formData.methode_paiement || ''} onChange={handleInputChange} required size="lg">
                  <option value="">Choisissez une méthode</option>
                  {methodesPaiement.map((methode) => (<option key={methode.value} value={methode.value}>{methode.label}</option>))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Check type="checkbox" name="accepte_conditions" id="accepte_conditions" label={<span><strong>J'accepte les conditions générales</strong><span className="text-danger"> *</span></span>} checked={formData.accepte_conditions || false} onChange={handleInputChange} required />
              </Form.Group>
              <Alert variant="info" className="mt-3 mb-0"><i className="fas fa-info-circle me-2"></i> Après paiement, votre boutique sera activée sous 24-48h.</Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateBoutiqueWizard;