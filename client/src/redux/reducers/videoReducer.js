// redux/reducers/videoReducer.js
import { VIDEO_TYPES } from '../actions/videoAction';

const initialState = {
  loading: false,
  videos: [],
  featuredVideos: [],
  popularVideos: [],
  relatedVideos: [],
  currentVideo: null,
  total: 0,
  page: 1,
  totalPages: 0,
  hasMore: true,
  children: [],
  pendingVideo: null,
  musicLibrary: [],
  musicLoading: false,
  musicError: null,
  videosByCategory: {},
  loadingByCategory: {},
  
  trendingVideos: [],
  trendingLoading: false,
  trendingHasMore: true,
  trendingPage: 1,
  trendingTimeWindow: 'week',
  
  commercialVideos: [],
  commercialStats: null,
  commercialPagination: null,
  nearbyVideos: [],
  myCommercialVideos: [],
  myCommercialStats: null,
  myCommercialPagination: null
};

// Función auxiliar para concatenar arrays sin duplicados
const concatUniqueVideos = (existing, newVideos) => {
  const existingIds = new Set(existing.map(v => v._id));
  const uniqueNew = newVideos.filter(v => !existingIds.has(v._id));
  return [...existing, ...uniqueNew];
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
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

    case VIDEO_TYPES.GET_FEATURED_VIDEOS:
      return { ...state, featuredVideos: action.payload };

    case VIDEO_TYPES.GET_POPULAR_VIDEOS:
      return { ...state, popularVideos: action.payload };

    case VIDEO_TYPES.GET_RELATED_VIDEOS:
      return { ...state, relatedVideos: action.payload };

    // ✅ CORREGIDO: filtrado de duplicados en paginación
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
        children: action.payload.children || [],
        loading: false
      };

    case VIDEO_TYPES.GET_VIDEO:
      return { ...state, currentVideo: action.payload, loading: false };

    // ✅ CORREGIDO: categoría también sin duplicados
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

    // Resto de casos sin cambios importantes (solo asegurar que tampoco dupliquen)
    case VIDEO_TYPES.CREATE_VIDEO:
      // Al crear, evitar duplicados inmediatos (opcional)
      if (state.videos.some(v => v._id === action.payload._id)) return state;
      return { ...state, videos: [action.payload, ...state.videos] };

    case VIDEO_TYPES.UPDATE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v => v._id === action.payload._id ? action.payload : v),
        currentVideo: state.currentVideo?._id === action.payload._id ? action.payload : state.currentVideo
      };

    case VIDEO_TYPES.DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(v => v._id !== action.payload),
        currentVideo: state.currentVideo?._id === action.payload ? null : state.currentVideo
      };

    case VIDEO_TYPES.LIKE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v =>
          v._id === action.payload.id
            ? { ...v, likes: action.payload.likes, liked: action.payload.liked }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, likes: action.payload.likes, liked: action.payload.liked }
          : state.currentVideo
      };

    case VIDEO_TYPES.SHARE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(v =>
          v._id === action.payload.id
            ? { ...v, shares: action.payload.shares, shared: action.payload.shared }
            : v
        ),
        currentVideo: state.currentVideo?._id === action.payload.id
          ? { ...state.currentVideo, shares: action.payload.shares, shared: action.payload.shared }
          : state.currentVideo
      };

    // ... el resto de casos (música, trending, comerciales) se mantienen igual
    // pero también pueden aplicar la misma lógica si concatenan arrays
    case VIDEO_TYPES.GET_TRENDING_VIDEOS:
      return {
        ...state,
        trendingVideos: action.payload.videos, // reemplaza, no concatena
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
            v._id === action.payload.id
              ? { ...v, stock: action.payload.stock }
              : v
          ),
          myCommercialVideos: state.myCommercialVideos.map(v =>
            v._id === action.payload.id
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
            v._id === action.payload.id
              ? { ...v, wholesale: action.payload.wholesale, minQuantity: action.payload.minQuantity }
              : v
          ),
          myCommercialVideos: state.myCommercialVideos.map(v =>
            v._id === action.payload.id
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
            v._id === action.payload.id
              ? { ...v, wilaya: action.payload.location.wilaya, commune: action.payload.location.commune, location: action.payload.location }
              : v
          ),
          myCommercialVideos: state.myCommercialVideos.map(v =>
            v._id === action.payload.id
              ? { ...v, wilaya: action.payload.location.wilaya, commune: action.payload.location.commune, location: action.payload.location }
              : v
          ),
          currentVideo: state.currentVideo?._id === action.payload.id
            ? { ...state.currentVideo, wilaya: action.payload.location.wilaya, commune: action.payload.location.commune, location: action.payload.location }
            : state.currentVideo
        };
        
      case VIDEO_TYPES.FEATURE_VIDEO:
        return {
          ...state,
          commercialVideos: state.commercialVideos.map(v =>
            v._id === action.payload.id
              ? { ...v, isFeatured: action.payload.isFeatured }
              : v
          ),
          myCommercialVideos: state.myCommercialVideos.map(v =>
            v._id === action.payload.id
              ? { ...v, isFeatured: action.payload.isFeatured }
              : v
          ),
          featuredVideos: action.payload.isFeatured
            ? [...state.featuredVideos, state.currentVideo]
            : state.featuredVideos.filter(v => v?._id !== action.payload.id)
        };
        

    default:
      return state;
  }
};

export default videoReducer;