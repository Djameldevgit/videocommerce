// redux/actions/videoApproveAction.js - VERSIÓN CON NOTIFICACIONES
import { getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify

export const VIDEO_APPROVE_TYPES = {
  LOADING: 'VIDEO_APPROVE_LOADING',
  GET_VIDEOS_PENDIENTES: 'GET_VIDEOS_PENDIENTES',
  APROBAR_VIDEO: 'APROBAR_VIDEO',
  ELIMINAR_VIDEO: 'ELIMINAR_VIDEO',
  UPDATE_PAGINATION: 'UPDATE_VIDEO_PAGINATION'
};

// Obtener videos pendientes
export const getVideosPendientes = (token, page = 1, limit = 10, commercialOnly = false) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_APPROVE_TYPES.LOADING, payload: true });
    
    let url = `admin/videos/pendientes?page=${page}&limit=${limit}`;
    if (commercialOnly) {
      url += '&commercialOnly=true';
    }
    
    const res = await getDataAPI(url, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.GET_VIDEOS_PENDIENTES,
      payload: {
        videos: res.data.videos || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        stats: res.data.stats || { commercial: 0, normal: 0, total: 0 }
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getVideosPendientes:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_APPROVE_TYPES.LOADING, payload: false });
  }
};
// ✅ Aprobar video CON NOTIFICACIÓN
// redux/actions/videoApproveAction.js - aprobarVideo CORREGIDO

// ✅ Aprobar video CON NOTIFICACIÓN al usuario dueño
// redux/actions/videoApproveAction.js - aprobarVideo CORREGIDO

export const aprobarVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`admin/videos/${id}/approve`, {}, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.APROBAR_VIDEO,
      payload: id
    });
    
    const video = res.data.video || videoData;
    
    // ✅ Notificar al dueño del video que fue aprobado
    if (video && video.user && video.user._id) {
      const msg = {
        id: auth.user._id,
        text: `✅ Votre vidéo "${video.title}" a été approuvée et est maintenant visible sur le site.`,
        recipients: [video.user._id], // Enviar solo al dueño
        url: `/video/${video._id}`,
        content: video.title,
        image: video.thumbnail,
        type: 'video_approved'
      };
      
      await dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo approuvée avec succès' }
    });
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error aprobarVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de l\'approbation' }
    });
    return { success: false, error: err.response?.data?.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
// ✅ Eliminar video (rechazar) CON NOTIFICACIÓN
// redux/actions/videoApproveAction.js - eliminarVideo CORREGIDO

// redux/actions/videoApproveAction.js - eliminarVideo CORREGIDO

export const eliminarVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await deleteDataAPI(`admin/videos/${id}`, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.ELIMINAR_VIDEO,
      payload: id
    });
    
    const video = res.data?.video || videoData;
    
    // ✅ Notificar al dueño del video que fue rechazado
    if (video && video.user && video.user._id) {
      const msg = {
        id: auth.user._id,
        text: `❌ Votre vidéo "${video.title}" a été rejetée par l'administrateur. Veuillez vérifier les conditions d'utilisation.`,
        recipients: [video.user._id], // Enviar solo al dueño
        url: `/create-video`,
        content: video.title,
        image: video.thumbnail,
        type: 'video_rejected'
      };
      
      await dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo supprimée avec succès' }
    });
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error eliminarVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la suppression' }
    });
    return { success: false, error: err.response?.data?.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Actualizar paginación
export const updateVideoPagination = (page) => ({
  type: VIDEO_APPROVE_TYPES.UPDATE_PAGINATION,
  payload: page
});