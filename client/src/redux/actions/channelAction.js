import { getDataAPI, patchDataAPI, postDataAPI } from '../../utils/fetchData';
 
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction';
 
export const CHANNEL_TYPES = {
  // Loading
  CHANNEL_LOADING: 'CHANNEL_LOADING',
  
  // Crear canal (✅ NUEVAS)
  CREATE_CHANNEL_REQUEST: 'CREATE_CHANNEL_REQUEST',
  CREATE_CHANNEL_SUCCESS: 'CREATE_CHANNEL_SUCCESS',
  CREATE_CHANNEL_FAIL: 'CREATE_CHANNEL_FAIL',
  
  // Obtener canal
  GET_CHANNEL: 'GET_CHANNEL',
  CLEAR_CHANNEL: 'CLEAR_CHANNEL',
  
  // Canales del usuario
  GET_USER_CHANNELS: 'GET_USER_CHANNELS',
  
  // Videos del canal
  GET_CHANNEL_VIDEOS: 'GET_CHANNEL_VIDEOS',
  CLEAR_CHANNEL_VIDEOS: 'CLEAR_CHANNEL_VIDEOS',
  
  // Follow/Unfollow
  FOLLOW_CHANNEL: 'FOLLOW_CHANNEL',
  UNFOLLOW_CHANNEL: 'UNFOLLOW_CHANNEL',
  
  // Seguidores
  GET_CHANNEL_FOLLOWERS: 'GET_CHANNEL_FOLLOWERS',
  GET_USER_FOLLOWING_CHANNELS: 'GET_USER_FOLLOWING_CHANNELS',
  
  // Estadísticas y vistas
  REGISTER_CHANNEL_VIEW: 'REGISTER_CHANNEL_VIEW',
  CHANNEL_STATS: 'CHANNEL_STATS',
  
  // Actualizar canal
  UPDATE_CHANNEL: 'UPDATE_CHANNEL',
  
  // Feed del canal
  CHANNEL_FEED_LOADING: 'CHANNEL_FEED_LOADING',
  GET_CHANNEL_FEED_VIDEOS: 'GET_CHANNEL_FEED_VIDEOS',
  CLEAR_CHANNEL_FEED: 'CLEAR_CHANNEL_FEED'
};
// ==================== CREAR UN NUEVO CANAL (CON NOTIFICACIÓN) ====================
// En channelAction.js, asegúrate de que el dispatch use las constantes:

 
export const createChannel = (formData, token, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CREATE_CHANNEL_REQUEST });
    
    const res = await postDataAPI('channels', formData, token);
    
    dispatch({ 
      type: CHANNEL_TYPES.CREATE_CHANNEL_SUCCESS, 
      payload: res.data.channel 
    });
    
    // ✅ Notificar a los administradores sobre el nuevo canal
    if (res.data.channel && auth?.user) {
      const msg = {
        id: res.data.channel._id,
        text: `📺 ${auth.user.username} a créé un nouveau canal : "${res.data.channel.name}"`,
        recipients: [], // Los administradores reciben esto (backend)
        url: `/channel/${res.data.channel._id}`,
        content: res.data.channel.name,
        image: res.data.channel.avatar || null,
        type: 'channel_created'
      };
      
      // ✅ Enviar notificación por socket (si está disponible)
      if (socket) {
        socket.emit('createNotify', msg);
      }
      
      // ✅ Guardar notificación en la base de datos
      await dispatch(createNotify({ msg, auth, socket }));
    }
    
    // ✅ Mostrar mensaje de éxito
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: `Canal "${res.data.channel.name}" créé avec succès!` }
    });
    
    return { success: true, message: res.data.message, channel: res.data.channel };
    
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Erreur lors de la création';
    
    dispatch({ 
      type: CHANNEL_TYPES.CREATE_CHANNEL_FAIL, 
      payload: errorMsg
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: errorMsg }
    });
    
    return { success: false, message: errorMsg };
  }
};
// ==================== ACTUALIZAR PERFIL DEL CANAL (CON NOTIFICACIÓN) ====================
// redux/actions/channelAction.js
// ==================== ACTUALIZAR PERFIL DEL CANAL (CORREGIDO) ====================
export const updateChannelProfile = (channelId, updateData, token, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    console.log('📤 updateChannelProfile - Datos a enviar:', updateData);
    console.log('📤 updateChannelProfile - Token:', token ? 'Presente' : 'Ausente');
    
    const res = await patchDataAPI(`channels/${channelId}`, updateData, token);
    
    console.log('📥 updateChannelProfile - Respuesta:', res.data);
    
    if (res.data.success) {
      dispatch({
        type: CHANNEL_TYPES.UPDATE_CHANNEL,
        payload: res.data.channel
      });
      
      // ✅ CORREGIDO: Verificar que auth y auth.user existen antes de acceder
      if (res.data.channel && auth && auth.user) {
        const msg = {
          id: res.data.channel._id,
          text: `✏️ ${auth.user.username || 'Un usuario'} ha actualizado su canal: "${res.data.channel.name}"`,
          recipients: [],
          url: `/channel/${res.data.channel._id}`,
          content: res.data.channel.name,
          image: res.data.channel.avatar || null,
          type: 'channel_updated'
        };
        
        // ✅ Verificar que socket existe antes de emitir
        if (socket && typeof socket.emit === 'function') {
          socket.emit('updateChannel', msg);
        }
        
        // ✅ Verificar que createNotify existe y los parámetros son válidos
        if (typeof dispatch(createNotify) === 'function') {
          await dispatch(createNotify({ msg, auth, socket }));
        }
      } else {
        console.log('⚠️ No se envió notificación: auth o auth.user es undefined');
      }
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Perfil del canal actualizado correctamente' }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('❌ updateChannelProfile error:', err);
    console.error('❌ Error details:', err.response?.data);
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al actualizar el canal' }
    });
    
    return { 
      success: false, 
      message: err.response?.data?.message || err.message 
    };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
// ==================== SEGUIR / DEJAR DE SEGUIR UN CANAL (CON NOTIFICACIÓN) ====================
export const toggleFollowChannel = (channelId, token, auth, socket, channelData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`channels/${channelId}/follow`, {}, token);
    
    if (res.data.success) {
      dispatch({
        type: res.data.isFollowing ? CHANNEL_TYPES.FOLLOW_CHANNEL : CHANNEL_TYPES.UNFOLLOW_CHANNEL,
        payload: { channelId, followersCount: res.data.followersCount }
      });
      
      // ✅ Notificar al dueño del canal que alguien lo sigue
      if (res.data.isFollowing && channelData && channelData.owner?._id && channelData.owner._id !== auth.user._id) {
        const msg = {
          id: auth.user._id,
          text: `👥 @${auth.user.username} a commencé à suivre votre canal : "${channelData.name}"`,
          recipients: [channelData.owner._id],
          url: `/channel/${channelId}`,
          content: channelData.name,
          image: channelData.avatar || null,
          type: 'channel_follow'
        };
        
        if (socket) {
          socket.emit('followChannel', msg);
        }
        
        await dispatch(createNotify({ msg, auth, socket }));
      }
      
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

// ==================== OBTENER PERFIL DE UN CANAL (público) ====================
export const getChannelProfile = (channelId, token = null) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
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
    
    console.log('📡 getUserChannels - Token:', token ? 'Presente' : 'Ausente');
    
    const res = await getDataAPI('users/my-channels', token);
    
    console.log('📥 getUserChannels - Respuesta:', res.data);
    
    // ✅ Asegurar que siempre enviamos un array
    const channels = res.data.channels || [];
    
    dispatch({
      type: CHANNEL_TYPES.GET_USER_CHANNELS,
      payload: channels
    });
    
    return { success: true, channels };
  } catch (err) {
    console.error('❌ getUserChannels error:', err);
    
    // ✅ En caso de error, enviar array vacío
    dispatch({
      type: CHANNEL_TYPES.GET_USER_CHANNELS,
      payload: []
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cargar tus canales' }
    });
    
    return { success: false, channels: [], error: err.message };
  } finally {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
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

// ==================== OBTENER VIDEOS DEL CANAL PARA FEED ====================
export const getChannelFeedVideos = (channelId, page = 1, limit = 10, token = null) => async (dispatch) => {
  try {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_FEED_LOADING, payload: true });
    const res = await getDataAPI(`channels/${channelId}/videos?page=${page}&limit=${limit}`, token);
    dispatch({
      type: CHANNEL_TYPES.GET_CHANNEL_FEED_VIDEOS,
      payload: {
        videos: res.data.videos,
        total: res.data.total,
        page: res.data.page,
        hasMore: res.data.hasMore,
        channelId
      }
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_FEED_LOADING, payload: false });
  }
};

// ==================== LIMPIAR FEED ====================
export const clearChannelFeed = () => ({
  type: CHANNEL_TYPES.CLEAR_CHANNEL_FEED
});