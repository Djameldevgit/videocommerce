// redux/actions/channelAction.js
import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';
import { CHANNEL_TYPES } from '../constants/channelConstants';
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // si usas notificaciones
// ==================== CREAR UN NUEVO CANAL ====================
export const createChannel = (channelData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // Verificar datos requeridos
    if (!channelData.name || !channelData.name.trim()) {
      throw new Error('El nombre del canal es obligatorio');
    }
    if (!channelData.activity || !channelData.activity.trim()) {
      throw new Error('La actividad es obligatoria');
    }

    // Enviar petición al backend (asumiendo endpoint POST /api/channels)
    const res = await postDataAPI('channels', channelData, token);
    
    if (res.data.success) {
      // Actualizar el reducer con el nuevo canal (añadir a userChannels)
      dispatch({
        type: CHANNEL_TYPES.CREATE_CHANNEL,
        payload: res.data.channel
      });
      
      // Mostrar mensaje de éxito
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message || 'Canal creado exitosamente' }
      });
      
      return { success: true, channel: res.data.channel };
    } else {
      throw new Error(res.data.message || 'Error al crear canal');
    }
  } catch (err) {
    console.error('❌ createChannel error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message || 'Error al crear canal' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
// ==================== OBTENER PERFIL DE UN CANAL (público) ====================
export const getChannelProfile = (channelId, token = null) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });

    // Si hay token, la petición puede devolver datos extras (dueño)
    const config = token ? { headers: { Authorization: token } } : {};
    const res = await getDataAPI(`channels/${channelId}`, token);
    
    dispatch({
      type: CHANNEL_TYPES.GET_CHANNEL,
      payload: res.data.profile || res.data.channel,
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ getChannelProfile error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cargar el canal' }
    });
    return null;
  } finally {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
  }
};
// ==================== OBTENER CANALES DEL USUARIO AUTENTICADO ====================
export const getUserChannels = (token) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
    const res = await getDataAPI('users/my-channels', token); // Endpoint que debes crear en backend
    dispatch({
      type: CHANNEL_TYPES.GET_USER_CHANNELS,
      payload: res.data.channels || []
    });
    return res.data;
  } catch (err) {
    console.error('❌ getUserChannels error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cargar tus canales' }
    });
    return null;
  } finally {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
  }
};
// ==================== SEGUIR / DEJAR DE SEGUIR UN CANAL ====================
export const toggleFollowChannel = (channelId, token) => async (dispatch, getState) => {
  try {
    const res = await patchDataAPI(`channels/${channelId}/follow`, {}, token);
    
    if (res.data.success) {
      dispatch({
        type: res.data.isFollowing ? CHANNEL_TYPES.FOLLOW_CHANNEL : CHANNEL_TYPES.UNFOLLOW_CHANNEL,
        payload: { channelId, followersCount: res.data.followersCount }
      });
      
      // Opcional: actualizar el estado de seguimiento en el perfil del usuario
      // (ya que el usuario tiene followingChannels)
      dispatch({
        type: 'USER_UPDATE_FOLLOWING_CHANNELS', // si tienes una acción en userAction
        payload: { channelId, isFollowing: res.data.isFollowing }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.isFollowing ? 'Canal seguido' : 'Dejaste de seguir el canal' }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('❌ toggleFollowChannel error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al seguir/dejar de seguir' }
    });
    return null;
  }
};

// ==================== OBTENER SEGUIDORES DE UN CANAL ====================
export const getChannelFollowers = (channelId, token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`channels/${channelId}/followers`, token);
    dispatch({
      type: CHANNEL_TYPES.GET_CHANNEL_FOLLOWERS,
      payload: res.data.followers || []
    });
    return res.data;
  } catch (err) {
    console.error('❌ getChannelFollowers error:', err);
    return null;
  }
};

// ==================== OBTENER CANALES QUE SIGUE UN USUARIO ====================
export const getUserFollowingChannels = (userId, token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`users/${userId}/following-channels`, token);
    dispatch({
      type: CHANNEL_TYPES.GET_USER_FOLLOWING_CHANNELS,
      payload: res.data.channels || []
    });
    return res.data;
  } catch (err) {
    console.error('❌ getUserFollowingChannels error:', err);
    return null;
  }
};

// ==================== REGISTRAR VISTA AL PERFIL DEL CANAL ====================
export const registerChannelView = (channelId, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`channels/${channelId}/view`, {}, token);
    if (res.data.success) {
      dispatch({
        type: CHANNEL_TYPES.REGISTER_CHANNEL_VIEW,
        payload: { count: res.data.count }
      });
    }
    return res.data;
  } catch (err) {
    console.error('❌ registerChannelView error:', err);
    return null;
  }
};

// ==================== OBTENER ESTADÍSTICAS DEL CANAL (dueño/admin) ====================
export const getChannelStats = (channelId, token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`channels/${channelId}/stats`, token);
    dispatch({
      type: CHANNEL_TYPES.CHANNEL_STATS,
      payload: res.data.stats
    });
    return res.data;
  } catch (err) {
    console.error('❌ getChannelStats error:', err);
    return null;
  }
};

// ==================== OBTENER VIDEOS DE UN CANAL ====================
export const getChannelVideos = (channelId, page = 1, limit = 12, token = null) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
    
    const params = new URLSearchParams({ page, limit });
    const url = `channels/${channelId}/videos?${params.toString()}`;
    const res = token ? await getDataAPI(url, token) : await getDataAPI(url);
    
    dispatch({
      type: CHANNEL_TYPES.GET_CHANNEL_VIDEOS,
      payload: {
        videos: res.data.videos,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages,
        hasMore: res.data.hasMore
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ getChannelVideos error:', err);
    return null;
  } finally {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
  }
};

// ==================== ACTUALIZAR PERFIL DEL CANAL ====================
export const updateChannelProfile = (channelId, updateData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`channels/${channelId}`, updateData, token);
    
    if (res.data.success) {
      dispatch({
        type: CHANNEL_TYPES.UPDATE_CHANNEL,
        payload: res.data.channel
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Perfil del canal actualizado' }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('❌ updateChannelProfile error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al actualizar' }
    });
    return null;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};