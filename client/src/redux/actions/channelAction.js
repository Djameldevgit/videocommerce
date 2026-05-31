// redux/actions/channelAction.js
import { GLOBALTYPES } from './globalTypes';
 import { imageUpload2 } from '../../utils/imageUpload2';
 
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { createNotify } from './notifyAction';

export const CHANNEL_TYPES = {
    // Loading
    CHANNEL_LOADING: 'CHANNEL_LOADING',
    CHANNEL_FEED_LOADING: 'CHANNEL_FEED_LOADING',
    
    // Crear canal
    CREATE_CHANNEL: 'CREATE_CHANNEL',
    CREATE_CHANNEL_REQUEST: 'CREATE_CHANNEL_REQUEST',
    CREATE_CHANNEL_SUCCESS: 'CREATE_CHANNEL_SUCCESS',
    CREATE_CHANNEL_FAIL: 'CREATE_CHANNEL_FAIL',

    // Obtener canal
    GET_CHANNEL: 'GET_CHANNEL',
    GET_CHANNELS: 'GET_CHANNELS',
    GET_USER_CHANNELS: 'GET_USER_CHANNELS',
    CLEAR_CHANNEL: 'CLEAR_CHANNEL',
    
    // Videos del canal
    GET_CHANNEL_VIDEOS: 'GET_CHANNEL_VIDEOS',
    CLEAR_CHANNEL_VIDEOS: 'CLEAR_CHANNEL_VIDEOS',
    GET_CHANNEL_FEED_VIDEOS: 'GET_CHANNEL_FEED_VIDEOS',
    CLEAR_CHANNEL_FEED: 'CLEAR_CHANNEL_FEED',
    
    // Follow/Unfollow
    FOLLOW_CHANNEL: 'FOLLOW_CHANNEL',
    UNFOLLOW_CHANNEL: 'UNFOLLOW_CHANNEL',
    
    // Seguidores
    GET_CHANNEL_FOLLOWERS: 'GET_CHANNEL_FOLLOWERS',
    GET_USER_FOLLOWING_CHANNELS: 'GET_USER_FOLLOWING_CHANNELS',
    
    // Estadísticas
    REGISTER_CHANNEL_VIEW: 'REGISTER_CHANNEL_VIEW',
    CHANNEL_STATS: 'CHANNEL_STATS',
    
    // Actualizar canal
    UPDATE_CHANNEL: 'UPDATE_CHANNEL',
    
    // Admin - Canales pendientes
    GET_PENDING_CHANNELS_REQUEST: 'GET_PENDING_CHANNELS_REQUEST',
    GET_PENDING_CHANNELS_SUCCESS: 'GET_PENDING_CHANNELS_SUCCESS',
    GET_PENDING_CHANNELS_FAIL: 'GET_PENDING_CHANNELS_FAIL',
    
    APPROVE_CHANNEL_REQUEST: 'APPROVE_CHANNEL_REQUEST',
    APPROVE_CHANNEL_SUCCESS: 'APPROVE_CHANNEL_SUCCESS',
    APPROVE_CHANNEL_FAIL: 'APPROVE_CHANNEL_FAIL',
    
    REJECT_CHANNEL_REQUEST: 'REJECT_CHANNEL_REQUEST',
    REJECT_CHANNEL_SUCCESS: 'REJECT_CHANNEL_SUCCESS',
    REJECT_CHANNEL_FAIL: 'REJECT_CHANNEL_FAIL',
    
    CLEAR_PENDING_CHANNELS: 'CLEAR_PENDING_CHANNELS',
    
    // Error general
    CHANNEL_ERROR: 'CHANNEL_ERROR'
};

 
// ==================== CREAR CANAL (como createPost) ====================
export const createChannel = ({ 
    channelData,   // { name, activity, description, wilaya, commune, phone, email, website }
    avatar,        // Array de File objects (como images en createPost)
    cover,         // Array de File objects (como images en createPost)
    auth 
}) => async (dispatch) => {
    let uploadedAvatar = [];
    let uploadedCover = [];
    
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        
        // ✅ EXACTAMENTE IGUAL QUE createPost
        if(avatar && avatar.length > 0) {
            uploadedAvatar = await imageUpload2(avatar);
        }
        
        if(cover && cover.length > 0) {
            uploadedCover = await imageUpload2(cover);
        }
        
        // ✅ EXACTAMENTE IGUAL QUE createPost
        const res = await postDataAPI('channels', { 
            ...channelData,
            avatar: uploadedAvatar,
            cover: uploadedCover
        }, auth.token);
        
        dispatch({ 
            type: CHANNEL_TYPES.CREATE_CHANNEL, 
            payload: res.data.channel 
        });
        
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
        
        return { success: true, channel: res.data.channel };
        
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || err.message }
        });
        return { success: false, error: err.response?.data?.msg };
    }
};

// ==================== ACTUALIZAR CANAL (como updatePost sin status) ====================
// frontend/src/redux/actions/channelAction.js

// ✅ CORREGIDO - updateChannel
export const updateChannel = ({ 
    channelId,
    channelData,
    avatar,
    cover,
    auth 
}) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        
        // ✅ IMPORTANTE: Asegurar que avatar y cover tengan la estructura correcta
        let finalAvatar = [];
        let finalCover = [];
        
        // Procesar avatar
        if (avatar && avatar.length > 0) {
            finalAvatar = avatar.map(img => {
                if (img.file) {
                    // Es un File object - se subirá
                    return img.file;
                } else if (img.url) {
                    // Es imagen existente
                    return { url: img.url, public_id: img.public_id };
                }
                return img;
            });
        }
        
        // Procesar cover
        if (cover && cover.length > 0) {
            finalCover = cover.map(img => {
                if (img.file) {
                    return img.file;
                } else if (img.url) {
                    return { url: img.url, public_id: img.public_id };
                }
                return img;
            });
        }
        
        // ✅ Subir nuevas imágenes
        let uploadedAvatar = [];
        let uploadedCover = [];
        
        const newAvatarFiles = finalAvatar.filter(img => img instanceof File);
        const newCoverFiles = finalCover.filter(img => img instanceof File);
        
        if (newAvatarFiles.length > 0) {
            uploadedAvatar = await imageUpload2(newAvatarFiles);
        }
        
        if (newCoverFiles.length > 0) {
            uploadedCover = await imageUpload2(newCoverFiles);
        }
        
        // ✅ Combinar existentes + nuevas
        const existingAvatar = finalAvatar.filter(img => img.url && !(img instanceof File));
        const existingCover = finalCover.filter(img => img.url && !(img instanceof File));
        
        const finalAvatarArray = [...existingAvatar, ...uploadedAvatar];
        const finalCoverArray = [...existingCover, ...uploadedCover];
        
        // ✅ Enviar actualización
        const res = await patchDataAPI(`channels/${channelId}`, {
            ...channelData,
            avatar: finalAvatarArray,
            cover: finalCoverArray
        }, auth.token);
        
        dispatch({ 
            type: CHANNEL_TYPES.UPDATE_CHANNEL, 
            payload: res.data.channel 
        });
        
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { success: res.data.msg || "Canal actualizado con éxito" } 
        });
        
        return { success: true, channel: res.data.channel };
        
    } catch (err) {
        console.error('❌ Error updateChannel:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || err.message }
        });
        return { success: false, error: err.response?.data?.msg };
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};
// ==================== ACTUALIZAR CANAL (como updatePost) ====================
 
// ==================== OBTENER PERFIL DEL CANAL ====================
// frontend/src/redux/actions/channelAction.js

// frontend/src/redux/actions/channelAction.js

export const getChannelProfile = (channelId, token) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
        
        const res = await getDataAPI(`channels/${channelId}`, token);
        
        dispatch({ 
            type: CHANNEL_TYPES.GET_CHANNEL, 
            payload: res.data.profile  // ✅ IMPORTANTE: res.data.profile, no res.data.channel
        });
        
        return { success: true, channel: res.data.profile };
        
    } catch (err) {
        console.error('❌ Error getChannelProfile:', err);
        dispatch({ type: CHANNEL_TYPES.CHANNEL_ERROR, payload: err.response?.data?.message });
        return { success: false, message: err.response?.data?.message };
    } finally {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
    }
};
// ==================== OBTENER CANAL POR ID ====================
export const getChannelById = (channelId) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
        
        const res = await getDataAPI(`channels/${channelId}`);
        
        dispatch({ 
            type: CHANNEL_TYPES.GET_CHANNEL, 
            payload: res.data.channel || res.data.profile 
        });
        
        return { success: true, channel: res.data.channel || res.data.profile };
        
    } catch (err) {
        console.error('❌ Error getChannelById:', err);
        dispatch({ type: CHANNEL_TYPES.CHANNEL_ERROR, payload: err.response?.data?.message });
        return { success: false, message: err.response?.data?.message };
    } finally {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
    }
};

// ==================== OBTENER MIS CANALES ====================
export const getMyChannels = (token) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
        
        const res = await getDataAPI('my-channels', token);
        
        dispatch({ 
            type: CHANNEL_TYPES.GET_USER_CHANNELS, 
            payload: res.data.channels || [] 
        });
        
        return { success: true, channels: res.data.channels };
        
    } catch (err) {
        console.error('❌ Error getMyChannels:', err);
        dispatch({ type: CHANNEL_TYPES.GET_USER_CHANNELS, payload: [] });
        return { success: false, channels: [] };
    } finally {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
    }
};

// ==================== OBTENER VIDEOS DEL CANAL ====================
// frontend/src/redux/actions/channelAction.js

export const getChannelVideos = (channelId, page = 1, limit = 12, token = null) => async (dispatch, getState) => {
    try {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: true });
        
        // ✅ Agregar timestamp para evitar caché
        const timestamp = Date.now();
        const url = `channels/${channelId}/videos?page=${page}&limit=${limit}&_=${timestamp}`;
        
        console.log('📹 Fetching videos desde:', url);
        
        const res = token ? await getDataAPI(url, token) : await getDataAPI(url);
        
        console.log('📹 Respuesta completa:', res);
        console.log('📹 Videos recibidos:', res.data?.videos);
        console.log('📹 Total:', res.data?.total);
        
        if (page === 1) {
            dispatch({ 
                type: CHANNEL_TYPES.GET_CHANNEL_VIDEOS, 
                payload: {
                    videos: res.data?.videos || [],
                    total: res.data?.total || 0,
                    hasMore: res.data?.hasMore || false,
                    isOwner: res.data?.isOwner || false
                }
            });
        } else {
            const currentVideos = getState().channel?.videos || [];
            dispatch({ 
                type: CHANNEL_TYPES.GET_CHANNEL_VIDEOS, 
                payload: {
                    videos: [...currentVideos, ...(res.data?.videos || [])],
                    total: res.data?.total || 0,
                    hasMore: res.data?.hasMore || false
                }
            });
        }
        
        return res.data;
        
    } catch (err) {
        console.error('❌ Error getChannelVideos:', err);
        return { success: false, videos: [] };
    } finally {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_LOADING, payload: false });
    }
};
// ==================== SEGUIR CANAL ====================
export const toggleFollowChannel = (channelId, auth, socket) => async (dispatch) => {
    try {
        const res = await patchDataAPI(`channels/${channelId}/follow`, {}, auth.token);
        
        if (res.data.success) {
            dispatch({
                type: res.data.isFollowing ? CHANNEL_TYPES.FOLLOW_CHANNEL : CHANNEL_TYPES.UNFOLLOW_CHANNEL,
                payload: { channelId, followersCount: res.data.followersCount }
            });
            
            // Notificar al dueño del canal
            if (res.data.isFollowing && socket && res.data.channelOwner) {
                const msg = {
                    id: auth.user._id,
                    text: `started following your channel.`,
                    recipients: [res.data.channelOwner],
                    url: `/channel/${channelId}`,
                    content: res.data.channelName || '',
                    image: auth.user.avatar
                };
                
                if (msg.recipients.length > 0) {
                    dispatch(createNotify({ msg, auth, socket }));
                }
            }
        }
        
        return res.data;
        
    } catch (err) {
        console.error('❌ Error toggleFollowChannel:', err);
        return null;
    }
};

// ==================== ADMIN: OBTENER CANALES PENDIENTES ====================
export const getPendingChannels = (token, page = 1, limit = 20) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.GET_PENDING_CHANNELS_REQUEST });
        
        const res = await getDataAPI(`admin/channels/pending?page=${page}&limit=${limit}`, token);
        
        dispatch({
            type: CHANNEL_TYPES.GET_PENDING_CHANNELS_SUCCESS,
            payload: {
                channels: res.data.channels || [],
                total: res.data.total || 0,
                page: res.data.page || 1,
                totalPages: res.data.totalPages || 1
            }
        });
        
        return { success: true };
        
    } catch (err) {
        console.error('❌ Error getPendingChannels:', err);
        dispatch({
            type: CHANNEL_TYPES.GET_PENDING_CHANNELS_FAIL,
            payload: err.response?.data?.message || 'Error al cargar canales pendientes'
        });
        return { success: false };
    }
};

// ==================== ADMIN: APROBAR CANAL ====================
export const approveChannel = (channelId, token, socket) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.APPROVE_CHANNEL_REQUEST });
        
        const res = await patchDataAPI(`admin/channels/${channelId}/approve`, {}, token);
        
        dispatch({
            type: CHANNEL_TYPES.APPROVE_CHANNEL_SUCCESS,
            payload: res.data.channel
        });
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Canal approuvé avec succès' }
        });
        
        return { success: true, channel: res.data.channel };
        
    } catch (err) {
        console.error('❌ Error approveChannel:', err);
        dispatch({
            type: CHANNEL_TYPES.APPROVE_CHANNEL_FAIL,
            payload: err.response?.data?.message || 'Error al aprobar el canal'
        });
        return { success: false };
    }
};

// ==================== ADMIN: RECHAZAR CANAL ====================
export const rejectChannel = (channelId, reason, token, socket) => async (dispatch) => {
    try {
        dispatch({ type: CHANNEL_TYPES.REJECT_CHANNEL_REQUEST });
        
        const res = await patchDataAPI(`admin/channels/${channelId}/reject`, { reason }, token);
        
        dispatch({
            type: CHANNEL_TYPES.REJECT_CHANNEL_SUCCESS,
            payload: res.data.channel
        });
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Canal rejeté' }
        });
        
        return { success: true };
        
    } catch (err) {
        console.error('❌ Error rejectChannel:', err);
        dispatch({
            type: CHANNEL_TYPES.REJECT_CHANNEL_FAIL,
            payload: err.response?.data?.message || 'Error al rechazar el canal'
        });
        return { success: false };
    }
};

// ==================== LIMPIAR CANALES PENDIENTES ====================
export const clearPendingChannels = () => (dispatch) => {
    dispatch({ type: CHANNEL_TYPES.CLEAR_PENDING_CHANNELS });
};

// ==================== LIMPIAR ESTADO DEL CANAL ====================
export const clearChannelState = () => (dispatch) => {
    dispatch({ type: CHANNEL_TYPES.CLEAR_CHANNEL });
    dispatch({ type: CHANNEL_TYPES.CLEAR_CHANNEL_VIDEOS });
    dispatch({ type: CHANNEL_TYPES.CLEAR_CHANNEL_FEED });
};

// ==================== LIMPIAR ERRORES ====================
export const clearChannelErrors = () => (dispatch) => {
    dispatch({ type: CHANNEL_TYPES.CHANNEL_ERROR, payload: null });
};

// ==================== OBTENER ESTADÍSTICAS DEL CANAL ====================
export const getChannelStats = (channelId, token) => async (dispatch) => {
    try {
        const res = await getDataAPI(`channels/${channelId}/stats`, token);
        dispatch({
            type: CHANNEL_TYPES.CHANNEL_STATS,
            payload: res.data.stats
        });
        return res.data;
    } catch (err) {
        console.error('❌ Error getChannelStats:', err);
        return null;
    }
};

// ==================== OBTENER SEGUIDORES ====================
export const getChannelFollowers = (channelId, token) => async (dispatch) => {
    try {
        const res = await getDataAPI(`channels/${channelId}/followers`, token);
        dispatch({
            type: CHANNEL_TYPES.GET_CHANNEL_FOLLOWERS,
            payload: res.data.followers || []
        });
        return res.data;
    } catch (err) {
        console.error('❌ Error getChannelFollowers:', err);
        return null;
    }
};

// ==================== OBTENER FEED DE VIDEOS ====================
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
        console.error('❌ Error getChannelFeedVideos:', err);
        return null;
    } finally {
        dispatch({ type: CHANNEL_TYPES.CHANNEL_FEED_LOADING, payload: false });
    }
};

// ==================== LIMPIAR FEED ====================
export const clearChannelFeed = () => (dispatch) => {
    dispatch({ type: CHANNEL_TYPES.CLEAR_CHANNEL_FEED });
};

// ==================== REGISTRAR VISTA ====================
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
        console.error('❌ Error registerChannelView:', err);
        return null;
    }
};

// ==================== OBTENER CANALES QUE SIGUE EL USUARIO ====================
export const getUserFollowingChannels = (userId, token) => async (dispatch) => {
    try {
        const res = await getDataAPI(`users/${userId}/following-channels`, token);
        dispatch({
            type: CHANNEL_TYPES.GET_USER_FOLLOWING_CHANNELS,
            payload: res.data.channels || []
        });
        return res.data;
    } catch (err) {
        console.error('❌ Error getUserFollowingChannels:', err);
        return null;
    }
};