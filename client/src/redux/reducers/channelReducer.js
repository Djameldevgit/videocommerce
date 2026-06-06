// frontend/src/redux/reducers/channelReducer.js
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
  
  // Canales pendientes (solo admin)
  pendingChannels: {
    channels: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null
  },
  
  // Estados de carga
  loading: false,
  feedLoading: false,
  contactInfo: null,
  isBlocked: false,
  // Errores
  error: null,
  pendingChannel: null,
  pendingLoading: false,
};

// ✅ FUNCIÓN HELPER PARA EXTRAER URL DE IMAGEN
const extractImageUrl = (imageData) => {
  if (!imageData) return '';
  if (typeof imageData === 'string') return imageData;
  if (Array.isArray(imageData) && imageData.length > 0) {
    return imageData[0]?.url || '';
  }
  if (imageData?.url) return imageData.url;
  return '';
};

// ✅ FUNCIÓN PARA NORMALIZAR UN CANAL
const normalizeChannel = (channel) => {
  if (!channel) return null;
  
  return {
    ...channel,
    avatar: extractImageUrl(channel.avatar),
    cover: extractImageUrl(channel.cover),
    phone: channel.phone || '',
    email: channel.email || '',
    website: channel.website || '',
    wilaya: channel.wilaya || '',
    commune: channel.commune || '',
    activity: channel.activity || '',
    description: channel.description || '',
    pending: channel.pending || false,
    isActive: channel.isActive !== false,
    isVerified: channel.isVerified || false,
    followersCount: channel.followersCount || 0,
    totalVideos: channel.totalVideos || 0,
    totalViews: channel.totalViews || 0,
    totalLikes: channel.totalLikes || 0,
    isFollowing: channel.isFollowing || false
  };
};

// ✅ FUNCIÓN PARA NORMALIZAR LISTA DE CANALES
const normalizeChannels = (channels) => {
  if (!Array.isArray(channels)) return [];
  return channels.map(ch => normalizeChannel(ch));
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
      const normalizedNewChannel = normalizeChannel(action.payload);
      return {
        ...state,
        loading: false,
        userChannels: [normalizedNewChannel, ...normalizeChannels(state.userChannels)],
        channels: [normalizedNewChannel, ...normalizeChannels(state.channels)],
        error: null
      };
    
    case CHANNEL_TYPES.CREATE_CHANNEL_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    // ==================== OBTENER CANAL ACTUAL ====================
    case CHANNEL_TYPES.GET_CHANNEL:
      const payloadData = action.payload;
      
      const extractUrl = (data) => {
        if (!data) return '';
        if (typeof data === 'string') return data;
        if (Array.isArray(data) && data.length > 0) return data[0]?.url || '';
        if (data.url) return data.url;
        return '';
      };
      
      return {
        ...state,
        channel: {
          ...payloadData,
          avatar: extractUrl(payloadData.avatar),
          cover: extractUrl(payloadData.cover),
          wilaya: payloadData?.wilaya || '',
          commune: payloadData?.commune || '',
          email: payloadData?.email || '',
          phone: payloadData?.phone || '',
          website: payloadData?.website || '',
          activity: payloadData?.activity || '',
          description: payloadData?.description || '',
          followersCount: payloadData?.followersCount || 0,
          isFollowing: payloadData?.isFollowing || false
        },
        loading: false,
        error: null
      };
    
    case CHANNEL_TYPES.CLEAR_CHANNEL:
      return { ...state, channel: null };
    
    // ==================== OBTENER CANALES DEL USUARIO ====================
    case CHANNEL_TYPES.GET_USER_CHANNELS:
      const normalizedUserChannels = normalizeChannels(action.payload);
      return {
        ...state,
        userChannels: normalizedUserChannels,
        channels: normalizedUserChannels,
        loading: false,
        error: null
      };
    
    // ==================== ACTUALIZAR CANAL ====================
    case CHANNEL_TYPES.UPDATE_CHANNEL:
      const updatedNormalizedChannel = normalizeChannel(action.payload);
      
      return {
        ...state,
        channel: state.channel?._id === updatedNormalizedChannel._id
          ? updatedNormalizedChannel
          : state.channel,
        userChannels: normalizeChannels(state.userChannels.map(ch => 
          ch._id === updatedNormalizedChannel._id ? updatedNormalizedChannel : ch
        )),
        channels: normalizeChannels(state.channels.map(ch => 
          ch._id === updatedNormalizedChannel._id ? updatedNormalizedChannel : ch
        )),
        error: null
      };
    
    // ==================== VIDEOS DEL CANAL ====================
    case CHANNEL_TYPES.GET_CHANNEL_VIDEOS:
      return {
        ...state,
        videos: action.payload.videos || [],
        totalVideos: action.payload.total || 0,
        hasMore: action.payload.hasMore || false,
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
    
    // ==================== SEGUIR / DEJAR DE SEGUIR (ACTUALIZADO) ====================
    case CHANNEL_TYPES.FOLLOW_CHANNEL:
      const { channelId, followersCount } = action.payload;
      
      return {
        ...state,
        // Actualizar canal actual
        channel: state.channel && state.channel._id === channelId ? {
          ...state.channel,
          followersCount: followersCount,
          isFollowing: true
        } : state.channel,
        
        // Actualizar en la lista de canales del usuario
        userChannels: state.userChannels.map(ch =>
          ch._id === channelId
            ? { ...ch, followersCount: followersCount, isFollowing: true }
            : ch
        ),
        
        // Actualizar en la lista general de canales
        channels: state.channels.map(ch =>
          ch._id === channelId
            ? { ...ch, followersCount: followersCount, isFollowing: true }
            : ch
        ),
        
        // Agregar a followingChannels si no está
        followingChannels: state.followingChannels.some(ch => ch._id === channelId)
          ? state.followingChannels
          : [...state.followingChannels, { _id: channelId, followersCount }],
          
        // Actualizar en pendingChannels si existe
        pendingChannels: {
          ...state.pendingChannels,
          channels: state.pendingChannels.channels.map(ch =>
            ch._id === channelId
              ? { ...ch, followersCount: followersCount, isFollowing: true }
              : ch
          )
        }
      };
     // redux/reducers/channelReducer.js

// Añade este CASE después de FOLLOW_CHANNEL y UNFOLLOW_CHANNEL
case CHANNEL_TYPES.UPDATE_CHANNEL_FOLLOW_STATUS:
 
  return {
    ...state,
    channel: state.channel ? {
      ...state.channel,
      isFollowing: action.payload.isFollowing,
      followersCount: action.payload.followersCount
    } : state.channel
  };
    case CHANNEL_TYPES.UNFOLLOW_CHANNEL:
      const { channelId: unfollowId, followersCount: unfollowCount } = action.payload;
      
      return {
        ...state,
        // Actualizar canal actual
        channel: state.channel && state.channel._id === unfollowId ? {
          ...state.channel,
          followersCount: unfollowCount,
          isFollowing: false
        } : state.channel,
        
        // Actualizar en la lista de canales del usuario
        userChannels: state.userChannels.map(ch =>
          ch._id === unfollowId
            ? { ...ch, followersCount: unfollowCount, isFollowing: false }
            : ch
        ),
        
        // Actualizar en la lista general de canales
        channels: state.channels.map(ch =>
          ch._id === unfollowId
            ? { ...ch, followersCount: unfollowCount, isFollowing: false }
            : ch
        ),
        
        // Remover de followingChannels
        followingChannels: state.followingChannels.filter(ch => ch._id !== unfollowId),
        
        // Actualizar en pendingChannels si existe
        pendingChannels: {
          ...state.pendingChannels,
          channels: state.pendingChannels.channels.map(ch =>
            ch._id === unfollowId
              ? { ...ch, followersCount: unfollowCount, isFollowing: false }
              : ch
          )
        }
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
        followingChannels: normalizeChannels(action.payload),
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
    
    // ==================== ADMIN - CANALES PENDIENTES ====================
    case CHANNEL_TYPES.GET_PENDING_CHANNELS_REQUEST:
      return {
        ...state,
        pendingChannels: {
          ...state.pendingChannels,
          loading: true,
          error: null
        }
      };
    
    case CHANNEL_TYPES.GET_PENDING_CHANNELS_SUCCESS:
      return {
        ...state,
        pendingChannels: {
          channels: normalizeChannels(action.payload.channels),
          total: action.payload.total || 0,
          page: action.payload.page || 1,
          totalPages: action.payload.totalPages || 1,
          loading: false,
          error: null
        }
      };
    
    case CHANNEL_TYPES.GET_PENDING_CHANNELS_FAIL:
      return {
        ...state,
        pendingChannels: {
          ...state.pendingChannels,
          loading: false,
          error: action.payload
        }
      };
    
    // Aprobar canal
    case CHANNEL_TYPES.APPROVE_CHANNEL_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CHANNEL_TYPES.APPROVE_CHANNEL_SUCCESS:
      const approvedChannel = normalizeChannel(action.payload);
      const updatedPendingChannels = state.pendingChannels.channels.filter(
        ch => ch._id !== approvedChannel._id
      );
      
      return {
        ...state,
        loading: false,
        userChannels: normalizeChannels(state.userChannels.map(ch =>
          ch._id === approvedChannel._id ? { ...ch, pending: false, isActive: true } : ch
        )),
        channels: normalizeChannels(state.channels.map(ch =>
          ch._id === approvedChannel._id ? { ...ch, pending: false, isActive: true } : ch
        )),
        pendingChannels: {
          ...state.pendingChannels,
          channels: updatedPendingChannels,
          total: Math.max(0, state.pendingChannels.total - 1)
        },
        error: null
      };
    
    case CHANNEL_TYPES.APPROVE_CHANNEL_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    // Rechazar canal
    case CHANNEL_TYPES.REJECT_CHANNEL_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CHANNEL_TYPES.REJECT_CHANNEL_SUCCESS:
      const rejectedChannel = normalizeChannel(action.payload);
      const updatedPendingAfterReject = state.pendingChannels.channels.filter(
        ch => ch._id !== rejectedChannel._id
      );
      
      return {
        ...state,
        loading: false,
        pendingChannels: {
          ...state.pendingChannels,
          channels: updatedPendingAfterReject,
          total: Math.max(0, state.pendingChannels.total - 1)
        },
        error: null
      };
    
    case CHANNEL_TYPES.REJECT_CHANNEL_FAIL:
      return { ...state, loading: false, error: action.payload };
    
    // Limpiar canales pendientes
    case CHANNEL_TYPES.CLEAR_PENDING_CHANNELS:
      return {
        ...state,
        pendingChannels: {
          channels: [],
          total: 0,
          page: 1,
          totalPages: 1,
          loading: false,
          error: null
        }
      };
    
    // ==================== ELIMINAR CANAL ====================
    case CHANNEL_TYPES.DELETE_CHANNEL_SUCCESS:
      return {
        ...state,
        userChannels: state.userChannels.filter(ch => ch._id !== action.payload),
        channels: state.channels.filter(ch => ch._id !== action.payload),
        channel: state.channel?._id === action.payload ? null : state.channel,
        loading: false,
        error: null
      };
    
    case CHANNEL_TYPES.DELETE_CHANNEL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    
    // ==================== REPORTAR CANAL ====================
    case CHANNEL_TYPES.REPORT_CHANNEL_SUCCESS:
      return {
        ...state,
        channel: state.channel ? {
          ...state.channel,
          reportCount: action.payload.reportCount
        } : null
      };
    
    case CHANNEL_TYPES.BLOCK_CHANNEL_SUCCESS:
      return {
        ...state,
        isBlocked: action.payload.isBlocked
      };
    
    // ==================== CONTACTO ====================
    case CHANNEL_TYPES.GET_CHANNEL_CONTACT:
      return {
        ...state,
        contactInfo: action.payload
      };
    
    case CHANNEL_TYPES.REGISTER_CHANNEL_SHARE:
      return {
        ...state,
        channel: state.channel ? {
          ...state.channel,
          shareCount: action.payload.shareCount
        } : null
      };
    
    // ==================== CANAL PENDIENTE ====================
    case CHANNEL_TYPES.GET_PENDING_CHANNEL_REQUEST:
      return {
        ...state,
        pendingLoading: true,
        error: null
      };
      
    case CHANNEL_TYPES.GET_PENDING_CHANNEL_SUCCESS:
      return {
        ...state,
        pendingChannel: action.payload,
        channel: action.payload,
        pendingLoading: false,
        error: null
      };
      
    case CHANNEL_TYPES.GET_PENDING_CHANNEL_ERROR:
      return {
        ...state,
        pendingLoading: false,
        error: action.payload
      };
    
    // ==================== ERROR ====================
    case CHANNEL_TYPES.CHANNEL_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

export default channelReducer;