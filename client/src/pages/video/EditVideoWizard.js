// pages/video/EditVideoWizard.jsx - VERSIÓN COMPLETA CON CAMPOS COMERCIALES
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge, Form, Row, Col } from 'react-bootstrap';
import { 
  ArrowLeft, ArrowRight, CloudUpload, PencilFill, Trash, MusicNote,
  CashStack, GeoAlt, Telephone, Envelope, Building, Box, Tag
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { getVideoById  } from '../../redux/actions/videoAction';
import { getCategoriesWithVideos } from '../../redux/actions/categoryAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import { patchDataAPI } from '../../utils/fetchData';
import { getSliderCategories } from '../../redux/actions/categoryAction';
import './CreateVideoWizard.css';

const EditVideoWizard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { currentVideo: video, loading: videoLoading } = useSelector(state => state.video || {});
  const { sliderCategories = [] } = useSelector(state => state.category || {});
  const { user } = auth;
  
  // Estados del wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [keepExistingVideo, setKeepExistingVideo] = useState(true);
  
  // Datos del formulario
  const [wizardData, setWizardData] = useState({
    // Video
    videoSource: 'existing',
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    videoUrl: '',
    videoPublicId: '',
    thumbnail: '',
    // Música
    selectedMusic: null,
    musicVolume: 70,
    // Información básica
    title: '',
    description: '',
    category: '',
    // Comerciales
    isCommercial: false,
    price: 0,
    wholesale: false,
    minQuantity: 1,
    phone: '',
    phoneHidden: false,
    email: '',
    website: '',
    wilaya: '',
    commune: '',
    deliveryAvailable: false,
    deliveryCost: 0,
    pickupOnly: false,
    stock: 0
  });
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;
  
  // Cargar categorías si no están
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
  
  // Rellenar wizard con datos del video
  useEffect(() => {
    if (video && !videoLoading) {
      console.log('📹 Editando video:', video);
      
      // Extraer música existente
      let existingMusic = null;
      if (video.music) {
        existingMusic = {
          id: video.music.id,
          title: video.music.title,
          artist: video.music.artist || "Artiste inconnu",
          audioUrl: video.music.audioUrl,
          audioPublicId: video.music.audioPublicId,
          duration: video.music.duration,
          volume: video.music.volume || 70
        };
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
        title: video.title || '',
        description: video.description || '',
        category: video.category?._id || video.category || '',
        isCommercial: video.isCommercial || false,
        price: video.price || 0,
        wholesale: video.wholesale || false,
        minQuantity: video.minQuantity || 1,
        phone: video.phone || '',
        phoneHidden: video.phoneHidden || false,
        email: video.email || '',
        website: video.website || '',
        wilaya: video.wilaya || '',
        commune: video.commune || '',
        deliveryAvailable: video.delivery?.available || false,
        deliveryCost: video.delivery?.cost || 0,
        pickupOnly: video.pickupOnly || false,
        stock: video.stock?.available || 0
      });
    }
  }, [video, videoLoading]);
  
  const updateWizardData = useCallback((newData) => {
    setWizardData(prev => ({ ...prev, ...newData }));
    if (newData.videoFile) setKeepExistingVideo(false);
  }, []);
  
  // Validaciones por paso
  const validateStep = useCallback((step) => {
    switch(step) {
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
      case 3:
        if (!wizardData.title.trim()) {
          setError('Le titre est obligatoire');
          return false;
        }
        break;
      case 4:
        if (wizardData.isCommercial) {
          if (!wizardData.wilaya || !wizardData.commune) {
            setError('La wilaya et la commune sont obligatoires pour les vidéos commerciales');
            return false;
          }
          if (!wizardData.phone && !wizardData.email) {
            setError('Au moins un moyen de contact (téléphone ou email) est requis');
            return false;
          }
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
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo(0, 0);
    }
  }, [currentStep, validateStep]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  }, []);
  
  // Envío del formulario
  const handleSubmit = useCallback(async () => {
    if (!validateStep(3) || !validateStep(4)) return;
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      let videoUrl, videoPublicId, thumbnail, videoDuration;
      
      // Subir nuevo video si se cambió
      if (!keepExistingVideo && wizardData.videoFile) {
        console.log("📤 Subiendo nuevo video...");
        const result = await videoUpload(wizardData.videoFile, (progress) => {
          setUploadProgress(progress);
        });
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
      
      // Construir objeto música
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
      
      // Preparar datos para actualizar
      const videoData = {
        title: wizardData.title,
        description: wizardData.description,
        videoUrl,
        videoPublicId,
        thumbnail,
        duration: videoDuration,
        music: musicData,
        category: wizardData.category || null,
        isCommercial: wizardData.isCommercial,
        price: wizardData.price,
        wholesale: wizardData.wholesale,
        minQuantity: wizardData.minQuantity,
        phone: wizardData.phone,
        phoneHidden: wizardData.phoneHidden,
        email: wizardData.email,
        website: wizardData.website,
        wilaya: wizardData.wilaya,
        commune: wizardData.commune,
        delivery: {
          available: wizardData.deliveryAvailable,
          cost: wizardData.deliveryCost,
          estimatedDays: 3,
          zones: []
        },
        pickupOnly: wizardData.pickupOnly,
        stock: {
          total: wizardData.stock,
          available: wizardData.stock,
          reserved: 0
        }
      };
      
      const res = await patchDataAPI(`videos/${id}`, videoData, auth.token);
      
      if (res.data.success) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: '✏️ Vidéo modifiée avec succès !' }
        });
        // ✅ Recargar las categorías del home para que muestren el video actualizado
        dispatch(getCategoriesWithVideos(1, 2));
        history.push('/');
     
      } else {
        setError(res.data.message || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  }, [wizardData, keepExistingVideo, id, auth.token, dispatch, history, validateStep]);
  
  // ==================== RENDER PASOS ====================
  
  // Paso 1: Video
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
              <input type="file" id="videoInput" accept="video/mp4,video/quicktime,video/webm" style={{ display: 'none' }}
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
              <label htmlFor="videoInput" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', width: '70px', height: '70px', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', cursor: 'pointer' }}>
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
  
  // Paso 3: Información básica + categoría
  const renderStep3 = () => (
    <div style={{ padding: '20px' }}>
      <h5 style={{ color: 'white', fontWeight: 'bold' }} className="mb-4">📝 Informations générales</h5>
      <div className="mb-4">
        <label className="form-label text-white">Titre *</label>
        <input type="text" className="form-control form-control-lg" placeholder="Titre de la vidéo..."
          value={wizardData.title} onChange={e => updateWizardData({ title: e.target.value })} maxLength="100"
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }} />
        <small className="text-muted">{wizardData.title.length}/100</small>
      </div>
      <div className="mb-4">
        <label className="form-label text-white">Description</label>
        <textarea className="form-control" rows="4" placeholder="Description..."
          value={wizardData.description} onChange={e => updateWizardData({ description: e.target.value })} maxLength="500"
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', resize: 'none' }} />
        <small className="text-muted">{wizardData.description.length}/500</small>
      </div>
      <div className="mb-4">
        <label className="form-label text-white">Catégorie</label>
        <select className="form-select" value={wizardData.category} onChange={e => updateWizardData({ category: e.target.value })}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }}>
          <option value="">Sélectionner une catégorie</option>
          {sliderCategories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
  
  // Paso 4: Información comercial
  const renderStep4 = () => (
    <div style={{ padding: '20px' }}>
      <h5 style={{ color: 'white', fontWeight: 'bold' }} className="mb-4">🛒 Informations commerciales</h5>
      
      <Form.Check type="switch" id="isCommercial" label="✅ Vidéo commerciale" className="mb-4 text-white"
        checked={wizardData.isCommercial} onChange={e => updateWizardData({ isCommercial: e.target.checked })} />
      
      {wizardData.isCommercial && (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <label className="form-label text-white">Prix (DA)</label>
              <input type="number" className="form-control" value={wizardData.price} onChange={e => updateWizardData({ price: parseFloat(e.target.value) || 0 })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </Col>
            <Col md={6}>
              <label className="form-label text-white">Stock disponible</label>
              <input type="number" className="form-control" value={wizardData.stock} onChange={e => updateWizardData({ stock: parseInt(e.target.value) || 0 })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </Col>
          </Row>
          
          <Form.Check type="switch" id="wholesale" label="Vente en gros" className="mb-3 text-white"
            checked={wizardData.wholesale} onChange={e => updateWizardData({ wholesale: e.target.checked })} />
          
          {wizardData.wholesale && (
            <div className="mb-3">
              <label className="form-label text-white">Quantité minimale</label>
              <input type="number" className="form-control" value={wizardData.minQuantity} onChange={e => updateWizardData({ minQuantity: parseInt(e.target.value) || 1 })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </div>
          )}
          
          <Row className="mb-3">
            <Col md={6}>
              <label className="form-label text-white">Wilaya</label>
              <input type="text" className="form-control" placeholder="Ex: Alger" value={wizardData.wilaya} onChange={e => updateWizardData({ wilaya: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </Col>
            <Col md={6}>
              <label className="form-label text-white">Commune</label>
              <input type="text" className="form-control" placeholder="Ex: Sidi M'Hamed" value={wizardData.commune} onChange={e => updateWizardData({ commune: e.target.value })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </Col>
          </Row>
          
          <div className="mb-3">
            <label className="form-label text-white">Téléphone</label>
            <input type="tel" className="form-control" value={wizardData.phone} onChange={e => updateWizardData({ phone: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            <Form.Check type="checkbox" id="phoneHidden" label="Masquer le numéro" className="mt-1 text-white-50"
              checked={wizardData.phoneHidden} onChange={e => updateWizardData({ phoneHidden: e.target.checked })} />
          </div>
          
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input type="email" className="form-control" value={wizardData.email} onChange={e => updateWizardData({ email: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
          </div>
          
          <div className="mb-3">
            <label className="form-label text-white">Site web (optionnel)</label>
            <input type="url" className="form-control" value={wizardData.website} onChange={e => updateWizardData({ website: e.target.value })}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
          </div>
          
          <Form.Check type="switch" id="deliveryAvailable" label="Livraison disponible" className="mb-2 text-white"
            checked={wizardData.deliveryAvailable} onChange={e => updateWizardData({ deliveryAvailable: e.target.checked })} />
          {wizardData.deliveryAvailable && (
            <div className="mb-3">
              <label className="form-label text-white">Frais de livraison (DA)</label>
              <input type="number" className="form-control" value={wizardData.deliveryCost} onChange={e => updateWizardData({ deliveryCost: parseFloat(e.target.value) || 0 })}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }} />
            </div>
          )}
          
          <Form.Check type="switch" id="pickupOnly" label="Retrait en magasin uniquement" className="mb-3 text-white"
            checked={wizardData.pickupOnly} onChange={e => updateWizardData({ pickupOnly: e.target.checked })} />
        </>
      )}
      
      {/* Resumen de música actual */}
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
  
  const stepLabels = ['Vidéo', 'Musique', 'Infos', 'Commercial'];
  
  // Estados de carga
  if (videoLoading && !video) {
    return (
      <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '16px' }}>
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
      <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '16px' }}>
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
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '16px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0" style={{ color: 'white', fontWeight: 'bold' }}>
                <PencilFill className="me-2" /> Modifier la vidéo
              </h3>
              <small className="text-muted">{video?.title}</small>
            </div>
            <Badge bg={isProActive ? 'primary' : 'warning'} className="p-2">
              {isProActive ? `⭐ Pro: ${maxDuration}s` : `⚡ ${maxDuration}s max`}
            </Badge>
          </div>
          
          <StepIndicator currentStep={currentStep} totalSteps={4} labels={stepLabels} />
          
          {error && <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>{error}</Alert>}
          
          <div className="mt-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && (
              <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />
            )}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
          
          <div className="mt-4 pt-3 d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={currentStep === 1 ? () => history.push('/') : prevStep} disabled={loading}
              style={{ borderRadius: '40px', padding: '10px 24px' }}>
              <ArrowLeft className="me-2" /> {currentStep === 1 ? 'Annuler' : 'Retour'}
            </Button>
            {currentStep < 4 ? (
              <Button variant="primary" onClick={nextStep} disabled={loading}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}>
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button variant="success" onClick={handleSubmit} disabled={loading}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}>
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