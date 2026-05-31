// redux/actions/videoAction.js - VERSIÓN CON NOTIFICACIONES
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify
// redux/actions/videoAction.js

// redux/actions/videoAction.js - AGREGAR ESTOS TIPOS

export const VIDEO_TYPES = {
  LOADING: 'VIDEO_LOADING',
  LOADING_BY_CATEGORY: 'LOADING_BY_CATEGORY',
  GET_VIDEOS: 'GET_VIDEOS',
  GET_VIDEO: 'GET_VIDEO',
  GET_FEATURED_VIDEOS: 'GET_FEATURED_VIDEOS',
  GET_POPULAR_VIDEOS: 'GET_POPULAR_VIDEOS',
  GET_RELATED_VIDEOS: 'GET_RELATED_VIDEOS',
  GET_VIDEOS_BY_CATEGORY: 'GET_VIDEOS_BY_CATEGORY',
  GET_TRENDING_VIDEOS: 'GET_TRENDING_VIDEOS',
  TRENDING_LOADING: 'TRENDING_LOADING',
  LOAD_MORE_TRENDING: 'LOAD_MORE_TRENDING',
  CREATE_VIDEO: 'CREATE_VIDEO',
  UPDATE_VIDEO: 'UPDATE_VIDEO',
  DELETE_VIDEO: 'DELETE_VIDEO',
  LIKE_VIDEO: 'LIKE_VIDEO',
  SHARE_VIDEO: 'SHARE_VIDEO',
  UPDATE_VIDEO_STATS: 'UPDATE_VIDEO_STATS',
  UPDATE_VIDEO_ENGAGEMENT: 'UPDATE_VIDEO_ENGAGEMENT',
  INCREMENT_VIEW: 'INCREMENT_VIEW',
  MUSIC_LOADING: 'MUSIC_LOADING',
  GET_MUSIC_LIBRARY: 'GET_MUSIC_LIBRARY',
  MUSIC_ERROR: 'MUSIC_ERROR',
  GET_PENDING_VIDEO: 'GET_PENDING_VIDEO',
  
  // 🆕 TIPOS COMERCIALES
  GET_COMMERCIAL_VIDEOS: 'GET_COMMERCIAL_VIDEOS',
  GET_NEARBY_VIDEOS: 'GET_NEARBY_VIDEOS',
  UPDATE_VIDEO_STOCK: 'UPDATE_VIDEO_STOCK',
  UPDATE_VIDEO_WHOLESALE: 'UPDATE_VIDEO_WHOLESALE',
  UPDATE_VIDEO_LOCATION: 'UPDATE_VIDEO_LOCATION',
  GET_MY_COMMERCIAL_VIDEOS: 'GET_MY_COMMERCIAL_VIDEOS',
  FEATURE_VIDEO: 'FEATURE_VIDEO'
};

// redux/actions/categoryAction.js - AÑADIR ESTAS ACCIONES

export const getCategoriesWithVideos = (page = 1, limit = 2) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORIES_WITH_VIDEOS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/with-videos`, {
      params: { page, limit, videosPerCategory: 6 }
    });
    
    dispatch({
      type: types.GET_CATEGORIES_WITH_VIDEOS_SUCCESS,
      payload: {
        categories: data.categories || [],
        currentPage: data.currentPage || page,
        hasMore: data.hasMore || false,
        total: data.total || 0
      }
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_CATEGORIES_WITH_VIDEOS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};
 

// ✅ Obtener videos guardados
export const getSavedVideos = (token, page = 1, limit = 12) => async (dispatch) => {
  try {
    console.log('📥 getSavedVideos - token presente:', !!token);
    
    // ✅ URL CORRECTA - sin token en la URL
    const url = `user/saved-videos?page=${page}&limit=${limit}`;
    const res = await getDataAPI(url, token);
    
    console.log('✅ getSavedVideos - respuesta:', res.data?.savedVideos?.length || 0, 'videos');
    
    dispatch({
      type: 'GET_SAVED_VIDEOS',
      payload: res.data.savedVideos || []
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ getSavedVideos error:', err);
    return { success: false };
  }
};

// ✅ Obtener videos liked
export const getLikedVideos = (token, page = 1, limit = 12) => async (dispatch) => {
  try {
    console.log('📥 getLikedVideos - token presente:', !!token);
    
    // ✅ URL CORRECTA - sin token en la URL
    const url = `user/liked-videos?page=${page}&limit=${limit}`;
    const res = await getDataAPI(url, token);
    
    console.log('✅ getLikedVideos - respuesta:', res.data?.likedVideos?.length || 0, 'videos');
    
    dispatch({
      type: 'GET_LIKED_VIDEOS',
      payload: res.data.likedVideos || []
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ getLikedVideos error:', err);
    return { success: false };
  }
};
export const loadMoreCategories = (page = 1, limit = 2) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.LOAD_MORE_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/with-videos`, {
      params: { page, limit, videosPerCategory: 6 }
    });
    
    const state = getState();
    const currentCategories = state.category.categoriesWithVideos || [];
    
    dispatch({
      type: types.GET_CATEGORIES_WITH_VIDEOS_SUCCESS,
      payload: {
        categories: [...currentCategories, ...(data.categories || [])],
        currentPage: data.currentPage || page,
        hasMore: data.hasMore || false,
        total: data.total || 0
      }
    });
    
    return data;
  } catch (error) {
    dispatch({
      type: types.GET_CATEGORIES_WITH_VIDEOS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};
export const filterCommercialVideos = (filters, page = 1, limit = 12) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.wilaya) params.append('wilaya', filters.wilaya);
    if (filters.commune) params.append('commune', filters.commune);
    if (filters.wholesale !== undefined && filters.wholesale !== '') params.append('wholesale', filters.wholesale);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
    
    const res = await getDataAPI(`videos/commercial/filter?${params.toString()}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_COMMERCIAL_VIDEOS,
      payload: {
        videos: res.data.videos,
        pagination: res.data.pagination,
        stats: res.data.stats
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error filterCommercialVideos:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// Videos cerca de ubicación
export const getNearbyVideos = (longitude, latitude, maxDistance = 10000, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/commercial/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}&limit=${limit}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_NEARBY_VIDEOS,
      payload: res.data.videos
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getNearbyVideos:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// Obtener mis videos comerciales
export const getMyCommercialVideos = (token, page = 1) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/commercial/my-videos?page=${page}&limit=12`, token);
    
    dispatch({
      type: VIDEO_TYPES.GET_MY_COMMERCIAL_VIDEOS,
      payload: {
        videos: res.data.videos,
        stats: res.data.stats,
        pagination: res.data.pagination
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getMyCommercialVideos:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// Actualizar stock
export const updateVideoStock = (id, stockData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/commercial/update-stock/${id}`, stockData, token);
    
    if (res.data.success) {
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO_STOCK,
        payload: { id, stock: res.data.stock }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Stock actualizado correctamente' }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error updateVideoStock:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al actualizar stock' }
    });
    return null;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Toggle venta al mayor
export const toggleWholesale = (id, wholesaleData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/commercial/toggle-wholesale/${id}`, wholesaleData, token);
    
    if (res.data.success) {
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO_WHOLESALE,
        payload: { id, wholesale: res.data.video.wholesale, minQuantity: res.data.video.minQuantity }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error toggleWholesale:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al actualizar' }
    });
    return null;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Actualizar ubicación
export const updateVideoLocation = (id, locationData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/commercial/update-location/${id}`, locationData, token);
    
    if (res.data.success) {
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO_LOCATION,
        payload: { id, location: res.data.location }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Ubicación actualizada correctamente' }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error updateVideoLocation:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al actualizar ubicación' }
    });
    return null;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Destacar video comercial (admin)
export const featureCommercialVideo = (id, token, isFeatured) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`admin/videos/commercial/${id}/feature`, { isFeatured }, token);
    
    if (res.data.success) {
      dispatch({
        type: VIDEO_TYPES.FEATURE_VIDEO,
        payload: { id, isFeatured: res.data.isFeatured }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error featureCommercialVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al destacar video' }
    });
    return null;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
export const incrementView = (videoId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${videoId}/view`, {}, token);
    
    if (res.data.success) {
      // Actualizar el video en el estado global
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO_STATS,
        payload: {
          videoId,
          stats: { views: res.data.views }
        }
      });
      
      return { success: true, views: res.data.views };
    }
  } catch (err) {
    console.error('Error incrementando vista:', err);
    return { success: false, error: err.response?.data?.message };
  }
};
// ✅ Crear video CON NOTIFICACIÓN
// redux/actions/videoAction.js - createVideo CORREGIDO

// ✅ Crear video CON NOTIFICACIÓN a ADMINISTRADORES
// redux/actions/videoAction.js - createVideo CORREGIDO


// client/src/redux/actions/videoAction.js

export const createVideo = (videoData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    // 👇 La clave está en esperar la respuesta y guardarla
    const res = await postDataAPI('videos', videoData, token);

    // (Opcional) Aquí puedes despachar otras acciones si las tienes
    // dispatch({ type: VIDEO_TYPES.CREATE_VIDEO, payload: res.data.video });

    // ✅ Devolvemos el objeto con los datos de la respuesta y éxito
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error createVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la création' }
    });
    // ✅ Devolvemos que hubo un error
    return { success: false, error: err.response?.data?.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};// redux/constants/categoryConstants.js - AÑADIR

export const ADD_VIDEO_TO_CATEGORY = 'ADD_VIDEO_TO_CATEGORY';


// ✅ Actualizar video CON NOTIFICACIÓN
export const updateVideo = (id, videoData, token, auth, socket, oldVideoData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/${id}`, videoData, token);
    
    if (res.data.success) {
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO,
        payload: res.data.video
      });
      
      // ✅ Notificar al dueño del video si no es el mismo usuario
      const video = res.data.video;
      if (video && video.user?._id && video.user._id !== auth.user._id) {
        const msg = {
          id: auth.user._id,
          text: '✏️ Tu video ha sido actualizado',
          recipients: [video.user._id],
          url: `/video/${video._id}`,
          content: video.title,
          image: video.thumbnail,
          type: 'video'
        };
        
        dispatch(createNotify({ msg, auth, socket }));
      }
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: '✓ Vidéo mise à jour avec succès' }
      });
      
      return { success: true, video: res.data.video };
    } else {
      throw new Error(res.data.message || 'Error al actualizar');
    }
  } catch (err) {
    console.error('Error updateVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message || 'Erreur lors de la mise à jour' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============================================
// 🗑️ ELIMINAR VIDEO
// ============================================
export const deleteVideo = (id, token, auth, socket, video) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await deleteDataAPI(`videos/${id}`, token);
    
    if (res.data.success) {
      dispatch({ type: VIDEO_TYPES.DELETE_VIDEO, payload: id });
      
      // ✅ Notificar al dueño si alguien más eliminó su video
      if (video && video.user?._id && video.user._id !== auth.user._id) {
        const msg = {
          id: auth.user._id,
          text: '🗑️ Tu video ha sido eliminado por un administrador',
          recipients: [video.user._id],
          url: '/',
          content: video.title,
          image: video.thumbnail,
          type: 'video'
        };
        dispatch(createNotify({ msg, auth, socket }));
      }
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: '✓ Vidéo supprimée avec succès' }
      });
      
      return { success: true };
    } else {
      throw new Error(res.data.message || 'Error al eliminar');
    }
  } catch (err) {
    console.error('Error deleteVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message || 'Erreur lors de la suppression' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============================================
// 📹 OBTENER VIDEO POR ID
// ============================================
export const getVideoById = (id) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    console.log('📹 Llamando a API - ID:', id);
    
    const res = await getDataAPI(`videos/${id}`);
    
    console.log('📹 Respuesta completa:', res.data);
    
    if (res.data.success === true && res.data.video) {
      console.log('✅ Video cargado correctamente');
      dispatch({
        type: VIDEO_TYPES.GET_VIDEO,
        payload: res.data.video
      });
      
      // Mostrar mensaje si está pendiente
      if (res.data.video.pendiente === true) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { 
            info: '📹 Este video está en espera de aprobación'
          }
        });
      }
      
      dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
      return { success: true, video: res.data.video };
    }
    
    console.log('⚠️ Error en la respuesta:', res.data);
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
    return { success: false, error: res.data.message || 'Error desconocido' };
    
  } catch (err) {
    console.error('❌ Error getVideoById:', err);
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'No se pudo cargar el video' }
    });
    
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
    return { success: false, error: err.message };
  }
};

// ✅ Dar like a video CON NOTIFICACIÓN
export const likeVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/like`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.LIKE_VIDEO,
      payload: { id, likes: res.data.likes, liked: res.data.liked }
    });
    
    // ✅ Notificar al dueño del video que recibió un like (solo si no es el mismo usuario)
    if (res.data.liked && videoData && videoData.user?._id && videoData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `❤️ @${auth.user.username} a aimé votre vidéo`,
        recipients: [videoData.user._id],
        url: `/video/${id}`,
        content: videoData.title,
        image: videoData.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { liked: res.data.liked, likes: res.data.likes };
  } catch (err) {
    console.error('Error likeVideo:', err);
    return { liked: false, likes: 0 };
  }
};

// ✅ Compartir video CON NOTIFICACIÓN
export const shareVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/share`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.SHARE_VIDEO,
      payload: { id, shares: res.data.shares, shared: res.data.shared }
    });
    
    // ✅ Notificar al dueño del video que fue compartido
    if (res.data.shared && videoData && videoData.user?._id && videoData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `🔄 @${auth.user.username} a partagé votre vidéo`,
        recipients: [videoData.user._id],
        url: `/video/${id}`,
        content: videoData.title,
        image: videoData.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { shared: res.data.shared, shares: res.data.shares };
  } catch (err) {
    console.error('Error shareVideo:', err);
    return { shared: false, shares: 0 };
  }
};

 
 
 
 // redux/actions/videoAction.js

 // redux/actions/videoAction.js - SIMPLIFICADO
export const getVideos = (categorySlug, subSlug, page = 1, limit = 12, sortBy = 'recent', searchTerm = null, wilaya = '', commune = '') => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.GET_VIDEOS_REQUEST });
    
    // ✅ La URL debe ser: /api/videos/category/:slug
    const url = `${BASE_URL}/api/videos/category/${categorySlug}`;
    
    const params = new URLSearchParams({
      page,
      limit,
      sortBy: sortBy || 'recent'
    });
    
    if (searchTerm) params.append('search', searchTerm);
    if (wilaya) params.append('wilaya', wilaya);
    if (commune) params.append('commune', commune);
    
    console.log('📡 Llamando a:', `${url}?${params.toString()}`);
    
    const { data } = await axios.get(`${url}?${params.toString()}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_VIDEOS_SUCCESS,
      payload: {
        videos: data.videos || [],
        total: data.total || 0,
        page: data.page || page,
        hasMore: data.hasMore || false,
        totalPages: data.totalPages || 1
      }
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error en getVideos:', error);
    dispatch({
      type: VIDEO_TYPES.GET_VIDEOS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { videos: [], total: 0 };
  }
};
export const getFeaturedVideos = (limit = 10) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/featured?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_FEATURED_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getFeaturedVideos:', err);
  }
};
// redux/actions/videoAction.js

// ✅ Obtener video por ID (maneja videos pendientes)
// redux/actions/videoAction.js - getVideoById CORREGIDO

 
// ✅ Para ver videos en el panel de admin (privado)
// ✅ Esto ya está en videoAction.js
export const getVideoByIdPrivate = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    const res = await getDataAPI(`videos/private/${id}`, token);
    dispatch({
      type: VIDEO_TYPES.GET_VIDEO,
      payload: res.data.video
    });
    return res.data;
  } catch (err) {
    console.error('Error getVideoByIdPrivate:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};
// ✅ Ya existe la acción
// redux/actions/videoAction.js (añadir/verificar esta función)

// ✅ Tracking tiempo de visualización
export const trackWatchTime = (id, watchTime, token) => async (dispatch) => {
  try {
    if (!token || !id || !watchTime) return;
    
    const res = await postDataAPI(`videos/${id}/watch-time`, { watchTime }, token);
    console.log(`📊 WatchTime registrado: ${watchTime}s para video ${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error trackWatchTime:', err.response?.data?.message || err.message);
  }
};
export const getPopularVideos = (limit = 10) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/popular?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_POPULAR_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getPopularVideos:', err);
  }
};

// redux/actions/videoAction.js

// ✅ Añadir esta acción (si no existe)
// pages/video/TrendingVideos.jsx
// En la función getTrendingVideos, la URL debe ser:

// redux/actions/videoAction.js

export const getTrendingVideos = (timeWindow = 'week', page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.TRENDING_LOADING });
    
    // ✅ Usar getDataAPI como todas las demás acciones
    const res = await getDataAPI(`videos/trending?timeRange=${timeWindow}&limit=${limit * page}`);
    
    console.log('🎯 Trending videos response:', res.data);
    
    dispatch({
      type: VIDEO_TYPES.GET_TRENDING_VIDEOS,
      payload: {
        videos: res.data.videos || [],
        hasMore: (res.data.videos || []).length === limit,
        page: page,
        timeWindow: timeWindow
      }
    });
  } catch (err) {
    console.error('❌ Error loading trending videos:', err);
    
    dispatch({
      type: VIDEO_TYPES.GET_TRENDING_VIDEOS,
      payload: {
        videos: [],
        hasMore: false,
        page: 1,
        timeWindow: timeWindow
      }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error loading trending videos' }
    });
  }
};

export const getRelatedVideos = (videoId, limit = 6) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/${videoId}/related?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_RELATED_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getRelatedVideos:', err);
  }
};

  

export const getUserVideoStats = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('videos/user/stats', token);
    return res.data;
  } catch (err) {
    console.error('Error getUserVideoStats:', err);
    return null;
  }
};

   

  
 