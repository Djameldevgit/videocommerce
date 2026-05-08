// components/Video/CreateVideoWizard.jsx - VERSION FINAL CON CATEGORÍA ÚNICA
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CloudUpload, Image, Camera, X, Tag, Building, ChevronDown, ChevronUp, GeoAlt, Telephone, Envelope } from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { createVideo } from '../../redux/actions/videoAction';
import { getSliderCategories } from '../../redux/actions/categoryAction';
import { videoUpload } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import './CreateVideoWizard.css';

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { user } = auth;

  const { sliderCategories = [], sliderLoading = false } = useSelector((state) => state.category || {});

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);

  const [showCommercial, setShowCommercial] = useState(false);

  // Wilayas
  const [wilayasList, setWilayasList] = useState([]);
  const [communesList, setCommunesList] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');

  // Estado principal
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
    // Champs obligatoires (FR)
    nom_entreprise: '',
    activite: '',
    category: '',            // ✅ UNIQUE category ID
    titre: '',
    description: '',
    // Champs commerciaux (optionnels)
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

  // Charger catégories
  useEffect(() => {
    if (sliderCategories.length === 0 && !sliderLoading) {
      dispatch(getSliderCategories());
    }
  }, [dispatch, sliderCategories.length, sliderLoading]);

  // Wilayas
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

  const getCommunesByWilaya = (wilaya) => {
    const map = {
      'Alger': ['Sidi M\'Hamed', 'El Biar', 'Bouzareah', 'Kouba', 'Bab El Oued', 'Hydra', 'Ben Aknoun'],
      'Oran': ['Oran Centre', 'Es Sénia', 'Bir El Djir', 'Mers El Kébir', 'El Hamri'],
      'Constantine': ['Constantine Centre', 'El Khroub', 'Aïn Smara', 'Zighoud Youcef'],
      'Annaba': ['Annaba Centre', 'El Bouni', 'Seraïdi', 'Berrahal'],
      'Tizi Ouzou': ['Tizi Ouzou Centre', 'Azazga', 'Beni Douala', 'Boghni']
    };
    return map[wilaya] || ['Centre-ville', 'Bordj', 'Cité'];
  };

  useEffect(() => {
    if (selectedWilaya) {
      setCommunesList(getCommunesByWilaya(selectedWilaya));
      setWizardData(prev => ({ ...prev, wilaya: selectedWilaya }));
    }
  }, [selectedWilaya]);

  useEffect(() => {
    setWizardData(prev => ({ ...prev, commune: selectedCommune }));
  }, [selectedCommune]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (wizardData.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(wizardData.videoPreview);
    };
  }, [wizardData.videoPreview]);

  useEffect(() => {
    const handleStopAudio = () => {
      document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
    handleStopAudio();
    return () => handleStopAudio();
  }, [currentStep]);

  const isStep1Valid = useMemo(() => {
    return wizardData.videoSource && wizardData.videoUrl && wizardData.videoDuration <= maxDuration;
  }, [wizardData.videoSource, wizardData.videoUrl, wizardData.videoDuration, maxDuration]);

  const isStep3Valid = useMemo(() => {
    return wizardData.nom_entreprise.trim().length > 0 &&
           wizardData.activite.trim().length > 0 &&
           wizardData.category.length > 0 &&
           wizardData.titre.trim().length > 0;
  }, [wizardData.nom_entreprise, wizardData.activite, wizardData.category, wizardData.titre]);

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
    if (wizardData.videoPreview?.startsWith('blob:')) URL.revokeObjectURL(wizardData.videoPreview);
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
      setError('Veuillez remplir tous les champs obligatoires (Nom entreprise, Activité, Catégorie, Titre)');
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

    const hasCommercialData = !!(wizardData.price || wizardData.phone || wizardData.email || wizardData.wilaya || wizardData.stock);
    const isCommercial = hasCommercialData;

    const payload = {
      nom_entreprise: wizardData.nom_entreprise,
      activite: wizardData.activite,
      titre: wizardData.titre,
      description: wizardData.description,
      category: wizardData.category,           // ✅ UNIQUE ID
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
      isCommercial,
      price: wizardData.price ? parseFloat(wizardData.price) : 0,
      wholesale: wizardData.wholesale,
      minQuantity: wizardData.wholesale ? (wizardData.minQuantity || 1) : 1,
      phone: wizardData.phone,
      email: wizardData.email,
      wilaya: wizardData.wilaya,
      commune: wizardData.commune,
      pickupOnly: wizardData.pickupOnly,
      delivery: {
        available: wizardData.deliveryAvailable,
        cost: wizardData.deliveryCost ? parseFloat(wizardData.deliveryCost) : 0,
        estimatedDays: 2,
        zones: wizardData.wilaya ? [wizardData.wilaya] : []
      },
      stock: {
        total: wizardData.stock ? parseInt(wizardData.stock) : 0,
        available: wizardData.stock ? parseInt(wizardData.stock) : 0,
        reserved: 0
      },
      tags: wizardData.wilaya ? [wizardData.wilaya, wizardData.commune, wizardData.wholesale ? 'gros' : 'détail'] : []
    };

    try {
      const res = await dispatch(createVideo(payload, auth.token));
      if (res?.success) {
        const isAdmin = auth.user?.role === 'admin';
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: isAdmin ? '✅ Vidéo publiée !' : '📹 Vidéo envoyée, en attente d\'approbation.' } });
        history.push('/');
      } else {
        setError(res?.message || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau, veuillez réessayer');
    } finally {
      setSubmitting(false);
    }
  };

  // RENDER STEP 1
  const renderStep1 = () => (
    <div className="step1-container" style={{ padding: '0 8px', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '20px', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleGallerySelect} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Image size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Galerie</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button type="button" onClick={handleCameraSelect} style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', border: 'none', borderRadius: '60px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Camera size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Caméra</div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, false)} />
      <input type="file" ref={cameraInputRef} accept="video/mp4,video/quicktime/video/webm" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFileChange(e, true)} />
      
      {loading && uploadProgress > 0 && (
        <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated className="mt-3" style={{ borderRadius: '20px', height: '6px' }} />
      )}
      
      {wizardData.videoPreview && (
        <div className="video-preview-full" style={{ marginTop: '15px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
          <Badge bg="dark" style={{ position: 'absolute', bottom: '8px', right: '8px', opacity: 0.8 }}>⏱️ {Math.floor(wizardData.videoDuration)}s</Badge>
          <Button variant="danger" size="sm" style={{ position: 'absolute', top: '8px', right: '8px', borderRadius: '30px' }} onClick={clearVideo}>
            <X size={14} className="me-1" /> Changer
          </Button>
        </div>
      )}
      
      {!wizardData.videoPreview && !loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', marginTop: '15px', minHeight: '250px', color: '#fff', textAlign: 'center' }}>
          <div>
            <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <p>Sélectionnez une vidéo depuis<br />votre galerie ou votre caméra</p>
            <small style={{ opacity: 0.6 }}>Max {maxDuration} secondes</small>
          </div>
        </div>
      )}
    </div>
  );

  // RENDER STEP 3 (infos)
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '0' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>📝 Détails de l'annonce</h5>

      {/* 1. Nom entreprise */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: 'white' }}>Nom de l'entreprise *</label>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Ex: Boutique Lina"
          value={wizardData.nom_entreprise}
          onChange={(e) => updateWizardData({ nom_entreprise: e.target.value })}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }}
        />
      </div>

      {/* 2. Activité */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: 'white' }}>Activité *</label>
        <textarea
          rows="2"
          className="form-control"
          placeholder="Ex: Vente de vêtements de mode pour femmes et hommes"
          value={wizardData.activite}
          onChange={(e) => updateWizardData({ activite: e.target.value })}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', resize: 'vertical' }}
        />
      </div>

      {/* 3. Catégorie unique (select) */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: 'white' }}>Catégorie *</label>
        <select
          className="form-select"
          value={wizardData.category}
          onChange={(e) => updateWizardData({ category: e.target.value })}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }}
          required
        >
          <option value="">Sélectionnez une catégorie</option>
          {sliderCategories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        <small className="text-muted mt-1 d-block">Choisissez la catégorie principale de votre annonce</small>
      </div>

      {/* 4. Titre */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: 'white' }}>Titre *</label>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Ex: Nouveaux vêtements en gros - Qualité premium"
          value={wizardData.titre}
          onChange={(e) => updateWizardData({ titre: e.target.value })}
          maxLength="100"
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }}
        />
        <small className="text-muted">{wizardData.titre.length}/100</small>
      </div>

      {/* Description (optionnelle) */}
      <div className="mb-3">
        <label className="form-label" style={{ color: 'white' }}>Description (optionnelle)</label>
        <textarea
          rows="3"
          className="form-control"
          placeholder="Décrivez votre produit ou service..."
          value={wizardData.description}
          onChange={(e) => updateWizardData({ description: e.target.value })}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', resize: 'vertical' }}
        />
      </div>

      {/* Section commerciale colapsable */}
      <div className="mt-4">
        <Button
          variant="outline-light"
          onClick={() => setShowCommercial(!showCommercial)}
          className="w-100 d-flex justify-content-between align-items-center"
          style={{ borderRadius: '40px', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)' }}
        >
          <span><Tag className="me-2" /> Informations commerciales (optionnel)</span>
          {showCommercial ? <ChevronUp /> : <ChevronDown />}
        </Button>

        {showCommercial && (
          <div className="mt-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', animation: 'fadeIn 0.3s ease' }}>
            <Row>
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Prix (DA)</label>
                <input type="number" className="form-control" placeholder="Ex: 2500"
                  value={wizardData.price} onChange={(e) => updateWizardData({ price: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Stock disponible</label>
                <input type="number" className="form-control" placeholder="Ex: 50"
                  value={wizardData.stock} onChange={(e) => updateWizardData({ stock: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
            </Row>

            <Form.Check type="switch" id="wholesale" label="Vente en gros (quantité minimale)"
              checked={wizardData.wholesale} onChange={(e) => updateWizardData({ wholesale: e.target.checked })}
              className="mb-2" style={{ color: 'white' }} />
            {wizardData.wholesale && (
              <div className="mb-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Quantité minimum</label>
                <input type="number" className="form-control" style={{ width: '150px',background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                  value={wizardData.minQuantity} onChange={(e) => updateWizardData({ minQuantity: e.target.value })}
  />
              </div>
            )}

            <Row className="mt-2">
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Téléphone</label>
                <input type="tel" className="form-control" placeholder="0555 12 34 56"
                  value={wizardData.phone} onChange={(e) => updateWizardData({ phone: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Email</label>
                <input type="email" className="form-control" placeholder="contact@boutique.com"
                  value={wizardData.email} onChange={(e) => updateWizardData({ email: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
            </Row>

            <Row className="mt-2">
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Wilaya</label>
                <select className="form-select" value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                  <option value="">Sélectionnez</option>
                  {wilayasList.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </Col>
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Commune</label>
                <select className="form-select" value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)} disabled={!selectedWilaya}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
                  <option value="">Sélectionnez</option>
                  {communesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Col>
            </Row>

            <Form.Check type="switch" id="pickup" label="Retrait en magasin uniquement"
              checked={wizardData.pickupOnly} onChange={(e) => updateWizardData({ pickupOnly: e.target.checked })}
              className="mt-2" style={{ color: 'white' }} />
            <Form.Check type="switch" id="delivery" label="Livraison disponible"
              checked={wizardData.deliveryAvailable} onChange={(e) => updateWizardData({ deliveryAvailable: e.target.checked })}
              className="mt-2" style={{ color: 'white' }} />
            {wizardData.deliveryAvailable && (
              <div className="mt-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Frais de livraison (DA)</label>
                <input type="number" className="form-control" style={{ width: '150px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white'}}
                  value={wizardData.deliveryCost} onChange={(e) => updateWizardData({ deliveryCost: e.target.value })}
 />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aperçu vidéo */}
      {wizardData.videoPreview && (
        <div className="mt-4 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Aperçu vidéo</label>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '180px', borderRadius: '8px' }} />
          <div className="mt-2 text-muted small">Durée: {Math.floor(wizardData.videoDuration / 60)}:{Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}</div>
        </div>
      )}
    </div>
  );

  const stepLabels = ['Vidéo', 'Musique', 'Infos'];

  return (
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '12px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-3">
          <div className="cw-header px-2 pt-2 pb-0">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h3 className="cw-header-title" style={{ color: 'white', fontWeight: 'bold' }}>🎬 Nouvelle vidéo</h3>
              {!isProActive ? <Badge bg="warning" text="dark" className="p-2">⚡ {maxDuration}s max</Badge> : <Badge bg="primary" className="p-2">⭐ Pro: {maxDuration}s</Badge>}
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          </div>

          <div className="cw-step-content px-2 mt-3">
            {error && <Alert variant="danger" className="mt-2" onClose={() => setError(null)} dismissible style={{ borderRadius: '12px' }}>{error}</Alert>}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className="cw-footer mt-3 p-3 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={prevStep} disabled={loading || submitting || currentStep === 1} style={{ borderRadius: '40px', padding: '8px 20px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              <ArrowLeft className="me-2" /> Retour
            </Button>
            {currentStep < 3 ? (
              <Button variant="primary" onClick={nextStep} disabled={loading || (currentStep === 1 && !isStep1Valid)} style={{ borderRadius: '40px', padding: '8px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', fontWeight: 'bold' }}>
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={submitting || !isStep3Valid} style={{ borderRadius: '40px', padding: '8px 20px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none', fontWeight: 'bold' }}>
                {submitting ? <><Spinner size="sm" className="me-2" /> Publication...</> : <><CloudUpload className="me-2" /> Publier</>}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateVideoWizard;