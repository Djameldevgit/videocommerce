// pages/video/EditVideoWizard.jsx - VERSION FINALE (FR, 3 étapes, champs obligatoires nom_entreprise/activite/catégories/titre)
import React, { useState, useEffect, useCallback,  useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge, Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CloudUpload, PencilFill, Trash, MusicNote, ChevronDown, ChevronUp, Tag } from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { getVideoById } from '../../redux/actions/videoAction';
import { getCategoriesWithVideos, getSliderCategories } from '../../redux/actions/categoryAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import { patchDataAPI } from '../../utils/fetchData';
import './CreateVideoWizard.css';


const EditVideoWizard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { currentVideo: video, loading: videoLoading } = useSelector(state => state.video || {});
  const { sliderCategories = [] } = useSelector(state => state.category || {});
  const { user } = auth;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [keepExistingVideo, setKeepExistingVideo] = useState(true);
  const [showCommercial, setShowCommercial] = useState(false);

  // États du formulaire (une seule catégorie)
  const [wizardData, setWizardData] = useState({
    // Vidéo
    videoSource: 'existing',
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    videoUrl: '',
    videoPublicId: '',
    thumbnail: '',
    // Musique
    selectedMusic: null,
    musicVolume: 70,
    originalAudio: true,
    // Champs obligatoires (Step 3)
    nom_entreprise: '',
    activite: '',
    selectedCategory: '',        // ✅ UNIQUE category ID
    titre: '',
    description: '',
    // Champs commerciaux optionnels
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

  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;

  // Charger catégories
  useEffect(() => {
    if (sliderCategories.length === 0) {
      dispatch(getSliderCategories());
    }
  }, [dispatch, sliderCategories.length]);

  // Charger la vidéo existante
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);

  // Remplir le formulaire avec les données de la vidéo
  useEffect(() => {
    if (video && !videoLoading) {
      console.log('📹 Édition vidéo:', video);

      // Musique existante
      let existingMusic = null;
      if (video.music) {
        existingMusic = {
          id: video.music.id,
          title: video.music.title,
          artist: video.music.artist || 'Artiste inconnu',
          audioUrl: video.music.audioUrl,
          audioPublicId: video.music.audioPublicId,
          duration: video.music.duration,
          volume: video.music.volume || 70
        };
      }

      // ✅ Récupérer la catégorie unique (si ancien video.category ou video.categories[0])
      let initialCategory = '';
      if (video.category) {
        initialCategory = typeof video.category === 'object' ? video.category._id : video.category;
      } else if (video.categories && Array.isArray(video.categories) && video.categories.length > 0) {
        initialCategory = typeof video.categories[0] === 'object' ? video.categories[0]._id : video.categories[0];
      }

      setWizardData({
        videoSource: 'existing',
        videoFile: null,
        videoPreview: video.videoUrl,
        videoDuration: video.duration || 0,
        videoUrl: video.videoUrl,
        videoPublicId: video.videoPublicId,
        thumbnail: video.thumbnail,
        selectedMusic: existingMusic,
        musicVolume: existingMusic?.volume || 70,
        nom_entreprise: video.nom_entreprise || '',
        activite: video.activite || '',
        selectedCategory: initialCategory,
        titre: video.titre || video.title || '',
        description: video.description || '',
        price: video.price || '',
        wholesale: video.wholesale || false,
        minQuantity: video.minQuantity || 1,
        phone: video.phone || '',
        email: video.email || '',
        wilaya: video.wilaya || '',
        commune: video.commune || '',
        pickupOnly: video.pickupOnly || false,
        deliveryAvailable: video.delivery?.available || false,
        deliveryCost: video.delivery?.cost || 0,
        stock: video.stock?.available || 0
      });
    }
  }, [video, videoLoading]);

  const updateWizardData = useCallback((newData) => {
    setWizardData(prev => ({ ...prev, ...newData }));
    if (newData.videoFile) setKeepExistingVideo(false);
  }, []);

  // Validation des étapes
  const validateStep = useCallback((step) => {
    switch (step) {
      case 1:
        if (!keepExistingVideo && !wizardData.videoFile) {
          setError('Veuillez sélectionner une nouvelle vidéo');
          return false;
        }
        if (!keepExistingVideo && wizardData.videoDuration > maxDuration) {
          setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
          return false;
        }
        break;
      case 2: // Musique - toujours valide
        break;
      case 3:
        if (!wizardData.nom_entreprise.trim()) {
          setError('Le nom de l\'entreprise est obligatoire');
          return false;
        }
        if (!wizardData.activite.trim()) {
          setError('L\'activité est obligatoire');
          return false;
        }
        if (!wizardData.selectedCategory) {
          setError('Veuillez sélectionner une catégorie');
          return false;
        }
        if (!wizardData.titre.trim()) {
          setError('Le titre est obligatoire');
          return false;
        }
        break;
      default:
        break;
    }
    setError(null);
    return true;
  }, [keepExistingVideo, wizardData, maxDuration]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  }, []);

  // Soumettre les modifications
  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      let videoUrl, videoPublicId, thumbnail, videoDuration;

      // Upload nouvelle vidéo si changée
      if (!keepExistingVideo && wizardData.videoFile) {
        const result = await videoUpload(wizardData.videoFile, (progress) => setUploadProgress(progress));
        videoUrl = result.url;
        videoPublicId = result.public_id;
        thumbnail = result.thumbnail;
        videoDuration = wizardData.videoDuration;
      } else {
        videoUrl = wizardData.videoUrl;
        videoPublicId = wizardData.videoPublicId;
        thumbnail = wizardData.thumbnail;
        videoDuration = wizardData.videoDuration;
      }

      // Musique
      let musicData = null;
      if (wizardData.selectedMusic) {
        musicData = {
          id: wizardData.selectedMusic.id,
          title: wizardData.selectedMusic.title,
          artist: wizardData.selectedMusic.artist,
          audioUrl: wizardData.selectedMusic.audioUrl,
          audioPublicId: wizardData.selectedMusic.audioPublicId,
          duration: wizardData.selectedMusic.duration,
          volume: wizardData.musicVolume
        };
      }

      // Préparer le payload (catégorie unique)
      const hasCommercialData = !!(wizardData.price || wizardData.phone || wizardData.email || wizardData.wilaya || wizardData.stock);
      const isCommercial = hasCommercialData;

      const payload = {
        nom_entreprise: wizardData.nom_entreprise,
        activite: wizardData.activite,
        titre: wizardData.titre,
        description: wizardData.description,
        category: wizardData.selectedCategory,   // ✅ UNIQUE ID
        videoUrl,
        videoPublicId,
        thumbnail,
        duration: videoDuration,
        music: musicData,
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

      const res = await patchDataAPI(`videos/${id}`, payload, auth.token);
      if (res.data.success) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '✏️ Vidéo modifiée avec succès !' }
        });
        dispatch(getCategoriesWithVideos(1, 2)); // refresh home
        history.push('/');
      } else {
        setError(res.data.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.response?.data?.message || err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  }, [wizardData, keepExistingVideo, id, auth.token, dispatch, history, validateStep]);

  // ==================== RENDER DES ÉTAPES ====================

  // Étape 1 : Vidéo (identique)
  const renderStep1 = () => (
    <div style={{ padding: '0 8px' }}>
      {keepExistingVideo && video && (
        <div className="mb-4" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 style={{ color: 'white', margin: 0 }}>📹 Vidéo actuelle</h6>
            <Button variant="outline-danger" size="sm" onClick={() => setKeepExistingVideo(false)}>
              <Trash size={14} className="me-1" /> Changer
            </Button>
          </div>
          <video src={video.videoUrl} controls style={{ width: '100%', maxHeight: '300px', borderRadius: '12px' }} poster={video.thumbnail} />
          <div className="mt-2 text-muted small">Durée: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</div>
        </div>
      )}

      {!keepExistingVideo && (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <input type="file" id="editVideoInput" accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    const vid = document.createElement('video');
                    vid.preload = 'metadata';
                    vid.onloadedmetadata = () => {
                      const dur = vid.duration;
                      if (dur > maxDuration) {
                        setError(`Durée max ${maxDuration}s`);
                        URL.revokeObjectURL(previewUrl);
                        return;
                      }
                      updateWizardData({ videoFile: file, videoPreview: previewUrl, videoDuration: dur });
                      setError(null);
                    };
                    vid.src = URL.createObjectURL(file);
                  }
                }}
              />
              <label htmlFor="editVideoInput" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', width: '70px', height: '70px', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer' }}>
                <CloudUpload size={36} color="white" />
              </label>
              <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Nouvelle vidéo</div>
            </div>
          </div>
          {wizardData.videoPreview && (
            <div style={{ position: 'relative', marginTop: '20px' }}>
              <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '400px', borderRadius: '12px' }} />
              <Button variant="outline-danger" size="sm" style={{ position: 'absolute', top: '10px', right: '10px', borderRadius: '30px' }}
                onClick={() => { updateWizardData({ videoFile: null, videoPreview: null, videoDuration: 0 }); setKeepExistingVideo(true); }}>Annuler</Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Étape 3 : Infos avec sélecteur de catégorie unique
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
          value={wizardData.selectedCategory}
          onChange={(e) => updateWizardData({ selectedCategory: e.target.value })}
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

            <Form.Check type="switch" id="editWholesale" label="Vente en gros (quantité minimale)"
              checked={wizardData.wholesale} onChange={(e) => updateWizardData({ wholesale: e.target.checked })}
              className="mb-2" style={{ color: 'white' }} />
            {wizardData.wholesale && (
              <div className="mb-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Quantité minimum</label>
                <input type="number" className="form-control" style={{ width: '150px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                  value={wizardData.minQuantity} onChange={(e) => updateWizardData({ minQuantity: e.target.value })} />
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
                <input type="text" className="form-control" placeholder="Ex: Alger"
                  value={wizardData.wilaya} onChange={(e) => updateWizardData({ wilaya: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
              <Col md={6} className="mb-2">
                <label className="form-label" style={{ color: 'white' }}>Commune</label>
                <input type="text" className="form-control" placeholder="Ex: Sidi M'Hamed"
                  value={wizardData.commune} onChange={(e) => updateWizardData({ commune: e.target.value })}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
              </Col>
            </Row>

            <Form.Check type="switch" id="editPickup" label="Retrait en magasin uniquement"
              checked={wizardData.pickupOnly} onChange={(e) => updateWizardData({ pickupOnly: e.target.checked })}
              className="mt-2" style={{ color: 'white' }} />
            <Form.Check type="switch" id="editDelivery" label="Livraison disponible"
              checked={wizardData.deliveryAvailable} onChange={(e) => updateWizardData({ deliveryAvailable: e.target.checked })}
              className="mt-2" style={{ color: 'white' }} />
            {wizardData.deliveryAvailable && (
              <div className="mt-2 ms-4">
                <label className="form-label" style={{ color: 'white' }}>Frais de livraison (DA)</label>
                <input type="number" className="form-control" style={{ width: '150px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                  value={wizardData.deliveryCost} onChange={(e) => updateWizardData({ deliveryCost: e.target.value })} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aperçu musique si existante */}
      {wizardData.selectedMusic && (
        <div className="mt-4 p-3" style={{ background: 'rgba(102,126,234,0.2)', borderRadius: '12px' }}>
          <div className="d-flex align-items-center gap-2">
            <MusicNote style={{ color: '#667eea' }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>{wizardData.selectedMusic.title}</div>
              <small style={{ color: '#aaa' }}>{wizardData.selectedMusic.artist} • Volume: {wizardData.musicVolume}%</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const stepLabels = ['Vidéo', 'Musique', 'Infos'];

  // États de chargement
  if (videoLoading && !video) {
    return (
      <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '12px' }}>
        <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Card.Body className="p-5 text-center">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-white">Chargement de la vidéo...</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  if (!video && !videoLoading) {
    return (
      <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '12px' }}>
        <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Card.Body className="p-5 text-center">
            <p className="text-white">Vidéo non trouvée</p>
            <Button onClick={() => history.push('/')}>Retour</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '12px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h3 className="mb-0" style={{ color: 'white', fontWeight: 'bold' }}>
                <PencilFill className="me-2" /> Modifier la vidéo
              </h3>
              <small className="text-muted">{video?.titre || video?.title}</small>
            </div>
            <Badge bg={isProActive ? 'primary' : 'warning'} className="p-2">
              {isProActive ? `⭐ Pro: ${maxDuration}s` : `⚡ ${maxDuration}s max`}
            </Badge>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />

          {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>{error}</Alert>}

          <div className="mt-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && (
              <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />
            )}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className="mt-4 pt-3 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={currentStep === 1 ? () => history.push('/') : prevStep} disabled={loading}
              style={{ borderRadius: '40px', padding: '8px 20px' }}>
              <ArrowLeft className="me-2" /> {currentStep === 1 ? 'Annuler' : 'Retour'}
            </Button>
            {currentStep < 3 ? (
              <Button variant="primary" onClick={nextStep} disabled={loading}
                style={{ borderRadius: '40px', padding: '8px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={loading}
                style={{ borderRadius: '40px', padding: '8px 20px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}>
                {loading ? (
                  <><Spinner size="sm" className="me-2" /> {uploadProgress > 0 ? `Upload ${uploadProgress}%...` : 'Mise à jour...'}</>
                ) : (
                  <><CloudUpload className="me-2" /> Mettre à jour</>
                )}
              </Button>
            )}
          </div>
          {loading && uploadProgress > 0 && <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated className="mt-3" />}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditVideoWizard;