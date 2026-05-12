// EditVideoWizard.jsx - ACTUALIZADO (solo comerciales nuevos)
import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Estado del formulario (SOLO CAMPOS NUEVOS)
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
    selectedCategory: '',
    titre: '',
    description: '',
    // CAMPOS COMERCIALES NUEVOS
    isCommercial: false,
    saleType: '',
    address: '',
    mapUrl: ''
  });

  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;

  // Cargar categorías
  useEffect(() => {
    if (sliderCategories.length === 0) {
      dispatch(getSliderCategories());
    }
  }, [dispatch, sliderCategories.length]);

  // Cargar video existente
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);

  // Rellenar formulario con datos del video (mapeando campos antiguos a nuevos)
  useEffect(() => {
    if (video && !videoLoading) {
      console.log('📹 Édition vidéo:', video);

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

      let initialCategory = '';
      if (video.category) {
        initialCategory = typeof video.category === 'object' ? video.category._id : video.category;
      } else if (video.categories && Array.isArray(video.categories) && video.categories.length > 0) {
        initialCategory = typeof video.categories[0] === 'object' ? video.categories[0]._id : video.categories[0];
      }

      // Determinar si el video es comercial y mapear saleType desde campos antiguos
      let initialSaleType = video.saleType || '';
      if (!initialSaleType) {
        if (video.wholesale && video.price && video.price > 0) initialSaleType = 'both';
        else if (video.wholesale) initialSaleType = 'wholesale';
        else if (video.price && video.price > 0) initialSaleType = 'retail';
      }
      const isCommercialVideo = !!initialSaleType;

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
        isCommercial: isCommercialVideo,
        saleType: initialSaleType,
        address: video.address || '',
        mapUrl: video.mapUrl || ''
      });
    }
  }, [video, videoLoading]);

  const updateWizardData = useCallback((newData) => {
    setWizardData(prev => ({ ...prev, ...newData }));
    if (newData.videoFile) setKeepExistingVideo(false);
  }, []);

  // Validación de pasos
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
      case 2:
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

  // Envío de modificaciones
  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setUploadProgress(0);
    setError(null);

    try {
      let videoUrl, videoPublicId, thumbnail, videoDuration;

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

      // Preparar payload con los nuevos campos comerciales
      const isCommercial = !!wizardData.saleType;

      const payload = {
        nom_entreprise: wizardData.nom_entreprise,
        activite: wizardData.activite,
        titre: wizardData.titre,
        description: wizardData.description,
        category: wizardData.selectedCategory,
        videoUrl,
        videoPublicId,
        thumbnail,
        duration: videoDuration,
        music: musicData,
        isCommercial,
        saleType: wizardData.saleType || null,
        address: wizardData.address || '',
        mapUrl: wizardData.mapUrl || '',
        // Los campos antiguos ya no se envían
      };

      const res = await patchDataAPI(`videos/${id}`, payload, auth.token);
      if (res.data.success) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '✏️ Vidéo modifiée avec succès !' }
        });
        dispatch(getCategoriesWithVideos(1, 2));
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

  // Render paso 1 (sin cambios)
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

  // Render paso 3 (solo se actualiza la sección comercial)
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '0' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>📝 Détails de l'annonce</h5>

      {/* Nom entreprise */}
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

      {/* Activité */}
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

      {/* Catégorie */}
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

      {/* Titre */}
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

      {/* Section commerciale colapsable - ACTUALIZADA */}
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
            {/* NUEVOS CAMPOS COMERCIALES */}
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: 'white' }}>Type de vente</label>
              <select
                className="form-select"
                value={wizardData.saleType}
                onChange={(e) => updateWizardData({ saleType: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              >
                <option value="">Sélectionner (optionnel)</option>
                <option value="retail">Vente au détail</option>
                <option value="wholesale">Vente en gros</option>
                <option value="both">Vente au détail et en gros</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'white' }}>Adresse de la boutique</label>
              <input
                type="text"
                className="form-control"
                placeholder="Rue, numéro, ville, code postal"
                value={wizardData.address}
                onChange={(e) => updateWizardData({ address: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: 'white' }}>Carte (URL Google Maps)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://maps.google.com/..."
                value={wizardData.mapUrl}
                onChange={(e) => updateWizardData({ mapUrl: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Aperçu musique existante */}
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

  // Estados de carga
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