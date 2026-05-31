// src/hooks/useUserPlan.js
import { useSelector } from 'react-redux';

const useUserPlan = () => {
  const { auth } = useSelector(state => state);
  const user = auth?.user;
  
  // Obtener el plan actual del usuario
  const getCurrentPlan = () => {
    if (!user) return 'free';
    if (user.role !== 'userpro') return 'free';
    return user.channelPlan || 'free';
  };
  
  // Obtener nombre del plan
  const getPlanName = () => {
    const plan = getCurrentPlan();
    const names = {
      'free': 'Gratuit',
      'basic': 'Basic',
      'pro': 'Pro',
      'business': 'Business'
    };
    return names[plan] || 'Gratuit';
  };
  
  // Obtener color del plan
  const getPlanColor = () => {
    const plan = getCurrentPlan();
    const colors = {
      'free': '#6c757d',
      'basic': '#667eea',
      'pro': '#f093fb',
      'business': '#f6b93b'
    };
    return colors[plan] || '#6c757d';
  };
  
  // Obtener ícono del plan
  const getPlanIcon = () => {
    const plan = getCurrentPlan();
    const icons = {
      'free': '🆓',
      'basic': '⭐',
      'pro': '🚀',
      'business': '👑'
    };
    return icons[plan] || '🆓';
  };
  
  // Obtener límites según el plan
  const getPlanLimits = () => {
    const plan = getCurrentPlan();
    const limits = {
      free: {
        maxChannels: 1,
        maxVideos: 5,
        maxDuration: 20,
        maxStorage: 10,
        canUpload: true,
        canComment: true,
        canLike: true,
        canShare: true,
        canAddMusic: false,
        canAccessAnalytics: false,
        canDownload: false
      },
      basic: {
        maxChannels: 3,
        maxVideos: 50,
        maxDuration: 40,
        maxStorage: 50,
        canUpload: true,
        canComment: true,
        canLike: true,
        canShare: true,
        canCreatePlaylist: true,
        canAddMusic: false,
        canAccessAnalytics: false,
        canDownload: false
      },
      pro: {
        maxChannels: 7,
        maxVideos: 200,
        maxDuration: 60,
        maxStorage: 500,
        canUpload: true,
        canComment: true,
        canLike: true,
        canShare: true,
        canCreatePlaylist: true,
        canDownload: true,
        canAddMusic: true,
        canAccessAnalytics: true
      },
      business: {
        maxChannels: 15,
        maxVideos: 'unlimited',
        maxDuration: 120,
        maxStorage: 2048,
        canUpload: true,
        canComment: true,
        canLike: true,
        canShare: true,
        canCreatePlaylist: true,
        canDownload: true,
        canAddMusic: true,
        canPromote: true,
        canAccessAnalytics: true
      }
    };
    return limits[plan] || limits.free;
  };
  
  // Verificar si es UserPro
  const isUserPro = user?.role === 'userpro';
  
  // Verificar si el plan está activo
  const hasActivePlan = () => {
    if (!isUserPro) return false;
    if (!user?.channelPlanExpiresAt) return true;
    return new Date(user.channelPlanExpiresAt) > new Date();
  };
  
  // Verificar si el plan ha expirado
  const isExpired = () => {
    if (!isUserPro) return false;
    if (!user?.channelPlanExpiresAt) return false;
    return new Date(user.channelPlanExpiresAt) < new Date();
  };
  
  // ✅ FUNCIÓN para obtener días restantes
  const getDaysRemaining = () => {
    if (!isUserPro || !user?.channelPlanExpiresAt) return 0;
    const diff = new Date(user.channelPlanExpiresAt) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };
  
  // Verificar si puede crear un nuevo canal
  const canCreateChannel = (currentChannelCount) => {
    const limits = getPlanLimits();
    if (limits.maxChannels === 'unlimited') return true;
    return currentChannelCount < limits.maxChannels;
  };
  
  // Verificar si puede subir un video
  const canUploadVideo = (currentVideoCount) => {
    const limits = getPlanLimits();
    if (limits.maxVideos === 'unlimited') return true;
    return currentVideoCount < limits.maxVideos;
  };
  
  // Verificar si el video cumple con la duración máxima
  const isValidDuration = (durationInSeconds) => {
    const limits = getPlanLimits();
    return durationInSeconds <= limits.maxDuration;
  };
  
  // Verificar si tiene una acción específica disponible
  const hasAction = (action) => {
    const limits = getPlanLimits();
    return limits[action] === true;
  };
  
  return {
    currentPlan: getCurrentPlan(),
    planName: getPlanName(),
    planColor: getPlanColor(),
    planIcon: getPlanIcon(),
    planLimits: getPlanLimits(),
    isUserPro,
    hasActivePlan: hasActivePlan(),     // ✅ Valor booleano
    isExpired: isExpired(),              // ✅ Valor booleano
    getDaysRemaining,                    // ✅ AHORA ES UNA FUNCIÓN (sin paréntesis)
    canCreateChannel,
    canUploadVideo,
    isValidDuration,
    hasAction,
    user
  };
};

export default useUserPlan;