// components/VideoModeToggle.jsx - CON LOGS DE DEBUG
import React, { useEffect } from 'react';
import { Film, Camera } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';

const VideoModeToggle = () => {
  const dispatch = useDispatch();
  
  // ✅ Obtener el estado correctamente
  const videoModeState = useSelector(state => state.videoMode);
  const videoPlaybackMode = videoModeState?.videoPlaybackMode || 'live';
  
  // ✅ Debug: verificar que el reducer está funcionando
  useEffect(() => {
    console.log('🎮 VideoModeToggle montado');
    console.log('   - Estado Redux:', videoModeState);
    console.log('   - Modo actual:', videoPlaybackMode);
    console.log('   - localStorage:', localStorage.getItem('videoPlaybackMode'));
  }, []);

  const toggleMode = () => {
    const newMode = videoPlaybackMode === 'live' ? 'static' : 'live';
    console.log('🔄 Toggle mode:', videoPlaybackMode, '→', newMode);
    
    // ✅ Disparar acción
    dispatch({ type: 'SET_VIDEO_MODE', payload: newMode });
    
    // ✅ Guardar en localStorage
    localStorage.setItem('videoPlaybackMode', newMode);
    
    // ✅ Verificar que se guardó
    console.log('   - localStorage actualizado:', localStorage.getItem('videoPlaybackMode'));
  };

  return (
    <div className="video-mode-toggle" onClick={toggleMode}>
      <div className={`toggle-track ${videoPlaybackMode === 'live' ? 'live' : 'static'}`}>
        <div className="toggle-thumb">
          {videoPlaybackMode === 'live' ? (
            <Film size={14} />
          ) : (
            <Camera size={14} />
          )}
        </div>
      </div>
      <span className="toggle-label">
        {videoPlaybackMode === 'live' ? 'Live' : 'Static'}
      </span>
    </div>
  );
};

export default VideoModeToggle;