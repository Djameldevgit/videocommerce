// redux/reducers/channelReducer.js
import { CHANNEL_TYPES } from '../actions/channelAction';

const initialState = {
  // Canal actual
  channel: null,
  
  // Lista de canales del usuario (para MisChannel)
  userChannels: [],
  
  // Alias para compatibilidad
  channels: [],
  
  // Videos del canal actual
  videos: [],
  
  // Videos paginados del canal
  channelVideos: {
    videos: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  },
  
  // Seguidores del canal
  followers: [],
  
  // Canales que sigue el usuario
  followingChannels: [],
  
  // Estadísticas del canal
  channelStats: null,
  
  // Feed de videos del canal
  feedVideos: {
    videos: [],
    total: 0,
    page: 1,
    hasMore: false
  },
  
  // Estados de carga
  loading: false,
  feedLoading: false,
  
  // Errores
  error: null
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    
    // ==================== LOADING STATES ====================
    case CHANNEL_TYPES.CHANNEL_LOADING:
      return { ...state, loading: action.payload };
    
    case CHANNEL_TYPES.CHANNEL_FEED_LOADING:
      return { ...state, feedLoading: action.payload };
    
    // ==================== CREAR CANAL ====================
    case CHANNEL_TYPES.CREATE_CHANNEL_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CHANNEL_TYPES.CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        loading: false,
        userChannels: [action.payload, ...state.userChannels],
        channels: [action.payload, ...state.channels],
        error: null
      };
    
    case CHANNEL_TYPES.CREATE_CHANNEL_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    // ==================== OBTENER CANAL ACTUAL ====================
    case CHANNEL_TYPES.GET_CHANNEL:
      return {
        ...state,
        channel: {
          ...action.payload,
          wilaya: action.payload?.wilaya || '',
          commune: action.payload?.commune || '',
          email: action.payload?.email || '',
          phone: action.payload?.phone || '',
          website: action.payload?.website || '',
          activity: action.payload?.activity || '',
          description: action.payload?.description || ''
        },
        loading: false,
        error: null
      };
    
    case CHANNEL_TYPES.CLEAR_CHANNEL:
      return { ...state, channel: null };
    
    // ==================== OBTENER CANALES DEL USUARIO ====================
    // redux/reducers/channelReducer.js - CASE CORREGIDO
case CHANNEL_TYPES.GET_USER_CHANNELS:
  const channelsList = Array.isArray(action.payload) ? action.payload : [];
  
  // ✅ Asegurar que cada canal tenga los campos necesarios
  const normalizedChannels = channelsList.map(ch => ({
    ...ch,
    phone: ch.phone || '',
    email: ch.email || '',
    website: ch.website || '',
    wilaya: ch.wilaya || '',
    commune: ch.commune || ''
  }));
  
  return {
    ...state,
    userChannels: normalizedChannels,
    channels: normalizedChannels,
    loading: false,
    error: null
  };
    // ==================== ACTUALIZAR CANAL ====================
    case CHANNEL_TYPES.UPDATE_CHANNEL:
      const updatedChannelData = action.payload;
      
      // Actualizar en userChannels
      const updatedUserChannelsList = state.userChannels.map(ch => 
        ch._id === updatedChannelData._id 
          ? { ...ch, ...updatedChannelData }
          : ch
      );
      
      // Actualizar en channels (alias)
      const updatedChannelsList = state.channels.map(ch => 
        ch._id === updatedChannelData._id 
          ? { ...ch, ...updatedChannelData }
          : ch
      );
      
      return {
        ...state,
        channel: state.channel?._id === updatedChannelData._id
          ? { ...state.channel, ...updatedChannelData }
          : state.channel,
        userChannels: updatedUserChannelsList,
        channels: updatedChannelsList,
        error: null
      };
    
    // ==================== VIDEOS DEL CANAL ====================
    case CHANNEL_TYPES.GET_CHANNEL_VIDEOS:
      return {
        ...state,
        channelVideos: {
          videos: action.payload.videos || [],
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          hasMore: action.payload.hasMore || false
        },
        loading: false
      };
    
    case CHANNEL_TYPES.CLEAR_CHANNEL_VIDEOS:
      return {
        ...state,
        channelVideos: {
          videos: [],
          total: 0,
          page: 1,
          totalPages: 1,
          hasMore: false
        }
      };
    
    // ==================== FEED DEL CANAL ====================
    case CHANNEL_TYPES.GET_CHANNEL_FEED_VIDEOS:
      const { page, videos, total, hasMore } = action.payload;
      return {
        ...state,
        feedVideos: {
          videos: page === 1 ? videos : [...state.feedVideos.videos, ...videos],
          total: total || 0,
          page: page || 1,
          hasMore: hasMore || false
        },
        feedLoading: false
      };
    
    case CHANNEL_TYPES.CLEAR_CHANNEL_FEED:
      return {
        ...state,
        feedVideos: {
          videos: [],
          total: 0,
          page: 1,
          hasMore: false
        }
      };
    
    // ==================== SEGUIR / DEJAR DE SEGUIR ====================
    case CHANNEL_TYPES.FOLLOW_CHANNEL:
      return {
        ...state,
        channel: state.channel ? {
          ...state.channel,
          followersCount: (state.channel.followersCount || 0) + 1,
          isFollowing: true
        } : null
      };
    
    case CHANNEL_TYPES.UNFOLLOW_CHANNEL:
      return {
        ...state,
        channel: state.channel ? {
          ...state.channel,
          followersCount: Math.max(0, (state.channel.followersCount || 0) - 1),
          isFollowing: false
        } : null
      };
    
    // ==================== SEGUIDORES ====================
    case CHANNEL_TYPES.GET_CHANNEL_FOLLOWERS:
      return {
        ...state,
        followers: action.payload || [],
        loading: false
      };
    
    case CHANNEL_TYPES.GET_USER_FOLLOWING_CHANNELS:
      return {
        ...state,
        followingChannels: action.payload || [],
        loading: false
      };
    
    // ==================== ESTADÍSTICAS ====================
    case CHANNEL_TYPES.CHANNEL_STATS:
      return {
        ...state,
        channelStats: action.payload,
        loading: false
      };
    
    case CHANNEL_TYPES.REGISTER_CHANNEL_VIEW:
      return {
        ...state,
        channel: state.channel ? {
          ...state.channel,
          totalViews: (state.channel.totalViews || 0) + (action.payload?.count || 1)
        } : null
      };
    
    // ==================== ERROR ====================
    case CHANNEL_TYPES.CHANNEL_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    // ==================== DEFAULT ====================
    default:
      return state;
  }
};

export default channelReducer;