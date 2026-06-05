// redux/reducers/videoReducer.js
// ============================================
// 📦 VIDEO REDUCER - COMPLETO Y ACTUALIZADO
// ============================================

import { VIDEO_TYPES } from '../actions/videoAction';

const initialState = {
  // ============ ESTADOS DE CARGA ============
  loading: false,
  loadingByCategory: {},
  trendingLoading: false,
  musicLoading: false,
  musicError: null,
  
  // ============ LISTAS DE VIDEOS ============
  videos: [],
  featuredVideos: [],
  popularVideos: [],
  relatedVideos: [],
  musicLibrary: [],
  trendingVideos: [],
  commercialVideos: [],
  nearbyVideos: [],
  myCommercialVideos: [],
  savedVideos: [],
  likedVideos: [],
  
  // ============ VIDEO ACTUAL ============
  currentVideo: null,
  pendingVideo: null,
  
  // ============ PAGINACIÓN ============
  total: 0,
  page: 1,
  totalPages: 0,
  hasMore: true,
  
  // ============ TRENDING PAGINACIÓN ============
  trendingHasMore: true,
  trendingPage: 1,
  trendingTimeWindow: 'week',
  
  // ============ COMERCIALES ============
  commercialStats: null,
  commercialPagination: null,
  myCommercialStats: null,
  myCommercialPagination: null,
  
  // ============ VIDEOS POR CATEGORÍA ============
  videosByCategory: {},
  
  // ============ VIDEOS DE USUARIO ============
  userVideos: {
    videos: [],
    total: 0,
    pendingCount: 0,
    approvedCount: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
    loading: false,
    error: null
  },
  
  // ============ GUARDADOS Y LIKED ============
  savedVideosTotal: 0,
  savedVideosPage: 1,
  savedVideosHasMore: false,
  likedVideosTotal: 0,
  likedVideosPage: 1,
  likedVideosHasMore: false
};

// ============================================
// 🔧 FUNCIÓN AUXILIAR - CONCATENAR VIDEOS SIN DUPLICADOS
// ============================================
const concatUniqueVideos = (existing, newVideos) => {
  if (!newVideos || !newVideos.length) return existing || [];
  const existingIds = new Set((existing || []).map(v => v?._id).filter(Boolean));
  const uniqueNew = newVideos.filter(v => v?._id && !existingIds.has(v._id));
  return [...(existing || []), ...uniqueNew];
};

// ============================================
// 🎯 VIDEO REDUCER
// ============================================
const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    
    // ============ ESTADOS DE CARGA ============
    case VIDEO_TYPES.LOADING:
      return { ...state, loading: action.payload };
      
    case VIDEO_TYPES.LOADING_BY_CATEGORY:
      return {
        ...state,
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.categorySlug]: action.payload.loading
        }
      };
      
    case VIDEO_TYPES.TRENDING_LOADING:
      return { ...state, trendingLoading: action.payload };
      
    case VIDEO_TYPES.MUSIC_LOADING:
      return { ...state, musicLoading: action.payload };
      
    case VIDEO_TYPES.MUSIC_ERROR:
      return { ...state, musicError: action.payload };
      
    // ============ CRUD BÁSICO ============
    case VIDEO_TYPES.CREATE_VIDEO:
      if (state.videos.some(v => v?._id === action.payload?._id)) return state;
      return { ...state, videos: [action.payload, ...state.videos] };
      
    case VIDEO_TYPES.UPDATE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v => v?._id === action.payload?._id ? action.payload : v),
        currentVideo: state.currentVideo?._id === action.payload?._id ? action.payload : state.currentVideo,
        featuredVideos: state.featuredVideos.map(v => v?._id === action.payload?._id ? action.payload : v),
        trendingVideos: state.trendingVideos.map(v => v?._id === action.payload?._id ? action.payload : v)
      };
      
    case VIDEO_TYPES.DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(v => v?._id !== action.payload),
        currentVideo: state.currentVideo?._id === action.payload ? null : state.currentVideo,
        featuredVideos: state.featuredVideos.filter(v => v?._id !== action.payload),
        trendingVideos: state.trendingVideos.filter(v => v?._id !== action.payload)
      };
      
    case VIDEO_TYPES.GET_VIDEO:
      return { ...state, currentVideo: action.payload, loading: false };
      
    case VIDEO_TYPES.GET_PENDING_VIDEO:
      return { ...state, pendingVideo: action.payload };
      
    // ============ LISTADOS PÚBLICOS ============
    case VIDEO_TYPES.GET_VIDEOS:
      return {
        ...state,
        videos: action.payload.page === 1
          ? action.payload.videos
          : concatUniqueVideos(state.videos, action.payload.videos),
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        hasMore: action.payload.hasMore,
        loading: false
      };
      
    case VIDEO_TYPES.GET_FEATURED_VIDEOS:
      return { ...state, featuredVideos: action.payload };
      
    case VIDEO_TYPES.GET_POPULAR_VIDEOS:
      return { ...state, popularVideos: action.payload };
      
    case VIDEO_TYPES.GET_RELATED_VIDEOS:
      return { ...state, relatedVideos: action.payload };
      
    case VIDEO_TYPES.GET_MUSIC_LIBRARY:
      return { ...state, musicLibrary: action.payload, musicLoading: false };
      
    // ============ VIDEOS POR CATEGORÍA ============
    case VIDEO_TYPES.GET_VIDEOS_BY_CATEGORY:
      const slug = action.payload.categorySlug;
      const existingCatVideos = state.videosByCategory[slug]?.videos || [];
      const newCatVideos = action.payload.videos || [];
      const combined = action.payload.page === 1
        ? newCatVideos
        : concatUniqueVideos(existingCatVideos, newCatVideos);
      
      return {
        ...state,
        videosByCategory: {
          ...state.videosByCategory,
          [slug]: {
            videos: combined,
            total: action.payload.total || 0,
            page: action.payload.page || 1,
            totalPages: action.payload.totalPages || 1,
            hasMore: action.payload.hasMore || false,
            children: action.payload.children || []
          }
        },
        loadingByCategory: {
          ...state.loadingByCategory,
          [slug]: false
        }
      };
      
    // ============ TRENDING ============
    case VIDEO_TYPES.GET_TRENDING_VIDEOS:
      return {
        ...state,
        trendingVideos: action.payload.videos,
        trendingLoading: false,
        trendingHasMore: action.payload.hasMore,
        trendingPage: action.payload.page,
        trendingTimeWindow: action.payload.timeWindow
      };
      
    case VIDEO_TYPES.LOAD_MORE_TRENDING:
      return {
        ...state,
        trendingVideos: concatUniqueVideos(state.trendingVideos, action.payload.videos),
        trendingHasMore: action.payload.hasMore,
        trendingPage: action.payload.page
      };
      
    // ============ INTERACCIONES ============
    case VIDEO_TYPES.LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v =>
          v?._id === action.payload.id
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, likes: action.payload.likes, liked: action.payload.liked }
          : state.currentVideo,
        trendingVideos: state.trendingVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        )
      };
      
    case VIDEO_TYPES.SHARE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v =>
          v?._id === action.payload.id
            ? { ...v, shares: action.payload.shares, shared: action.payload.shared }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, shares: action.payload.shares, shared: action.payload.shared }
          : state.currentVideo
      };
      
    case VIDEO_TYPES.INCREMENT_VIEW:
      return {
        ...state,
        videos: state.videos.map(v =>
          v?._id === action.payload.videoId
            ? { ...v, views: action.payload.views }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.videoId
          ? { ...state.currentVideo, views: action.payload.views }
          : state.currentVideo,
        trendingVideos: state.trendingVideos.map(v =>
          v?._id === action.payload.videoId
            ? { ...v, views: action.payload.views }
            : v
        )
      };
      
    // ============ ESTADÍSTICAS ============
    case VIDEO_TYPES.UPDATE_VIDEO_STATS:
      return {
        ...state,
        currentVideo: state.currentVideo?._id === action.payload.videoId
          ? { ...state.currentVideo, ...action.payload.stats }
          : state.currentVideo
      };
      
    case VIDEO_TYPES.UPDATE_VIDEO_ENGAGEMENT:
      return {
        ...state,
        currentVideo: state.currentVideo?._id === action.payload.videoId
          ? { ...state.currentVideo, engagementScore: action.payload.engagementScore }
          : state.currentVideo
      };
      
    // ============ VIDEOS GUARDADOS ============
    case 'GET_SAVED_VIDEOS':
      return {
        ...state,
        savedVideos: action.payload.videos || action.payload || [],
        savedVideosTotal: action.payload.total || (action.payload || []).length,
        savedVideosPage: action.payload.page || 1,
        savedVideosHasMore: action.payload.hasMore || false
      };
      
    case 'GET_LIKED_VIDEOS':
      return {
        ...state,
        likedVideos: action.payload.videos || action.payload || [],
        likedVideosTotal: action.payload.total || (action.payload || []).length,
        likedVideosPage: action.payload.page || 1,
        likedVideosHasMore: action.payload.hasMore || false
      };
      
    // ============ COMERCIALES ============
    case VIDEO_TYPES.GET_COMMERCIAL_VIDEOS:
      return {
        ...state,
        commercialVideos: action.payload.videos,
        commercialStats: action.payload.stats,
        commercialPagination: action.payload.pagination,
        loading: false
      };
      
    case VIDEO_TYPES.GET_NEARBY_VIDEOS:
      return {
        ...state,
        nearbyVideos: action.payload,
        loading: false
      };
      
    case VIDEO_TYPES.GET_MY_COMMERCIAL_VIDEOS:
      return {
        ...state,
        myCommercialVideos: action.payload.videos,
        myCommercialStats: action.payload.stats,
        myCommercialPagination: action.payload.pagination,
        loading: false
      };
      
    case VIDEO_TYPES.UPDATE_VIDEO_STOCK:
      return {
        ...state,
        commercialVideos: state.commercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, stock: action.payload.stock }
            : v
        ),
        myCommercialVideos: state.myCommercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, stock: action.payload.stock }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, stock: action.payload.stock }
          : state.currentVideo
      };
      
    case VIDEO_TYPES.UPDATE_VIDEO_WHOLESALE:
      return {
        ...state,
        commercialVideos: state.commercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, wholesale: action.payload.wholesale, minQuantity: action.payload.minQuantity }
            : v
        ),
        myCommercialVideos: state.myCommercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, wholesale: action.payload.wholesale, minQuantity: action.payload.minQuantity }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, wholesale: action.payload.wholesale, minQuantity: action.payload.minQuantity }
          : state.currentVideo
      };
      
    case VIDEO_TYPES.UPDATE_VIDEO_LOCATION:
      return {
        ...state,
        commercialVideos: state.commercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, wilaya: action.payload.location?.wilaya, commune: action.payload.location?.commune, location: action.payload.location }
            : v
        ),
        myCommercialVideos: state.myCommercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, wilaya: action.payload.location?.wilaya, commune: action.payload.location?.commune, location: action.payload.location }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, wilaya: action.payload.location?.wilaya, commune: action.payload.location?.commune, location: action.payload.location }
          : state.currentVideo
      };
      
    case VIDEO_TYPES.FEATURE_VIDEO:
      return {
        ...state,
        commercialVideos: state.commercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, isFeatured: action.payload.isFeatured }
            : v
        ),
        myCommercialVideos: state.myCommercialVideos.map(v =>
          v?._id === action.payload.id
            ? { ...v, isFeatured: action.payload.isFeatured }
            : v
        ),
        featuredVideos: action.payload.isFeatured
          ? [...state.featuredVideos, state.currentVideo]
          : state.featuredVideos.filter(v => v?._id !== action.payload.id)
      };
      
    // ============ VIDEOS DE USUARIO ============
    case VIDEO_TYPES.GET_USER_VIDEOS_REQUEST:
      return {
        ...state,
        userVideos: {
          ...state.userVideos,
          loading: true,
          error: null
        }
      };
      
    case VIDEO_TYPES.GET_USER_VIDEOS_SUCCESS:
      return {
        ...state,
        userVideos: {
          videos: action.payload.videos,
          total: action.payload.total,
          pendingCount: action.payload.pendingCount,
          approvedCount: action.payload.approvedCount,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          hasMore: action.payload.hasMore,
          loading: false,
          error: null
        }
      };
      
    case VIDEO_TYPES.GET_USER_VIDEOS_FAIL:
      return {
        ...state,
        userVideos: {
          ...state.userVideos,
          loading: false,
          error: action.payload
        }
      };
      
    case VIDEO_TYPES.CLEAR_USER_VIDEOS:
      return {
        ...state,
        userVideos: {
          videos: [],
          total: 0,
          pendingCount: 0,
          approvedCount: 0,
          page: 1,
          totalPages: 1,
          hasMore: false,
          loading: false,
          error: null
        }
      };
      
    // ============ DEFAULT ============
    default:
      return state;
  }
};

export default videoReducer;