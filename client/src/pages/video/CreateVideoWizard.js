// components/Video/CreateVideoWizard.jsx - VERSIÓN CON SELECTOR DE CATEGORÍAS
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CloudUpload, Image, Camera, X, CheckCircle, GeoAlt, Telephone, Envelope, Box, Tag, Building } from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { createVideo } from '../../redux/actions/videoAction';
import { getSliderCategories } from '../../redux/actions/categoryAction'; // ✅ Importar acción
import { videoUpload } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import './CreateVideoWizard.css';

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { user } = auth;
  
  // ✅ Obtener categorías del estado global
  const { sliderCategories = [], sliderLoading = false } = useSelector((state) => state.category || {});
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);
  
  // ✅ NUEVOS ESTADOS COMERCIALES
  const [isCommercial, setIsCommercial] = useState(false);
  const [wilayasList, setWilayasList] = useState([]);
  const [communesList, setCommunesList] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [showCommercialFields, setShowCommercialFields] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(''); // ✅ Estado para categoría seleccionada
  
  const [wizardData, setWizardData] = useState({
    videoSource: null,
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    videoUrl: '',
    videoPublicId: '',
    thumbnail: '',
    selectedMusic: null,
    musicVolume: 70,
    originalAudio: true,
    title: '',
    description: '',
    // ✅ CAMPOS COMERCIALES
    isCommercial: false,
    category: '', // ✅ Campo para categoría
    price: '',
    wholesale: false,
    minQuantity: 1,
    phone: '',
    email: '',
    wilaya: '',
    commune: '',
    pickupOnly: false,
    deliveryAvailable: false,
    deliveryCost: 0,
    stock: 0
  });
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;
  
  // ✅ Cargar categorías al montar el componente
  useEffect(() => {
    if (sliderCategories.length === 0 && !sliderLoading) {
      dispatch(getSliderCategories());
    }
  }, [dispatch, sliderCategories.length, sliderLoading]);
  
  // ✅ Lista de wilayas de Argelia
  useEffect(() => {
    const wilayas = [
      'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
      'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
      'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
      'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
      'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
      'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
      'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
      'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Menia'
    ];
    setWilayasList(wilayas);
  }, []);
  
  // ✅ Lista de comunas simulada (en producción vendría de API)
  const getCommunesByWilaya = (wilaya) => {
    const communesMap = {
      'Alger': ['Sidi M\'Hamed', 'El Biar', 'Bouzareah', 'Kouba', 'Bab El Oued', 'Hydra', 'Ben Aknoun'],
      'Oran': ['Oran Centre', 'Es Sénia', 'Bir El Djir', 'Mers El Kébir', 'El Hamri'],
      'Constantine': ['Constantine Centre', 'El Khroub', 'Aïn Smara', 'Zighoud Youcef'],
      'Annaba': ['Annaba Centre', 'El Bouni', 'Seraïdi', 'Berrahal'],
      'Tizi Ouzou': ['Tizi Ouzou Centre', 'Azazga', 'Beni Douala', 'Boghni']
    };
    return communesMap[wilaya] || ['Centre-ville', 'Bordj', 'Cité', 'Lotissement'];
  };
  
  useEffect(() => {
    if (isMountedRef.current) {
      setWizardData(prev => ({ ...prev, isCommercial }));
    }
  }, [isCommercial]);
  
  useEffect(() => {
    if (selectedWilaya) {
      setCommunesList(getCommunesByWilaya(selectedWilaya));
      setWizardData(prev => ({ ...prev, wilaya: selectedWilaya }));
    }
  }, [selectedWilaya]);
  
  useEffect(() => {
    setWizardData(prev => ({ ...prev, commune: selectedCommune }));
  }, [selectedCommune]);
  
  // ✅ Actualizar categoría en wizardData cuando cambia selección
  useEffect(() => {
    setWizardData(prev => ({ ...prev, category: selectedCategory }));
  }, [selectedCategory]);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (wizardData.videoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(wizardData.videoPreview);
      }
    };
  }, [wizardData.videoPreview]);
  
  useEffect(() => {
    const handleStopAudio = () => {
      const audios = document.querySelectorAll('audio');
      audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
    handleStopAudio();
    return () => handleStopAudio();
  }, [currentStep]);
  
  const isStep1Valid = useMemo(() => {
    if (!wizardData.videoSource) return false;
    if (!wizardData.videoUrl) return false;
    if (wizardData.videoDuration > maxDuration) return false;
    return true;
  }, [wizardData.videoSource, wizardData.videoUrl, wizardData.videoDuration, maxDuration]);
  
  const isStep3Valid = useMemo(() => {
    if (!wizardData.title.trim()) return false;
    if (isCommercial) {
      if (!wizardData.category) return false; // ✅ Requerir categoría
      if (!wizardData.wilaya || !wizardData.commune) return false;
      if (!wizardData.phone && !wizardData.email) return false;
    }
    return true;
  }, [wizardData.title, isCommercial, wizardData.category, wizardData.wilaya, wizardData.commune, wizardData.phone, wizardData.email]);
  
  const handleGallerySelect = () => fileInputRef.current?.click();
  const handleCameraSelect = () => cameraInputRef.current?.click();
  
  const handleFileChange = useCallback(async (e, isCamera = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Veuillez sélectionner un fichier vidéo valide');
      return;
    }
    
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempVideo.src);
      const duration = tempVideo.duration;
      if (duration > maxDuration) {
        setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
        return;
      }
      setLoading(true);
      setUploadProgress(0);
      videoUpload(file, (progress) => setUploadProgress(progress))
        .then(result => {
          if (isMountedRef.current) {
            setWizardData(prev => ({
              ...prev,
              videoSource: isCamera ? 'camera' : 'gallery',
              videoFile: file,
              videoPreview: URL.createObjectURL(file),
              videoDuration: duration,
              videoUrl: result.url,
              videoPublicId: result.public_id,
              thumbnail: result.thumbnail
            }));
            setError(null);
          }
        })
        .catch(err => {
          console.error(err);
          setError('Erreur lors du téléchargement de la vidéo');
        })
        .finally(() => {
          if (isMountedRef.current) setLoading(false);
        });
    };
    tempVideo.onerror = () => {
      URL.revokeObjectURL(tempVideo.src);
      setError('Erreur lors de la lecture de la vidéo');
    };
    tempVideo.src = URL.createObjectURL(file);
  }, [maxDuration]);
  
  const clearVideo = () => {
    if (wizardData.videoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(wizardData.videoPreview);
    }
    setWizardData(prev => ({
      ...prev,
      videoSource: null,
      videoFile: null,
      videoPreview: null,
      videoDuration: 0,
      videoUrl: '',
      videoPublicId: '',
      thumbnail: ''
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };
  
  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid) {
      setError('Veuillez sélectionner et télécharger une vidéo valide');
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
    setError(null);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
    window.scrollTo(0, 0);
  };
  
  const updateWizardData = useCallback((newData) => {
    if (isMountedRef.current) setWizardData(prev => ({ ...prev, ...newData }));
  }, []);
  
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    
    console.log("📦 Datos completos del wizard:", wizardData);
    
    // ✅ Encontrar la categoría seleccionada para obtener su ID
    const selectedCategoryObj = sliderCategories.find(cat => cat._id === selectedCategory);
    
    const payload = {
      title: wizardData.title,
      description: wizardData.description,
      videoUrl: wizardData.videoUrl,
      videoPublicId: wizardData.videoPublicId,
      thumbnail: wizardData.thumbnail,
      duration: wizardData.videoDuration,
      music: wizardData.selectedMusic ? {
        id: wizardData.selectedMusic.id,
        title: wizardData.selectedMusic.title,
        artist: wizardData.selectedMusic.artist,
        audioUrl: wizardData.selectedMusic.audioUrl,
        audioPublicId: wizardData.selectedMusic.audioPublicId || wizardData.selectedMusic.publicId,
        volume: wizardData.musicVolume
      } : null,
      // ✅ CAMPOS COMERCIALES
      isCommercial: isCommercial,
      category: selectedCategory, // ✅ Enviar ObjectId de la categoría
      price: isCommercial && wizardData.price ? parseFloat(wizardData.price) : 0,
      wholesale: isCommercial ? wizardData.wholesale : false,
      minQuantity: isCommercial && wizardData.wholesale ? (wizardData.minQuantity || 1) : 1,
      phone: isCommercial ? wizardData.phone : '',
      email: isCommercial ? wizardData.email : '',
      wilaya: isCommercial ? wizardData.wilaya : '',
      commune: isCommercial ? wizardData.commune : '',
      pickupOnly: isCommercial ? wizardData.pickupOnly : false,
      delivery: {
        available: isCommercial ? wizardData.deliveryAvailable : false,
        cost: isCommercial ? (wizardData.deliveryCost || 0) : 0,
        estimatedDays: 2,
        zones: isCommercial ? [wizardData.wilaya] : []
      },
      stock: {
        total: isCommercial ? (wizardData.stock || 0) : 0,
        available: isCommercial ? (wizardData.stock || 0) : 0,
        reserved: 0
      },
      tags: isCommercial ? [wizardData.wilaya, wizardData.commune, wizardData.wholesale ? 'gros' : 'détail'] : []
    };
    
    console.log("📤 Payload final a enviar:", JSON.stringify(payload, null, 2));
    
    try {
      const res = await dispatch(createVideo(payload, auth.token));
      if (res?.success) {
        const isAdmin = auth.user?.role === 'admin';
        if (isAdmin) {
          dispatch({ type: GLOBALTYPES.ALERT, payload: { success: '✅ Vidéo publiée avec succès !' } });
          history.push('/');
        } else {
          dispatch({ type: GLOBALTYPES.ALERT, payload: { success: '📹 Vidéo envoyée ! Elle sera publiée après approbation.' } });
          history.push('/');
        }
      } else {
        setError(res?.message || 'Erreur lors de la création de la vidéo');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau, veuillez réessayer');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Render Step1
  const renderStep1 = () => (
    <div className="step1-container" style={{ padding: '0 8px', minHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '30px', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleGallerySelect} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
            <Image size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>Galerie</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleCameraSelect} style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)' }}>
            <Camera size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff', fontWeight: 500 }}>Caméra</div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, false)} />
      <input type="file" ref={cameraInputRef} accept="video/mp4,video/quicktime,video/webm" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, true)} />
      
      {loading && uploadProgress > 0 && (
        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated className="mt-3" style={{ borderRadius: '20px', height: '8px' }} />
      )}
      
      {wizardData.videoPreview && (
        <div className="video-preview-full" style={{ flex: 1, marginTop: '20px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', minHeight: '400px' }}>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', background: '#000' }} autoPlay={false} controlsList="nodownload" />
          <Badge bg="dark" style={{ position: 'absolute', bottom: '10px', right: '10px', opacity: 0.8, fontSize: '12px', padding: '4px 8px' }}>
            ⏱️ {Math.floor(wizardData.videoDuration)}s
          </Badge>
          <Button variant="danger" size="sm" style={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '30px', opacity: 0.9 }} onClick={clearVideo}>
            <X size={14} className="me-1" /> Changer
          </Button>
        </div>
      )}
      
      {!wizardData.videoPreview && !loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginTop: '20px', minHeight: '300px', color: '#fff', textAlign: 'center' }}>
          <div>
            <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <p>Sélectionnez une vidéo depuis<br />votre galerie ou votre caméra</p>
            <small style={{ opacity: 0.6 }}>Max {maxDuration} secondes</small>
          </div>
        </div>
      )}
    </div>
  );
  
  // ✅ NUEVO: Render Step3 con selector de categorías
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '20px' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>📝 Détails de la vidéo</h5>
      
      {/* Título */}
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Titre *</label>
        <input 
          type="text" 
          className="form-control form-control-lg" 
          placeholder="Donnez un titre à votre vidéo..." 
          value={wizardData.title} 
          onChange={(e) => updateWizardData({ title: e.target.value })} 
          maxLength="100" 
          style={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }} 
          autoFocus 
        />
        <small className="text-muted mt-1 d-block">{wizardData.title.length}/100 caractères</small>
      </div>
      
      {/* Descripción */}
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Description</label>
        <textarea 
          className="form-control" 
          rows="4" 
          placeholder="Décrivez votre vidéo..." 
          value={wizardData.description} 
          onChange={(e) => updateWizardData({ description: e.target.value })} 
          maxLength="500" 
          style={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', resize: 'none' }} 
        />
        <small className="text-muted mt-1 d-block">{wizardData.description.length}/500 caractères</small>
      </div>
      
      {/* ✅ TOGGLE COMERCIAL */}
      <div className="mb-4 p-3" style={{ background: 'rgba(102, 126, 234, 0.1)', borderRadius: '16px' }}>
        <Form.Check 
          type="switch"
          id="commercial-switch"
          label={
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              <Tag className="me-2" size={18} /> Vidéo commerciale
            </span>
          }
          checked={isCommercial}
          onChange={(e) => {
            setIsCommercial(e.target.checked);
            setShowCommercialFields(e.target.checked);
          }}
          style={{ color: 'white' }}
        />
        <small className="text-muted mt-2 d-block">
          Activez cette option si vous vendez un produit ou service (vêtements, véhicules, immobilier, etc.)
        </small>
      </div>
      
      {/* ✅ CAMPOS COMERCIALES (se muestran solo si isCommercial es true) */}
      {isCommercial && (
        <div className="commercial-fields" style={{ animation: 'fadeIn 0.3s ease' }}>
          
          {/* ✅ SELECTOR DE CATEGORÍAS (NUEVO) */}
          <div className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h6 className="mb-3" style={{ color: '#667eea' }}>
              <Tag className="me-2" /> Catégorie *
            </h6>
            <select 
              className="form-select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {sliderCategories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            <small className="text-muted mt-2 d-block">
              Choisissez la catégorie correspondant à votre produit ou service
            </small>
          </div>
          
          <div className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h6 className="mb-3" style={{ color: '#667eea' }}>
              <Building className="me-2" /> Informations du produit
            </h6>
            
            <Row>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Prix (DA)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ex: 2500" 
                  value={wizardData.price} 
                  onChange={(e) => updateWizardData({ price: e.target.value })} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Stock disponible</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ex: 50" 
                  value={wizardData.stock} 
                  onChange={(e) => updateWizardData({ stock: e.target.value })} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </Col>
            </Row>
            
            <Form.Check 
              type="switch"
              id="wholesale-switch"
              label="Vente en gros (minimum de quantité)"
              checked={wizardData.wholesale}
              onChange={(e) => updateWizardData({ wholesale: e.target.checked })}
              className="mb-2"
              style={{ color: 'white' }}
            />
            
            {wizardData.wholesale && (
              <div className="mt-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Quantité minimum</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ex: 10" 
                  value={wizardData.minQuantity} 
                  onChange={(e) => updateWizardData({ minQuantity: e.target.value })} 
                  style={{ width: '150px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </div>
            )}
            
            <Form.Check 
              type="switch"
              id="pickup-switch"
              label="Retrait en magasin uniquement"
              checked={wizardData.pickupOnly}
              onChange={(e) => updateWizardData({ pickupOnly: e.target.checked })}
              className="mt-2"
              style={{ color: 'white' }}
            />
            
            <Form.Check 
              type="switch"
              id="delivery-switch"
              label="Livraison disponible"
              checked={wizardData.deliveryAvailable}
              onChange={(e) => updateWizardData({ deliveryAvailable: e.target.checked })}
              className="mt-2"
              style={{ color: 'white' }}
            />
            
            {wizardData.deliveryAvailable && (
              <div className="mt-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Frais de livraison (DA)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ex: 500" 
                  value={wizardData.deliveryCost} 
                  onChange={(e) => updateWizardData({ deliveryCost: e.target.value })} 
                  style={{ width: '150px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </div>
            )}
          </div>
          
          {/* Sección de ubicación */}
          <div className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h6 className="mb-3" style={{ color: '#667eea' }}>
              <GeoAlt className="me-2" /> Localisation
            </h6>
            
            <Row>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Wilaya *</label>
                <select 
                  className="form-select" 
                  value={selectedWilaya} 
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                >
                  <option value="">Sélectionnez une wilaya</option>
                  {wilayasList.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </Col>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Commune *</label>
                <select 
                  className="form-select" 
                  value={selectedCommune} 
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  disabled={!selectedWilaya}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                >
                  <option value="">Sélectionnez une commune</option>
                  {communesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Col>
            </Row>
          </div>
          
          {/* Sección de contacto */}
          <div className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <h6 className="mb-3" style={{ color: '#667eea' }}>
              <Telephone className="me-2" /> Contact
            </h6>
            
            <Row>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Téléphone</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="Ex: 0555 12 34 56" 
                  value={wizardData.phone} 
                  onChange={(e) => updateWizardData({ phone: e.target.value })} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </Col>
              <Col md={6} className="mb-3">
                <label className="form-label" style={{ color: 'white' }}>Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Ex: contact@boutique.com" 
                  value={wizardData.email} 
                  onChange={(e) => updateWizardData({ email: e.target.value })} 
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />
              </Col>
            </Row>
            <small className="text-muted">
              Au moins un moyen de contact (téléphone ou email) est requis
            </small>
          </div>
        </div>
      )}
      
      {/* Aperçu del video */}
      {wizardData.videoPreview && (
        <div className="mt-4 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Aperçu</label>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '200px', borderRadius: '8px' }} />
          <div className="mt-2 text-muted small">Durée: {Math.floor(wizardData.videoDuration / 60)}:{Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}</div>
        </div>
      )}
      
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
  
  const stepLabels = ['Vidéo', 'Musique', 'Infos'];
  
  return (
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-4">
          <div className="cw-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h3 className="cw-header-title" style={{ color: 'white', fontWeight: 'bold' }}>🎬 Nouvelle vidéo</h3>
              {!isProActive ? <Badge bg="warning" text="dark" className="p-2">⚡ {maxDuration}s max</Badge> : <Badge bg="primary" className="p-2">⭐ Pro: {maxDuration}s</Badge>}
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          </div>
          
          {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible style={{ borderRadius: '12px' }}>{error}</Alert>}
          
          <div className="cw-step-content mt-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />}
            {currentStep === 3 && renderStep3()}
          </div>
          
          <div className="cw-footer mt-4 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={prevStep} disabled={loading || submitting || currentStep === 1} style={{ borderRadius: '40px', padding: '10px 24px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <ArrowLeft className="me-2" /> Retour
            </Button>
            {currentStep < 3 ? (
              <Button variant="primary" onClick={nextStep} disabled={loading || (currentStep === 1 && !isStep1Valid)} style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', fontWeight: 'bold' }}>
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={submitting || !isStep3Valid} style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none', fontWeight: 'bold' }}>
                {submitting ? <><Spinner size="sm" className="me-2" /> Publication en cours...</> : <><CloudUpload className="me-2" /> Publier</>}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;