// 📂 redux/reducers/postReducer.js - VERSIÓN CORREGIDA CON FILTRO pendiente

import { POST_TYPES } from '../actions/postAction';
import { GLOBALTYPES } from '../actions/globalTypes';
import { DeleteData } from '../actions/globalTypes';

const initialState = {
  loading: false,
  posts: [],
  result: 0,
  page: 1,
  detailPost: null,
  postToEdit: null,
  error: null,
  filters: {
    categoryId: null,
    subcategory: null,
    article: null,
    priceRange: null,
    location: null
  },
  
  // Posts similares - UNIFICADO
  similarPosts: [],
  similarPostsTotal: 0,
  similarPostsPage: 1,
  similarPostsTotalPages: 1,
  similarPostsHasMore: false,
  similarLoading: false,
  currentSimilarPostId: null,

  // PAGINACIÓN CATEGORÍAS
  postsLoading: false,
  loadingMorePosts: false,
  postsError: null,
  hasMorePosts: true,
  postsLastUpdate: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 12
  },
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== GET POST PARA EDITAR ==========
    case POST_TYPES.GET_POST_BY_ID:
      console.log('📝 REDUCER GET_POST_BY_ID:', action.payload);
      return {
        ...state,
        postToEdit: action.payload,
        loading: false
      };

    // ========== CATEGORY POSTS PAGINADOS ==========
    case POST_TYPES.LOADING_MORE_POSTS:
      return { ...state, loadingMorePosts: true, postsError: null };

    case POST_TYPES.LOAD_MORE_POSTS_SUCCESS: {
      const payloadPagination = action.payload.pagination || {};
      // 🔥 FILTRAR posts pendientes
      const filteredNewPosts = (action.payload.posts || []).filter(post => post.pendiente === false);
      return {
        ...state,
        loadingMorePosts: false,
        posts: [...state.posts, ...filteredNewPosts],
        hasMorePosts: payloadPagination.hasMore ?? false,
        pagination: {
          currentPage: payloadPagination.currentPage || state.pagination.currentPage,
          totalPages: payloadPagination.totalPages || state.pagination.totalPages,
          totalPosts: payloadPagination.totalPosts || state.pagination.totalPosts,
          limit: payloadPagination.limit || state.pagination.limit
        }
      };
    }

    case POST_TYPES.LOAD_MORE_POSTS_FAIL:
      return { ...state, loadingMorePosts: false, postsError: action.payload };

    case POST_TYPES.RESET_CATEGORY_POSTS:
      return {
        ...state,
        posts: [],
        postsLoading: false,
        loadingMorePosts: false,
        hasMorePosts: true,
        postsError: null,
        pagination: { ...initialState.pagination }
      };

    // ========== POSTS GENERALES ==========
    case POST_TYPES.LOADING_POST:
      return { ...state, loading: action.payload };

    case POST_TYPES.CREATE_POST:
      // 🔥 NO agregar posts pendientes al home
      if (action.payload.pendiente === true) {
        return state;
      }
      return { 
        ...state, 
        posts: [action.payload, ...state.posts], 
        result: state.result + 1,
        postsLastUpdate: Date.now()
      };

    case POST_TYPES.GET_POSTS:
      // 🔥 FILTRAR posts pendientes
      const filteredPosts = (action.payload.posts || []).filter(post => post.pendiente === false);
      return {
        ...state,
        posts: filteredPosts,
        result: action.payload.total || 0,
        page: action.payload.page || 1,
        loading: false
      };

    case POST_TYPES.GET_POST:
      return { ...state, detailPost: action.payload, loading: false };

    // ========== UPDATE POST - VERSIÓN CORREGIDA ==========
    case POST_TYPES.UPDATE_POST: {
      console.log('🔄 REDUCER UPDATE_POST:', {
        id: action.payload?._id,
        title: action.payload?.title,
        pendiente: action.payload?.pendiente,
        categoryChanged: action.payload?._categoryChanged
      });

      // 1. Actualizar detailPost si es el post que estamos viendo
      const newDetailPost = state.detailPost?._id === action.payload._id 
        ? action.payload 
        : state.detailPost;

      // 2. Buscar el post anterior en la lista
      const oldPost = state.posts.find(p => p._id === action.payload._id);
      
      // 3. Verificar si cambió de categoría
      const categoryChanged = oldPost && (
        oldPost.categorie !== action.payload.categorie ||
        oldPost.subCategory !== action.payload.subCategory ||
        String(oldPost.category) !== String(action.payload.category)
      );

      // 4. Actualizar la lista de posts
      let updatedPosts = [...state.posts];
      
      if (categoryChanged) {
        // Si cambió de categoría, QUITAMOS el post de la lista actual
        updatedPosts = updatedPosts.filter(post => post._id !== action.payload._id);
        console.log('🗑️ Post removido de la lista actual por cambio de categoría');
      } else {
        // Si no cambió de categoría, actualizamos normalmente
        updatedPosts = updatedPosts.map(post => 
          post._id === action.payload._id ? action.payload : post
        );
      }
      
      // 🔥 Si el post se volvió pendiente (después de editar), lo quitamos de la lista
      if (action.payload.pendiente === true && oldPost?.pendiente === false) {
        updatedPosts = updatedPosts.filter(post => post._id !== action.payload._id);
        console.log('🗑️ Post removido porque ahora está pendiente');
      }

      // 5. Si el post que se está editando es el postToEdit, actualizarlo también
      const newPostToEdit = state.postToEdit?._id === action.payload._id
        ? action.payload
        : state.postToEdit;

      return {
        ...state,
        posts: updatedPosts,
        detailPost: newDetailPost,
        postToEdit: newPostToEdit,
        postsLastUpdate: Date.now()
      };
    }

    case POST_TYPES.DELETE_POST:
      return { 
        ...state, 
        posts: DeleteData(state.posts, action.payload._id),
        postsLastUpdate: Date.now()
      };

    case POST_TYPES.SET_POST_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        posts: [],
        page: 1,
        result: 0,
        pagination: { ...initialState.pagination }
      };

    // ========== POSTS SIMILARES - CORREGIDO ==========
    case POST_TYPES.LOADING_SIMILAR_POSTS:
      console.log('⏳ REDUCER LOADING_SIMILAR_POSTS:', action.payload);
      return {
        ...state,
        similarLoading: action.payload
      };

    case POST_TYPES.GET_SIMILAR_POSTS:
      console.log('🔥 REDUCER GET_SIMILAR_POSTS');
      
      const { 
        posts: newSimilarPosts = [],
        page: newPage = 1,
        total: newTotal = 0,
        totalPages: newTotalPages = 1,
        hasMore: newHasMore = false,
        currentPostId: newCurrentPostId 
      } = action.payload;
      
      const safeSimilarPosts = Array.isArray(newSimilarPosts) ? newSimilarPosts : [];
      
      // Si es página 1 o es un post diferente, reemplazar
      if (newPage === 1 || newCurrentPostId !== state.currentSimilarPostId) {
        return {
          ...state,
          similarPosts: safeSimilarPosts,
          similarPostsTotal: newTotal,
          similarPostsPage: newPage,
          similarPostsTotalPages: newTotalPages,
          similarPostsHasMore: newHasMore,
          similarLoading: false,
          currentSimilarPostId: newCurrentPostId,
          error: null
        };
      }
      
      // Agregar más posts (paginación)
      return {
        ...state,
        similarPosts: [...state.similarPosts, ...safeSimilarPosts],
        similarPostsTotal: newTotal,
        similarPostsPage: newPage,
        similarPostsTotalPages: newTotalPages,
        similarPostsHasMore: newHasMore,
        similarLoading: false,
        error: null
      };

    case POST_TYPES.CLEAR_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: [],
        similarPostsTotal: 0,
        similarPostsPage: 1,
        similarPostsTotalPages: 1,
        similarPostsHasMore: false,
        similarLoading: false,
        currentSimilarPostId: null
      };

    // ========== LIKES & SAVES ==========
    case POST_TYPES.LIKE_POST:
    case POST_TYPES.UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload._id ? action.payload : post),
        detailPost: state.detailPost?._id === action.payload._id ? action.payload : state.detailPost,
        postToEdit: state.postToEdit?._id === action.payload._id ? action.payload : state.postToEdit
      };

    case POST_TYPES.SAVE_POST:
    case POST_TYPES.UNSAVE_POST:
      const updateSaveInList = (list) => list.map(post => 
        post._id === action.payload.postId 
          ? { ...post, saved: action.payload.saved } 
          : post
      );
      return {
        ...state,
        posts: updateSaveInList(state.posts),
        detailPost: state.detailPost?._id === action.payload.postId 
          ? { ...state.detailPost, saved: action.payload.saved }
          : state.detailPost,
        postToEdit: state.postToEdit?._id === action.payload.postId
          ? { ...state.postToEdit, saved: action.payload.saved }
          : state.postToEdit
      };

    // ========== ERRORES ==========
    case POST_TYPES.ERROR_POST:
      return { ...state, error: action.payload, loading: false, similarLoading: false };

    case POST_TYPES.CLEAR_POST_ERROR:
      return { ...state, error: null };

    case POST_TYPES.RESET_POST_STATE:
      return { ...initialState };

    case GLOBALTYPES.ALERT:
      if (action.payload.error && action.payload.error.includes('post')) {
        return { ...state, error: action.payload.error };
      }
      return state;

    default:
      return state;
  }
};

export default postReducer;