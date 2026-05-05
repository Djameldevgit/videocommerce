// 📂 redux/reducers/postAproveReducer.js

import { POST_TYPES_APROVE } from '../actions/postAproveAction';

const initialState = {
  postsPendientes: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasMore: false,
  filters: {} // 🔥 NUEVO: almacenar filtros aplicados
};

const postAproveReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES_APROVE.LOADING_POST:
      return { ...state, loading: action.payload };
      
      case POST_TYPES_APROVE.GET_POSTS_PENDIENTES:
        return {
          ...state,
          postsPendientes: action.payload.posts,
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
          hasMore: action.payload.hasMore,
          filters: action.payload.filters || {},
          loading: false
        };
    case POST_TYPES_APROVE.LOAD_MORE_PENDIENTES:
      return {
        ...state,
        postsPendientes: [...state.postsPendientes, ...action.payload.posts],
        page: action.payload.page,
        hasMore: action.payload.hasMore,
        loading: false
      };
      
    case POST_TYPES_APROVE.APROVAR_POST_PENDIENTE:
      return {
        ...state,
        postsPendientes: state.postsPendientes.filter(
          post => post._id !== action.payload.post._id
        ),
        total: state.total - 1
      };
      
    case POST_TYPES_APROVE.RESET_PENDIENTES:
      return initialState;
      
    default:
      return state;
  }
};

export default postAproveReducer;