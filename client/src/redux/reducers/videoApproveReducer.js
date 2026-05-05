// redux/reducers/videoApproveReducer.js
import { VIDEO_APPROVE_TYPES } from '../actions/videoApproveAction';

const initialState = {
  videos: [],
  loading: false,
  total: 0,
  page: 1,
  totalPages: 1,
  stats: { commercial: 0, normal: 0, total: 0 } // 🆕 AÑADIR STATS
};

const videoApproveReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_APPROVE_TYPES.LOADING:
      return { ...state, loading: action.payload };
      
    case VIDEO_APPROVE_TYPES.GET_VIDEOS_PENDIENTES:
      return {
        ...state,
        videos: action.payload.videos,
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false
      };
      
    case VIDEO_APPROVE_TYPES.APROBAR_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(v => v._id !== action.payload),
        total: state.total - 1
      };
      
    case VIDEO_APPROVE_TYPES.ELIMINAR_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(v => v._id !== action.payload),
        total: state.total - 1
      };
      
    case VIDEO_APPROVE_TYPES.UPDATE_PAGINATION:
      return { ...state, page: action.payload };
      case VIDEO_APPROVE_TYPES.GET_VIDEOS_PENDIENTES:
        return {
          ...state,
          videos: action.payload.videos,
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          stats: action.payload.stats || state.stats,
          loading: false
        };
    
    default:
      return state;
  }
};

export default videoApproveReducer;