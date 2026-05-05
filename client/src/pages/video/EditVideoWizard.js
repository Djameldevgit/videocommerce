import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Alert, Spinner, Card, ProgressBar, Badge } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, CloudUpload, PencilFill, Trash, MusicNote } from 'react-bootstrap-icons';
import StepIndicator from './StepIndicator';
import StepMusicSelection from './StepMusicSelection';
import { getVideoById, updateVideo } from '../../redux/actions/videoAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import { videoUpload } from '../../utils/imageUpload';
import { patchDataAPI } from '../../utils/fetchData';
import './CreateVideoWizard.css';

const EditVideoWizard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { currentVideo: video, loading: videoLoading } = useSelector(state => state.video || {});
  const { user } = auth;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [keepExistingVideo, setKeepExistingVideo] = useState(true);
  
  const [wizardData, setWizardData] = useState({
    videoSource: 'existing',
    videoFile: null,
    videoPreview: null,
    videoDuration: 0,
    videoUrl: '',
    videoPublicId: '',
    thumbnail: '',
    selectedMusic: null,
    musicVolume: 70,
    title: '',
    description: ''
  });
  
  const isProActive = user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  const maxDuration = isProActive ? 60 : 30;
  
  // Charger les données du vidéo existant
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);
  
  // Remplir le wizard avec les données existantes
  useEffect(() => {
    if (video && !videoLoading) {
      console.log('📹 Vidéo chargée pour édition:', video);
      
      // Extraer la música existente correctamente
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
        console.log("🎵 Música existente cargada:", existingMusic);
      }
      
      setWizardData({
        videoSource: 'existing',
        videoFile: null,
        videoPreview: video.videoUrl || null,
        videoDuration: video.duration || 0,
        videoUrl: video.videoUrl || '',
        videoPublicId: video.videoPublicId || '',
        thumbnail: video.thumbnail || '',
        selectedMusic: existingMusic,
        musicVolume: existingMusic?.volume || 70,
        title: video.title || '',
        description: video.description || ''
      });
    }
  }, [video, videoLoading]);
  
  const validateStep = (step) => {
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
      case 2:
        break;
      case 3:
        if (!wizardData.title.trim()) {
          setError('Veuillez ajouter un titre');
          return false;
        }
        break;
      default:
        return true;
    }
    setError(null);
    return true;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };
  
  const updateWizardData = (newData) => {
    setWizardData(prev => ({ ...prev, ...newData }));
    if (newData.videoFile) {
      setKeepExistingVideo(false);
    }
  };
  
  const handleCancel = () => {
    history.push('/');
  };
  
  // ✅ HANDLE SUBMIT CORREGIDO CON patchDataAPI
// ✅ HANDLE SUBMIT CORREGIDO
// ✅ HANDLE SUBMIT CORREGIDO con videoPublicId
const handleSubmit = async () => {
  if (!validateStep(3)) return;
  
  setLoading(true);
  setUploadProgress(0);
  setError(null);
  
  try {
    let videoUrl, videoPublicId, thumbnail, videoDuration;
    
    // ✅ Si se subió NUEVA video
    if (!keepExistingVideo && wizardData.videoFile) {
      console.log("📤 Subiendo NUEVO video...");
      const result = await videoUpload(wizardData.videoFile, (progress) => {
        setUploadProgress(progress);
      });
      videoUrl = result.url;
      videoPublicId = result.public_id;  // ✅ IMPORTANTE
      thumbnail = result.thumbnail;
      videoDuration = wizardData.videoDuration;
      console.log("✅ Nuevo video subido:", { videoUrl, videoPublicId });
    } 
    else {
      // ✅ Usar video existente
      console.log("📤 Manteniendo video existente...");
      videoUrl = video.videoUrl;
      videoPublicId = video.videoPublicId;  // ✅ IMPORTANTE
      thumbnail = wizardData.thumbnail || video.thumbnail;
      videoDuration = wizardData.videoDuration || video.duration;
      console.log("✅ Video existente:", { videoUrl, videoPublicId });
    }
    
    // ✅ CONSTRUIR MÚSICA
    let musicData = null;
    if (wizardData.selectedMusic) {
      console.log("🎵 Música seleccionada:", wizardData.selectedMusic);
      
      musicData = {
        id: wizardData.selectedMusic.id,
        title: wizardData.selectedMusic.title,
        artist: wizardData.selectedMusic.artist,
        audioUrl: wizardData.selectedMusic.audioUrl,
        audioPublicId: wizardData.selectedMusic.audioPublicId, // ✅ CLAVE
        duration: wizardData.selectedMusic.duration,
        volume: wizardData.musicVolume
      };
      
      console.log("🎵 Música a enviar:", {
        title: musicData.title,
        hasAudioPublicId: !!musicData.audioPublicId,
        audioPublicId: musicData.audioPublicId
      });
    }
    
    const videoData = {
      title: wizardData.title,
      description: wizardData.description,
      videoUrl,
      videoPublicId,  // ✅ ENVIAR ESTO
      thumbnail,
      duration: videoDuration,
      music: musicData
    };
    
    console.log("📤 ENVIANDO AL BACKEND:", JSON.stringify(videoData, null, 2));
    
    const res = await patchDataAPI(`videos/${id}`, videoData, auth.token);
    
    if (res.data.success) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: '✏️ Vidéo modifiée avec succès !' }
      });
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
};
  
  // Render Step 1 - Édition vidéo
  const renderStep1 = () => (
    <div className="step1-container" style={{ padding: '0 8px' }}>
      {keepExistingVideo && video && (
        <div className="existing-video mb-4">
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ color: 'white', margin: 0 }}>📹 Vidéo actuelle</h6>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => {
                  setKeepExistingVideo(false);
                  updateWizardData({ videoSource: null, videoFile: null, videoPreview: null });
                }}
              >
                <Trash size={14} className="me-1" />
                Changer
              </Button>
            </div>
            <video
              src={video.videoUrl}
              controls
              style={{
                width: '100%',
                maxHeight: '300px',
                borderRadius: '12px'
              }}
              poster={video.thumbnail}
            />
            <div className="mt-2 text-muted small" style={{ color: '#aaa' }}>
              Durée: {Math.floor(video.duration / 60)}:
              {(video.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}
      
      {!keepExistingVideo && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '40px',
            marginBottom: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <input
                type="file"
                id="videoInput"
                accept="video/mp4,video/quicktime,video/webm"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    const videoEl = document.createElement('video');
                    videoEl.preload = 'metadata';
                    videoEl.onloadedmetadata = () => {
                      const duration = videoEl.duration;
                      if (duration > maxDuration) {
                        setError(`La vidéo ne doit pas dépasser ${maxDuration} secondes`);
                        URL.revokeObjectURL(previewUrl);
                        return;
                      }
                      updateWizardData({
                        videoFile: file,
                        videoPreview: previewUrl,
                        videoDuration: duration,
                        videoSource: 'gallery'
                      });
                      setError(null);
                    };
                    videoEl.src = URL.createObjectURL(file);
                  }
                }}
              />
              <label htmlFor="videoInput" style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '60px',
                width: '70px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                margin: '0 auto'
              }}>
                <CloudUpload size={36} color="white" />
              </label>
              <div style={{ fontSize: '12px', marginTop: '8px', color: '#fff' }}>Nouvelle vidéo</div>
            </div>
          </div>
          
          {wizardData.videoPreview && (
            <div style={{ marginTop: '20px', position: 'relative' }}>
              <video
                src={wizardData.videoPreview}
                controls
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  borderRadius: '12px',
                  background: '#000'
                }}
              />
              <Button 
                variant="outline-danger" 
                size="sm"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  borderRadius: '30px'
                }}
                onClick={() => {
                  updateWizardData({ videoFile: null, videoPreview: null, videoDuration: 0 });
                  setKeepExistingVideo(true);
                }}
              >
                Annuler
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
  
  // Render Step 3 - Titre et description
  const renderStep3 = () => (
    <div className="step3-container" style={{ padding: '20px' }}>
      <h5 className="mb-4" style={{ color: 'white', fontWeight: 'bold' }}>
        ✏️ Modifier les détails
      </h5>
      
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>
          Titre *
        </label>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Titre de la vidéo..."
          value={wizardData.title}
          onChange={(e) => updateWizardData({ title: e.target.value })}
          maxLength="100"
          style={{ 
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white'
          }}
        />
        <small className="text-muted mt-1 d-block">
          {wizardData.title.length}/100 caractères
        </small>
      </div>
      
      <div className="mb-4">
        <label className="form-label" style={{ color: 'white', fontWeight: 500 }}>
          Description
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Description de la vidéo..."
          value={wizardData.description}
          onChange={(e) => updateWizardData({ description: e.target.value })}
          maxLength="500"
          style={{ 
            borderRadius: '12px',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            resize: 'none'
          }}
        />
        <small className="text-muted mt-1 d-block">
          {wizardData.description.length}/500 caractères
        </small>
      </div>
      
      {/* Mostrar música actual si existe */}
      {wizardData.selectedMusic && (
        <div className="mt-4 p-3" style={{ 
          background: 'rgba(102, 126, 234, 0.2)', 
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.3)'
        }}>
          <div className="d-flex align-items-center gap-2">
            <MusicNote style={{ color: '#667eea' }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 'bold' }}>
                {wizardData.selectedMusic.title}
              </div>
              <small style={{ color: '#aaa' }}>
                {wizardData.selectedMusic.artist} • Volume: {wizardData.musicVolume}%
              </small>
              {wizardData.selectedMusic.audioPublicId && (
                <Badge bg="success" className="ms-2" style={{ fontSize: '10px' }}>✓ Audio listo</Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  const stepLabels = ['Vidéo', 'Musique', 'Infos'];
  
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
    <div className="create-video-wizard" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '16px'
    }}>
      <Card className="border-0 shadow-lg" style={{ 
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px'
      }}>
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0" style={{ color: 'white', fontWeight: 'bold' }}>
                <PencilFill className="me-2" style={{ fontSize: '1.2rem' }} />
                Modifier la vidéo
              </h3>
              <small className="text-muted">{video?.title}</small>
            </div>
            {!isProActive ? (
              <Badge bg="warning" text="dark" className="p-2">
                ⚡ {maxDuration}s max
              </Badge>
            ) : (
              <Badge bg="primary" className="p-2">
                ⭐ Pro: {maxDuration}s
              </Badge>
            )}
          </div>
          
          <StepIndicator currentStep={currentStep} totalSteps={3} labels={stepLabels} />
          
          {error && (
            <Alert variant="danger" className="mt-3" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <div className="mt-4">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && (
              <StepMusicSelection 
                wizardData={wizardData}
                updateData={updateWizardData}
              />
            )}
            {currentStep === 3 && renderStep3()}
          </div>
          
          <div className="mt-4 pt-3 d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={currentStep === 1 ? handleCancel : prevStep} 
              disabled={loading}
              style={{ borderRadius: '40px', padding: '10px 24px' }}
            >
              <ArrowLeft className="me-2" />
              {currentStep === 1 ? 'Annuler' : 'Retour'}
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                variant="primary" 
                onClick={nextStep} 
                disabled={loading}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none' }}
              >
                Suivant <ArrowRight className="ms-2" />
              </Button>
            ) : (
              <Button 
                variant="success" 
                onClick={handleSubmit} 
                disabled={loading}
                style={{ borderRadius: '40px', padding: '10px 24px', background: 'linear-gradient(135deg, #28a745, #20c997)', border: 'none' }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {uploadProgress > 0 ? `Upload ${uploadProgress}%...` : 'Mise à jour...'}
                  </>
                ) : (
                  <>
                    <CloudUpload className="me-2" />
                    Mettre à jour
                  </>
                )}
              </Button>
            )}
          </div>
          
          {loading && uploadProgress > 0 && (
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} striped animated className="mt-3" />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditVideoWizard;