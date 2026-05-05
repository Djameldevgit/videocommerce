// redux/actions/userVideoAction.js
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { PROFILE_TYPES } from './profileAction'; // ✅ IMPORTAR PROFILE_TYPES

// Definir tipos
export const USER_VIDEO_TYPES = {
  LOADING: 'USER_VIDEO_LOADING',
  GET_USER_PROFILE: 'GET_USER_PROFILE',
  GET_USER_VIDEOS: 'GET_USER_VIDEOS',
  GET_SAVED_VIDEOS: 'GET_SAVED_VIDEOS',
  GET_LIKED_VIDEOS: 'GET_LIKED_VIDEOS',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  FOLLOW_USER: 'FOLLOW_USER',
  SAVE_VIDEO: 'SAVE_VIDEO',
  CLEAR_USER_VIDEO_STATE: 'CLEAR_USER_VIDEO_STATE'
};

// Obtener perfil de usuario
export const getUserProfile = (userId, token) => async (dispatch) => {
  try {
    dispatch({ type: USER_VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`user/${userId}/profile`, token);
    
    console.log('📊 getUserProfile response:', res.data);
    
    // Actualizar userVideo reducer
    dispatch({
      type: USER_VIDEO_TYPES.GET_USER_PROFILE,
      payload: res.data.profile
    });
    
    // ✅ Actualizar también profile reducer
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
    dispatch({ type: USER_VIDEO_TYPES.LOADING, payload: false });
  }
};

// Obtener videos del usuario
export const getUserVideos = (userId, page = 1, token, isOwner = false) => async (dispatch) => {
  try {
    const res = await getDataAPI(`users/${userId}/videos?page=${page}&limit=12`, token);
    
    dispatch({
      type: USER_VIDEO_TYPES.GET_USER_VIDEOS,
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
export const getSavedVideos = (userId, page = 1, token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`user/${userId}/saved-videos?page=${page}&limit=12`, token);
    
    dispatch({
      type: USER_VIDEO_TYPES.GET_SAVED_VIDEOS,
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
    console.error('Error getSavedVideos:', err);
    return null;
  }
};

// Obtener videos que le gustaron al usuario
export const getLikedVideos = (userId, page = 1, token) => async (dispatch) => {
  try {
    const res = await getDataAPI(`user/${userId}/liked-videos?page=${page}&limit=12`, token);
    
    dispatch({
      type: USER_VIDEO_TYPES.GET_LIKED_VIDEOS,
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
    console.error('Error getLikedVideos:', err);
    return null;
  }
};

// ✅ Seguir/Dejar de seguir usuario - CORREGIDO
export const toggleFollow = (userId, token, auth) => async (dispatch) => {
  try {
    const res = await postDataAPI(`user/${userId}/follow`, {}, token);
    
    console.log('📊 toggleFollow response:', res.data);
    
    // ✅ Actualizar userVideoReducer
    dispatch({
      type: USER_VIDEO_TYPES.FOLLOW_USER,
      payload: {
        isFollowing: res.data.isFollowing,
        followersCount: res.data.followersCount || 0
      }
    });
    
    // ✅ Actualizar auth SOLO SI existe
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
export const toggleSaveVideo = (videoId, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`videos/${videoId}/save`, {}, token);
    
    dispatch({
      type: USER_VIDEO_TYPES.SAVE_VIDEO,
      payload: {
        videoId,
        isSaved: res.data.isSaved
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error toggleSaveVideo:', err);
    return null;
  }
};

// Limpiar estado
export const clearUserVideoState = () => ({
  type: USER_VIDEO_TYPES.CLEAR_USER_VIDEO_STATE
});

// Set active tab
export const setActiveTab = (tab) => ({
  type: USER_VIDEO_TYPES.SET_ACTIVE_TAB,
  payload: tab
});