// redux/actions/userAction.js
// ============================================
// 📦 ACCIONES DE USUARIO - COMPLETO
// ============================================

import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { PROFILE_TYPES } from './profileAction';
import { createNotify } from './notifyAction';

// ============================================
// 📦 TIPOS DE ACCIONES
// ============================================

export const USER_TYPES = {
  // Usuarios normales
  LOADING_USERS: 'LOADING_USERS',
  GET_USERS: 'GET_USERS',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_USER_VERIFICATION: 'UPDATE_USER_VERIFICATION',
  DELETE_USER: 'DELETE_USER',
  ACTIVATE_USER: 'ACTIVATE_USER',
  DEACTIVATE_USER: 'DEACTIVATE_USER',
  TOGGLE_ACTIVE_STATUS: 'TOGGLE_ACTIVE_STATUS',
  
  // Bloqueo/Desbloqueo
  BLOCK_USER: 'BLOCK_USER',
  UNBLOCK_USER: 'UNBLOCK_USER',
  LOADING_BLOCKED_USERS: 'LOADING_BLOCKED_USERS',
  GET_BLOCKED_USERS: 'GET_BLOCKED_USERS',
  
  // Planes
  ACTIVATE_PRO: 'ACTIVATE_PRO',
  DEACTIVATE_PRO: 'DEACTIVATE_PRO',
  UPDATE_USER_PLAN: 'UPDATE_USER_PLAN',
  UPDATE_USER_PLAN_SUCCESS: 'UPDATE_USER_PLAN_SUCCESS',
  UPDATE_USER_PLAN_FAIL: 'UPDATE_USER_PLAN_FAIL',
  
  // Transacciones
  GET_USER_TRANSACTIONS: 'GET_USER_TRANSACTIONS',
  
  // Comentarios admin
  GET_ADMIN_COMMENTS: 'GET_ADMIN_COMMENTS',
  ADD_ADMIN_COMMENT: 'ADD_ADMIN_COMMENT',
  
  // Limpiar
  CLEAR_USER_ERROR: 'CLEAR_USER_ERROR',
  RESET_USERS: 'RESET_USERS',
  
  // ============ ACCIONES DE USUARIO (PERFIL) ============
  LOADING: 'USER_LOADING',
  GET_USER_PROFILE: 'GET_USER_PROFILE',
  GET_USER_VIDEOS: 'GET_USER_VIDEOS',
  GET_SAVED_VIDEOS: 'GET_SAVED_VIDEOS',
  GET_LIKED_VIDEOS: 'GET_LIKED_VIDEOS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  FOLLOW_USER: 'FOLLOW_USER',
  SAVE_VIDEO: 'SAVE_VIDEO',
  CLEAR_USER_STATE: 'CLEAR_USER_STATE'
};

// ============================================
// 1️⃣ FUNCIONES DE USUARIO (ADMIN)
// ============================================

export const getUsers = (token, page = 1, filter = 'all') => async (dispatch) => {
  try {
    dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });
    
    const res = await getDataAPI(`users?page=${page}&limit=9&filter=${filter}`, token);
    
    dispatch({
      type: USER_TYPES.GET_USERS,
      payload: {
        users: res.data.users,
        result: res.data.result,
        page: page
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getUsers:', err);
    return null;
  } finally {
    dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
  }
};

export const updateUserRole = (id, role, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${id}/role`, { role }, token);
    
    dispatch({
      type: USER_TYPES.UPDATE_USER,
      payload: res.data.user
    });
    
    return res.data;
  } catch (err) {
    console.error('Error updateUserRole:', err);
    return null;
  }
};

// ✅ TOGGLE VERIFICATION - NUEVA
export const toggleVerification = (userId, isVerified, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/verify`, { isVerified }, token);
    
    dispatch({
      type: USER_TYPES.UPDATE_USER_VERIFICATION,
      payload: {
        _id: userId,
        isVerified: res.data.isVerified
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error toggleVerification:', err);
    return null;
  }
};

// ✅ UPDATE USER PLAN - CORREGIDO
export const updateUserPlan = (userId, planData, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_TYPES.UPDATE_USER_PLAN });
    
    const res = await patchDataAPI(`users/${userId}/plan`, planData, token);
    
    if (res.data.success) {
      dispatch({
        type: USER_TYPES.UPDATE_USER_PLAN_SUCCESS,
        payload: {
          userId,
          plan: res.data.user.channelPlan,
          expiresAt: res.data.user.channelPlanExpiresAt
        }
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error updateUserPlan:', err);
    dispatch({
      type: USER_TYPES.UPDATE_USER_PLAN_FAIL,
      payload: err.response?.data?.message || err.message
    });
    return null;
  }
};

// ✅ GET USER TRANSACTIONS - NUEVA
export const getUserTransactions = (userId, token, limit = 50) => async (dispatch) => {
  try {
    const res = await getDataAPI(`users/${userId}/transactions?limit=${limit}`, token);
    
    dispatch({
      type: USER_TYPES.GET_USER_TRANSACTIONS,
      payload: res.data.transactions
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getUserTransactions:', err);
    return null;
  }
};

// ✅ ACTIVATE PRO - CORREGIDO
export const activatePro = (userId, proExpiryDate, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/activate-pro`, { proExpiryDate }, token);
    
    if (res.data.success) {
      dispatch({
        type: USER_TYPES.ACTIVATE_PRO,
        payload: res.data.user
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error activatePro:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al activar Pro' }
    });
    return null;
  }
};

// ✅ DEACTIVATE PRO - CORREGIDO
export const deactivatePro = (userId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/deactivate-pro`, {}, token);
    
    if (res.data.success) {
      dispatch({
        type: USER_TYPES.DEACTIVATE_PRO,
        payload: res.data.user
      });
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.message }
      });
    }
    
    return res.data;
  } catch (err) {
    console.error('Error deactivatePro:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al desactivar Pro' }
    });
    return null;
  }
};

export const blockUser = (userId, blockData, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/block`, blockData, token);
    
    dispatch({
      type: USER_TYPES.BLOCK_USER,
      payload: res.data.user
    });
    
    return res.data;
  } catch (err) {
    console.error('Error blockUser:', err);
    return null;
  }
};

export const unblockUser = (userId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/unblock`, {}, token);
    
    dispatch({
      type: USER_TYPES.UNBLOCK_USER,
      payload: res.data.user
    });
    
    return res.data;
  } catch (err) {
    console.error('Error unblockUser:', err);
    return null;
  }
};

export const activateUser = (userId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/activate`, {}, token);
    
    dispatch({
      type: USER_TYPES.ACTIVATE_USER,
      payload: res.data.user
    });
    
    return res.data;
  } catch (err) {
    console.error('Error activateUser:', err);
    return null;
  }
};

export const deactivateUser = (userId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`user/${userId}/deactivate`, {}, token);
    
    dispatch({
      type: USER_TYPES.DEACTIVATE_USER,
      payload: res.data.user
    });
    
    return res.data;
  } catch (err) {
    console.error('Error deactivateUser:', err);
    return null;
  }
};

export const deleteUser = (userId, token) => async (dispatch) => {
  try {
    const res = await deleteDataAPI(`user/${userId}`, token);
    
    dispatch({
      type: USER_TYPES.DELETE_USER,
      payload: userId
    });
    
    return res.data;
  } catch (err) {
    console.error('Error deleteUser:', err);
    return null;
  }
};

// ============================================
// 2️⃣ FUNCIONES DE PERFIL DE USUARIO
// ============================================

// Obtener perfil de usuario
export const getUserProfile = (userId, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`user/${userId}/profile`, token);
    
    console.log('📊 getUserProfile response:', res.data);
    
    dispatch({
      type: USER_TYPES.GET_USER_PROFILE,
      payload: res.data.profile
    });
    
    // Actualizar también profile reducer
    dispatch({
      type: PROFILE_TYPES.GET_USER,
      payload: {
        _id: res.data.profile._id,
        username: res.data.profile.username,
        avatar: res.data.profile.avatar,
        fullname: res.data.profile.fullname,
        bio: res.data.profile.bio,
        followers: res.data.profile.followersCount || [],
        following: res.data.profile.followingCount || [],
        isFollowing: res.data.profile.isFollowing
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getUserProfile:', err);
    return null;
  } finally {
    dispatch({ type: USER_TYPES.LOADING, payload: false });
  }
};

// Obtener videos del usuario
export const getUserVideos = (userId, page = 1, token, isOwner = false) => async (dispatch) => {
  try {
    const res = await getDataAPI(`users/${userId}/videos?page=${page}&limit=12`, token);
    
    dispatch({
      type: USER_TYPES.GET_USER_VIDEOS,
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
    console.error('Error getUserVideos:', err);
    return null;
  }
};

// Obtener videos guardados
export const getSavedVideos = (token, page = 1, limit = 12) => async (dispatch) => {
  try {
    if (!token) {
      console.error('❌ getSavedVideos: No token');
      return { success: false, error: 'No token' };
    }
    
    console.log('📥 getSavedVideos - llamando a API...');
    
    const url = `user/saved-videos?page=${page}&limit=${limit}`;
    const res = await getDataAPI(url, token);
    
    console.log('✅ getSavedVideos - respuesta:', res.data);
    
    dispatch({
      type: USER_TYPES.GET_SAVED_VIDEOS,
      payload: {
        videos: res.data.videos || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    return { 
      success: true, 
      videos: res.data.videos || [],
      hasMore: res.data.hasMore || false,
      total: res.data.total || 0
    };
  } catch (err) {
    console.error('❌ getSavedVideos error:', err);
    return { success: false, error: err.message };
  }
};

// Obtener videos con like
export const getLikedVideos = (token, page = 1, limit = 12) => async (dispatch) => {
  try {
    if (!token) {
      console.error('❌ getLikedVideos: No token');
      return { success: false, error: 'No token' };
    }
    
    console.log('📥 getLikedVideos - llamando a API...');
    
    const url = `user/liked-videos?page=${page}&limit=${limit}`;
    const res = await getDataAPI(url, token);
    
    console.log('✅ getLikedVideos - respuesta:', res.data);
    
    dispatch({
      type: USER_TYPES.GET_LIKED_VIDEOS,
      payload: {
        videos: res.data.videos || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    return { 
      success: true, 
      videos: res.data.videos || [],
      hasMore: res.data.hasMore || false,
      total: res.data.total || 0
    };
  } catch (err) {
    console.error('❌ getLikedVideos error:', err);
    return { success: false, error: err.message };
  }
};

// Seguir/Dejar de seguir usuario
export const toggleFollow = (userId, token, auth) => async (dispatch) => {
  try {
    const res = await postDataAPI(`user/${userId}/follow`, {}, token);
    
    console.log('📊 toggleFollow response:', res.data);
    
    dispatch({
      type: USER_TYPES.FOLLOW_USER,
      payload: {
        isFollowing: res.data.isFollowing,
        followersCount: res.data.followersCount || 0
      }
    });
    
    // Actualizar auth si existe
    if (auth && auth.user) {
      const currentFollowing = auth.user.following || [];
      const updatedFollowing = res.data.isFollowing
        ? [...currentFollowing, { _id: userId }]
        : currentFollowing.filter(f => f && f._id !== userId);
      
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            following: updatedFollowing
          }
        }
      });
    }
    
    return {
      isFollowing: res.data.isFollowing,
      followersCount: res.data.followersCount || 0
    };
  } catch (err) {
    console.error('Error toggleFollow:', err);
    return null;
  }
};

// Guardar/Quitar video de favoritos
export const toggleSaveVideo = (videoId, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const isSaved = auth?.user?.savedVideos?.includes(videoId) || false;
    
    // Optimistic update
    dispatch({
      type: USER_TYPES.SAVE_VIDEO,
      payload: { videoId, isSaved: !isSaved }
    });
    
    const res = await postDataAPI(`videos/${videoId}/save`, {}, token);
    
    if (res.data.success) {
      if (!isSaved && videoData && videoData.user?._id && videoData.user._id !== auth?.user?._id) {
        const msg = {
          id: auth.user._id,
          text: `🔖 @${auth.user.username} a guardado tu video en favoritos`,
          recipients: [videoData.user._id],
          url: `/video/${videoId}`,
          content: videoData.title,
          image: videoData.thumbnail,
          type: 'video'
        };
        dispatch(createNotify({ msg, auth, socket }));
      }
      
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: !isSaved ? '✓ Video guardado' : '✓ Video eliminado de favoritos' }
      });
    }
    
    return { success: true, isSaved: !isSaved };
  } catch (err) {
    console.error('Error toggleSaveVideo:', err);
    // Revertir optimistic update
    dispatch({
      type: USER_TYPES.SAVE_VIDEO,
      payload: { videoId, isSaved: !isSaved }
    });
    return { success: false, error: err.message };
  }
};
 
export const setActiveTab = (tab) => ({
  type: USER_TYPES.SET_ACTIVE_TAB,
  payload: tab
});

// Limpiar estado de usuario
export const clearUserState = () => ({
  type: USER_TYPES.CLEAR_USER_STATE
});