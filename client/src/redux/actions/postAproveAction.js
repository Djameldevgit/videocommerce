// 📂 redux/actions/postAproveAction.js - VERSIÓN MEJORADA
import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { createNotify } from './notifyAction'

export const POST_TYPES_APROVE = {
  LOADING_POST: 'LOADING_POST',
  APROVAR_POST_PENDIENTE: 'APROVAR_POST_PENDIENTE',
  GET_POSTS_PENDIENTES: 'GET_POSTS_PENDIENTES',
  LOAD_MORE_PENDIENTES: 'LOAD_MORE_PENDIENTES',
  RESET_PENDIENTES: 'RESET_PENDIENTES'
}

// ✅ APROBAR POST PENDIENTE CON NOTIFICACIÓN MEJORADA
export const aprovarPostPendiente = ({ post, estado, auth, socket }) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });

    const res = await patchDataAPI(`post/${post._id}/aprobar`, { estado }, auth.token);
    
    dispatch({
      type: POST_TYPES_APROVE.APROVAR_POST_PENDIENTE,
      payload: res.data,
    });

    // ✅ Mejorar el mensaje de notificación según el estado
    const isApproved = estado === 'aprobado';
    
    const notifyMsg = {
      id: auth.user._id,
      text: isApproved ? '✅ Votre annonce a été approuvée' : '❌ Votre annonce a été rejetée',
      textNs: 'notify',
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      content: post.title,
      image: post.images?.[0]?.url,
      type: 'post'
    };

    dispatch(createNotify({ msg: notifyMsg, auth, socket }));

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg || `Post ${isApproved ? 'approuvé' : 'rejeté'} avec succès` } });

  } catch (error) {
    console.error("Error en aprobarPostPendiente:", error);
    
    const errorMessage = error.response?.data?.msg || 
                        error.message || 
                        "Error inesperado";
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: errorMessage },
    });
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  }
};

// 🔥 GET POSTS PENDIENTES CON PAGINACIÓN Y FILTROS
export const getPostsPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });
    
    let url = `posts/admin/pendientes?page=${page}&limit=${limit}`;
    if (filters.categorie) {
      url += `&categorie=${encodeURIComponent(filters.categorie)}`;
    }
    if (filters.subCategory) {
      url += `&subCategory=${encodeURIComponent(filters.subCategory)}`;
    }
    
    const res = await getDataAPI(url, token);

    dispatch({
      type: POST_TYPES_APROVE.GET_POSTS_PENDIENTES,
      payload: {
        posts: res.data.posts,
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
        hasMore: res.data.hasMore,
        filters: res.data.filters || {}
      }
    });

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  } catch (err) {
    console.error("Error en getPostsPendientes:", err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  }
};

// 🔥 CARGAR MÁS POSTS (INFINITE SCROLL)
export const loadMorePendientes = (token, page, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });
    
    const res = await getDataAPI(`posts/admin/pendientes?page=${page}&limit=${limit}`, token);

    dispatch({
      type: POST_TYPES_APROVE.LOAD_MORE_PENDIENTES,
      payload: {
        posts: res.data.posts,
        page: res.data.page,
        hasMore: res.data.hasMore
      }
    });

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  } catch (err) {
    console.error("Error en loadMorePendientes:", err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  }
};

// 🔥 RESETEAR ESTADO
export const resetPendientes = () => (dispatch) => {
  dispatch({ type: POST_TYPES_APROVE.RESET_PENDIENTES });
};