// CreateVideoWizard.jsx - VERSIÓN CON LÍMITE DE 1 VÍDEO PARA CANALES TRIAL
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { 
  ArrowLeft, ArrowRight, CloudUpload, Image, Camera, X, Tag, 
  ChevronDown, ChevronUp, Building, Folder2, MusicNoteBeamed 
} from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { createVideo } from '../../redux/actions/videoAction';
import { getSliderCategories } from '../../redux/actions/categoryAction';
import { getMyChannels } from '../../redux/actions/channelAction';
import { getUserVideos } from '../../redux/actions/videoAction'; // ← NUEVO
import { videoUpload } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import './CreateVideoWizard.css';

const CreateVideoWizard = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { user } = auth;

  const { sliderCategories = [], sliderLoading = false } = useSelector((state) => state.category || {});
  const { userChannels = [], loading: channelsLoading } = useSelector((state) => state.channel || {});
  const { userVideos } = useSelector((state) => state.video || { userVideos: { videos: [], loading: false } }); // ← NUEVO

  // Estados
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const isMountedRef = useRef(true);
  const [showCommercial, setShowCommercial] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const selectedChannel = userChannels.find(ch => ch._id === selectedChannelId);
  
  // Refs para evitar bucles
  const hasLoadedChannelsRef = useRef(false);
  const hasLoadedCategoriesRef = useRef(false);
  const hasLoadedUserVideosRef = useRef(false);
  
  const [isChannelPending, setIsChannelPending] = useState(false);
  const [videoCountForSelectedChannel, setVideoCountForSelectedChannel] = useState(0); // ← NUEVO
  const [isTrialLimitReached, setIsTrialLimitReached] = useState(false); // ← NUEVO

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
    titre: '',
    description: '',
    category: '',
    saleType: '',
    address: '',
    mapUrl: ''
  });

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const maxDuration = 60;

  // ============================================
  // CARGAR VIDEOS DEL USUARIO (si no están cargados)
  // ============================================
  useEffect(() => {
    if (auth.token && !hasLoadedUserVideosRef.current && (!userVideos || userVideos.videos?.length === 0)) {
      hasLoadedUserVideosRef.current = true;
      dispatch(getUserVideos(auth.user?._id, 'all', 1, 100));
    }
  }, [auth.token, auth.user?._id, dispatch, userVideos]);

  // ============================================
  // CONTAR VIDEOS DEL CANAL SELECCIONADO
  // ============================================
  useEffect(() => {
    if (!selectedChannelId || !userVideos?.videos) {
      setVideoCountForSelectedChannel(0);
      setIsTrialLimitReached(false);
      return;
    }

    const videosOfChannel = userVideos.videos.filter(v => v.channel?._id === selectedChannelId || v.channel === selectedChannelId);
    const count = videosOfChannel.length;
    setVideoCountForSelectedChannel(count);

    // Si el canal es de prueba y ya tiene al menos 1 video, alcanzó el límite
    if (selectedChannel?.trialChannel === true && count >= 1) {
      setIsTrialLimitReached(true);
      if (!error) setError('⛔ Vous avez déjà une vidéo sur ce canal d\'essai. Pour ajouter plus de vidéos, souscrivez un plan payant.');
    } else {
      setIsTrialLimitReached(false);
      if (error?.includes('canal d\'essai')) setError(null);
    }
  }, [selectedChannelId, userVideos, selectedChannel, error]);

  // Efecto para canal pendiente (ya existente)
  useEffect(() => {
    if (selectedChannel) {
      setIsChannelPending(selectedChannel.pendiente === true);
    } else if (userChannels.length > 0 && !selectedChannelId) {
      const firstChannel = userChannels[0];
      setIsChannelPending(firstChannel.pendiente === true);
    } else {
      setIsChannelPending(false);
    }
  }, [selectedChannel, userChannels, selectedChannelId]);

  // Cargar categorías (existente)
  useEffect(() => {
    if (sliderCategories.length === 0 && !sliderLoading && !hasLoadedCategoriesRef.current) {
      hasLoadedCategoriesRef.current = true;
      dispatch(getSliderCategories());
    }
  }, [dispatch, sliderCategories.length, sliderLoading]);

  // Cargar canales (existente)
  useEffect(() => {
    if (auth.token && userChannels.length === 0 && !channelsLoading && !hasLoadedChannelsRef.current) {
      hasLoadedChannelsRef.current = true;
      dispatch(getMyChannels(auth.token));
    }
  }, [auth.token, dispatch, userChannels.length, channelsLoading]);

  // Auto-seleccionar categoría (existente)
  useEffect(() => {
    if (selectedChannelId && selectedChannel?.activity) {
      const matchedCategory = sliderCategories.find(cat => 
        cat.name.toLowerCase() === selectedChannel.activity.toLowerCase() ||
        cat.slug === selectedChannel.activity.toLowerCase()
      );
      if (matchedCategory) {
        setWizardData(prev => ({ ...prev, category: matchedCategory._id }));
      } else {
        setWizardData(prev => ({ ...prev, category: selectedChannel.activity }));
      }
    }
  }, [selectedChannelId, selectedChannel, sliderCategories]);

  // Seleccionar primer canal por defecto (existente)
  useEffect(() => {
    if (userChannels.length > 0 && !selectedChannelId) {
      const firstChannel = userChannels[0];
      setSelectedChannelId(firstChannel._id);
      setIsChannelPending(firstChannel.pendiente === true);
    }
  }, [userChannels, selectedChannelId]);

  // Limpieza
  useEffect(() => {
    return () => {
      hasLoadedChannelsRef.current = false;
      hasLoadedCategoriesRef.current = false;
      hasLoadedUserVideosRef.current = false;
    };
  }, []);

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

  // Validaciones
  const isStep1Valid = wizardData.videoSource && wizardData.videoUrl && wizardData.videoDuration <= maxDuration;
  const isStep3Valid = selectedChannelId && wizardData.titre.trim().length > 0 && wizardData.category.length > 0;

  const validateChannelForCommercial = () => {
    const hasCommercialData = !!wizardData.saleType;
    if (!hasCommercialData) return true;

    if (!selectedChannel?.wilaya || !selectedChannel?.commune) {
      setError('❌ Ce canal ne possède pas de wilaya et commune.\n\nVeuillez compléter ces informations avant de publier une vidéo commerciale.');
      return false;
    }
    if (!selectedChannel?.phone && !selectedChannel?.email) {
      setError('❌ Ce canal ne possède pas de téléphone ou email.\n\nVeuillez ajouter un moyen de contact.');
      return false;
    }
    return true;
  };

  const handleGallerySelect = () => {
    if (isTrialLimitReached) {
      setError('⛔ Limite atteinte : votre canal d\'essai ne peut contenir qu\'une seule vidéo.');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleCameraSelect = () => {
    if (isTrialLimitReached) {
      setError('⛔ Limite atteinte : votre canal d\'essai ne peut contenir qu\'une seule vidéo.');
      return;
    }
    cameraInputRef.current?.click();
  };

  const handleFileChange = useCallback(async (e, isCamera = false) => {
    // Verificar nuevamente el límite por si acaso
    if (isTrialLimitReached) {
      setError('⛔ Limite atteinte : votre canal d\'essai ne peut contenir qu\'une seule vidéo.');
      return;
    }

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
  }, [maxDuration, isTrialLimitReached]);

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
    if (isChannelPending) {
      setError('⏳ Impossible de publier : votre chaîne est en attente d\'approbation.');
      return;
    }
    if (isTrialLimitReached) {
      setError('⛔ Vous ne pouvez pas ajouter plus d\'une vidéo sur ce canal d\'essai. Souscrivez un plan payant pour créer plus de vidéos.');
      return;
    }
    if (currentStep === 1 && !isStep1Valid) {
      setError('Veuillez sélectionner et télécharger une vidéo valide');
      return;
    }
    if (currentStep === 3 && !isStep3Valid) {
      setError('Veuillez sélectionner un canal, un titre et une catégorie');
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
    if (isChannelPending) {
      setError('⏳ Impossible de publier : votre chaîne est en attente d\'approbation.');
      return;
    }
    if (isTrialLimitReached) {
      setError('⛔ Limite atteinte : vous ne pouvez pas publier plus d\'une vidéo sur ce canal d\'essai.');
      return;
    }
    if (!validateChannelForCommercial()) return;

    setSubmitting(true);

    const hasCommercialData = !!wizardData.saleType;
    
    const payload = {
      channelId: selectedChannelId,
      titre: wizardData.titre,
      description: wizardData.description,
      category: wizardData.category,
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
      tags: []
    };

    if (hasCommercialData) {
      payload.isCommercial = true;
      payload.saleType = wizardData.saleType;
      payload.address = wizardData.address || '';
      payload.mapUrl = wizardData.mapUrl || '';
    } else {
      payload.isCommercial = false;
    }

    try {
      const res = await dispatch(createVideo(payload, auth.token));
      if (res?.success) {
        const isAdmin = auth.user?.role === 'admin';
        dispatch({ 
          type: GLOBALTYPES.ALERT, 
          payload: { success: isAdmin ? '✅ Vidéo publiée !' : '📹 Vidéo envoyée, en attente d\'approbation.' } 
        });
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

  // Render paso 1 con advertencia adicional
  const renderStep1 = () => (
    <div className="step1-container" style={{ padding: '0 8px', minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Advertencia para canal pendiente */}
      {isChannelPending && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ fontSize: '24px' }}>⏳</div>
          <div style={{ flex: 1 }}>
            <h6 style={{ color: '#92400e', marginBottom: '8px', fontWeight: 'bold' }}>
              Chaîne en attente d'approbation
            </h6>
            <p style={{ color: '#78350f', marginBottom: '8px', fontSize: '13px' }}>
              Votre chaîne <strong>"{selectedChannel?.name || userChannels[0]?.name}"</strong> n'a pas encore été approuvée.
            </p>
            <p style={{ color: '#78350f', marginBottom: '0', fontSize: '13px' }}>
              ❌ Vous ne pouvez pas publier de vidéos tant qu'elle n'est pas validée.
            </p>
          </div>
        </div>
      )}

      {/* Advertencia para límite de videos en trial */}
      {isTrialLimitReached && (
        <div style={{
          backgroundColor: '#fee2e2',
          borderLeft: '4px solid #ef4444',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div style={{ fontSize: '24px' }}>⛔</div>
          <div style={{ flex: 1 }}>
            <h6 style={{ color: '#991b1b', marginBottom: '8px', fontWeight: 'bold' }}>
              Limite d'essai atteinte
            </h6>
            <p style={{ color: '#7f1d1d', marginBottom: '8px', fontSize: '13px' }}>
              Vous avez déjà publié <strong>1 vidéo</strong> sur ce canal d'essai.
            </p>
            <p style={{ color: '#7f1d1d', marginBottom: '0', fontSize: '13px' }}>
              Pour ajouter plus de vidéos, veuillez <strong>souscrire à un plan payant</strong> depuis la page des offres.
            </p>
          </div>
        </div>
      )}
      
      {/* Botones de selección de video (deshabilitados si límite alcanzado) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '20px', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleGallerySelect} 
            disabled={isChannelPending || isTrialLimitReached}
            style={{ 
              background: (isChannelPending || isTrialLimitReached) ? 'linear-gradient(135deg, #999, #666)' : 'linear-gradient(135deg, #667eea, #764ba2)', 
              border: 'none', 
              borderRadius: '60px', 
              width: '70px', 
              height: '70px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: (isChannelPending || isTrialLimitReached) ? 'not-allowed' : 'pointer',
              opacity: (isChannelPending || isTrialLimitReached) ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <Image size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Galerie</div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleCameraSelect} 
            disabled={isChannelPending || isTrialLimitReached}
            style={{ 
              background: (isChannelPending || isTrialLimitReached) ? 'linear-gradient(135deg, #999, #666)' : 'linear-gradient(135deg, #f093fb, #f5576c)', 
              border: 'none', 
              borderRadius: '60px', 
              width: '70px', 
              height: '70px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: (isChannelPending || isTrialLimitReached) ? 'not-allowed' : 'pointer',
              opacity: (isChannelPending || isTrialLimitReached) ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <Camera size={36} color="white" />
          </button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Caméra</div>
        </div>
      </div>
      
      {/* Inputs ocultos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="video/mp4,video/quicktime,video/webm" 
        style={{ display: 'none' }} 
        onChange={(e) => handleFileChange(e, false)} 
        disabled={isChannelPending || isTrialLimitReached}
      />
      <input 
        type="file" 
        ref={cameraInputRef} 
        accept="video/mp4,video/quicktime,video/webm" 
        capture="environment" 
        style={{ display: 'none' }} 
        onChange={(e) => handleFileChange(e, true)} 
        disabled={isChannelPending || isTrialLimitReached}
      />
      
      {loading && uploadProgress > 0 && (
        <ProgressBar 
          now={uploadProgress} 
          label={`${uploadProgress}%`} 
          striped 
          animated 
          className="mt-3" 
          style={{ borderRadius: '20px', height: '6px' }} 
        />
      )}
      
      {wizardData.videoPreview && (
        <div className="video-preview-full" style={{ marginTop: '15px', position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
          <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain' }} />
          <Badge bg="dark" style={{ position: 'absolute', bottom: '8px', right: '8px', opacity: 0.8 }}>
            ⏱️ {Math.floor(wizardData.videoDuration)}s
          </Badge>
          <Button 
            variant="danger" 
            size="sm" 
            style={{ position: 'absolute', top: '8px', right: '8px', borderRadius: '60px' }} 
            onClick={clearVideo}
            disabled={isChannelPending || isTrialLimitReached}
          >
            <X size={14} className="me-1" /> Changer
          </Button>
        </div>
      )}
      
      {!wizardData.videoPreview && !loading && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '16px', 
          marginTop: '15px', 
          minHeight: '250px', 
          color: '#fff', 
          textAlign: 'center' 
        }}>
          <div>
            <Camera size={48} style={{ opacity: 0.5, marginBottom: '10px' }} />
            <p>Sélectionnez une vidéo depuis<br />votre galerie ou votre caméra</p>
            <small style={{ opacity: 0.6 }}>Max {maxDuration} secondes</small>
          </div>
        </div>
      )}
    </div>
  );

  // Render paso 3 (sin cambios, solo se añade posible mensaje de límite)
  const renderStep3 = () => {
    const channelMissingWilaya = selectedChannel && (!selectedChannel.wilaya || !selectedChannel.commune);
    const channelMissingContact = selectedChannel && (!selectedChannel.phone && !selectedChannel.email);
    const showChannelWarning = showCommercial && (channelMissingWilaya || channelMissingContact);

    const categoryName = sliderCategories.find(cat => cat._id === wizardData.category)?.name || selectedChannel?.activity || '';

    return (
      <div className="step3-container" style={{ padding: '0' }}>
        {isTrialLimitReached && (
          <Alert variant="danger" className="mb-3">
            ⛔ <strong>Limite d'essai atteinte</strong> – Vous avez déjà une vidéo sur ce canal. Souscrivez un plan pour en ajouter d'autres.
          </Alert>
        )}
        <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>📝 Détails de la vidéo</h5>

        <div className="mb-4">
          <label className="form-label fw-bold" style={{ color: 'white' }}>
            <Building className="me-2" /> Canal *
          </label>
          <select
            className="form-select"
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', padding: '12px' }}
            disabled={channelsLoading}
          >
            <option value="">-- Choisissez un canal --</option>
            {userChannels.map(ch => (
              <option key={ch._id} value={ch._id}>
                🏪 {ch.name} {ch.pending ? '⏳ (En attente)' : '✅'}
              </option>
            ))}
          </select>
          <small className="text-muted d-block mt-2">ℹ️ Sélectionnez le canal qui publiera cette vidéo</small>
        </div>

        {selectedChannel && (
          <div className="mb-4 p-3" style={{ background: 'rgba(102, 126, 234, 0.1)', borderRadius: '16px', borderLeft: '4px solid #667eea' }}>
            <label className="form-label fw-bold" style={{ color: '#667eea' }}>
              <Folder2 className="me-2" /> Catégorie du canal
            </label>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>
                  {sliderCategories.find(cat => cat._id === wizardData.category)?.icon || '📁'}
                </span>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {categoryName || 'Chargement...'}
                  </div>
                  <small className="text-muted">Cette catégorie est définie par le canal et ne peut pas être modifiée</small>
                </div>
              </div>
            </div>
            <input type="hidden" name="category" value={wizardData.category} />
          </div>
        )}

        {/* Título */}
        <div className="mb-3">
          <label className="form-label fw-bold" style={{ color: 'white' }}>Titre *</label>
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Ex: Démonstration de notre nouveau produit"
            value={wizardData.titre}
            onChange={(e) => updateWizardData({ titre: e.target.value })}
            maxLength="100"
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px' }}
          />
          <small className="text-muted">{wizardData.titre.length}/100</small>
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: 'white' }}>Description (optionnelle)</label>
          <textarea
            rows="3"
            className="form-control"
            placeholder="Décrivez votre vidéo..."
            value={wizardData.description}
            onChange={(e) => updateWizardData({ description: e.target.value })}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '12px', resize: 'vertical' }}
          />
        </div>

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
              {showChannelWarning && (
                <Alert variant="warning" className="mb-3">
                  <div>⚠️ Ce canal ne possède pas toutes les informations nécessaires pour les vidéos commerciales :</div>
                  <ul className="mt-2 mb-0">
                    {channelMissingWilaya && <li>• Wilaya et commune manquants</li>}
                    {channelMissingContact && <li>• Téléphone ou email manquant</li>}
                  </ul>
                  <small className="d-block mt-2">ℹ️ Veuillez mettre à jour votre canal dans les paramètres pour utiliser les fonctionnalités commerciales.</small>
                </Alert>
              )}

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
            </div>
          )}
        </div>

        {wizardData.videoPreview && (
          <div className="mt-4 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>Aperçu vidéo</label>
            <video src={wizardData.videoPreview} controls style={{ width: '100%', maxHeight: '180px', borderRadius: '8px' }} />
            <div className="mt-2 text-muted small">Durée: {Math.floor(wizardData.videoDuration / 60)}:{Math.floor(wizardData.videoDuration % 60).toString().padStart(2, '0')}</div>
          </div>
        )}
      </div>
    );
  };

  const stepLabels = ['Vidéo', 'Musique', 'Infos'];

  if (channelsLoading && userChannels.length === 0) {
    return (
      <div className="text-center py-5" style={{ background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
        <Spinner animation="border" variant="light" />
        <p className="mt-3">Chargement de vos canaux...</p>
      </div>
    );
  }

  if (userChannels.length === 0 && !channelsLoading) {
    return (
      <div className="text-center py-5" style={{ background: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
        <h3>⚠️ Vous n'avez aucun canal</h3>
        <p>Vous devez créer un canal avant de publier des vidéos.</p>
        <Button variant="primary" onClick={() => history.push('/channel/new')}>
          Créer un canal
        </Button>
      </div>
    );
  }

  return (
    <div className="create-video-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '12px' }}>
      <Card className="border-0 shadow-lg" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '24px' }}>
        <Card.Body className="p-3">
          <div className="cw-header px-2 pt-2 pb-0">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h3 className="cw-header-title" style={{ color: 'white', fontWeight: 'bold' }}>🎬 Nouvelle vidéo</h3>
              <Badge bg="primary" className="p-2">⭐ {maxDuration}s max</Badge>
            </div>
            <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          </div>

          <div className="cw-step-content px-2 mt-3">
            {error && (
              <Alert variant="danger" className="mt-2" onClose={() => setError(null)} dismissible style={{ borderRadius: '12px', whiteSpace: 'pre-line' }}>
                {error}
              </Alert>
            )}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && <StepMusicSelection wizardData={wizardData} updateData={updateWizardData} />}
            {currentStep === 3 && renderStep3()}
          </div>

          <div className="cw-footer mt-3 p-3 d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={prevStep} 
              disabled={loading || submitting || currentStep === 1} 
              style={{ borderRadius: '40px', padding: '8px 20px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            >
              <ArrowLeft className="me-2" /> Retour
            </Button>
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                onClick={nextStep} 
                disabled={loading || isChannelPending || isTrialLimitReached || (currentStep === 1 && !isStep1Valid)} 
                style={{ borderRadius: '40px', padding: '8px 20px', background: (isChannelPending || isTrialLimitReached) ? '#6c757d' : 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', fontWeight: 'bold' }}
              >
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit} 
                disabled={submitting || !isStep3Valid || isChannelPending || isTrialLimitReached} 
                style={{ borderRadius: '40px', padding: '8px 20px', background: (isChannelPending || isTrialLimitReached) ? '#6c757d' : 'linear-gradient(135deg, #28a745, #20c997)', border: 'none', fontWeight: 'bold' }}
              >
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