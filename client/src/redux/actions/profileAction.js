// redux/actions/profileAction.js
import { GLOBALTYPES, DeleteData, EditData } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { createNotify, removeNotify } from '../actions/notifyAction'

// redux/actions/profileAction.js - Añadir nuevos tipos
export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST',
    // Vistas de perfil
    REGISTER_PROFILE_VIEW: 'REGISTER_PROFILE_VIEW',
    GET_PROFILE_VIEWS: 'GET_PROFILE_VIEWS',
    GET_PROFILE_STATS: 'GET_PROFILE_STATS',
    CLEAR_PROFILE_VIEWS: 'CLEAR_PROFILE_VIEWS',
    // 🆕 SAVE VIDEOS
    SAVE_VIDEO: 'SAVE_VIDEO',
    UNSAVE_VIDEO: 'UNSAVE_VIDEO',
    GET_SAVED_VIDEOS: 'GET_SAVED_VIDEOS',
    CHECK_SAVED_VIDEO: 'CHECK_SAVED_VIDEO'
}

// ============================================
// 🆕 REGISTRAR VISTA DE PERFIL
// ============================================
export const registerProfileView = (userId) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        // No registrar vista de tu propio perfil
        if (!auth.token || !auth.user || auth.user._id === userId) {
            return;
        }

        const res = await patchDataAPI(`user/${userId}/profile-view`, {}, auth.token);
        
        console.log('👁️ Vista registrada para usuario:', userId);
        
        dispatch({
            type: PROFILE_TYPES.REGISTER_PROFILE_VIEW,
            payload: {
                userId,
                count: res.data.count
            }
        });
        
        return res.data;
        
    } catch (err) {
        console.error('❌ Error registering profile view:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al registrar vista' }
        });
    }
};

// ============================================
// 🆕 OBTENER VISTAS DEL PERFIL
// ============================================
export const getProfileViews = (userId) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        dispatch({ 
            type: PROFILE_TYPES.GET_PROFILE_VIEWS, 
            payload: { loading: true } 
        });
        
        const res = await getDataAPI(`user/${userId}/profile-views`, auth.token);
        
        dispatch({ 
            type: PROFILE_TYPES.GET_PROFILE_VIEWS, 
            payload: { 
                views: res.data.views || [],
                count: res.data.count || 0,
                loading: false 
            } 
        });
        
        return res.data;
        
    } catch (err) {
        console.error('❌ Error getting profile views:', err);
        dispatch({ 
            type: PROFILE_TYPES.GET_PROFILE_VIEWS, 
            payload: { 
                error: err.response?.data?.message || 'Error al cargar vistas',
                loading: false 
            } 
        });
    }
};

// ============================================
// 🆕 OBTENER ESTADÍSTICAS DEL PERFIL
// ============================================
export const getProfileStats = (userId) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        const res = await getDataAPI(`user/${userId}/profile-stats`, auth.token);
        
        dispatch({ 
            type: PROFILE_TYPES.GET_PROFILE_STATS, 
            payload: res.data.stats 
        });
        
        return res.data.stats;
        
    } catch (err) {
        console.error('❌ Error getting profile stats:', err);
        return null;
    }
};

// ============================================
// 🆕 LIMPIAR VISTAS DEL PERFIL
// ============================================
export const clearProfileViews = () => (dispatch) => {
    dispatch({ type: PROFILE_TYPES.CLEAR_PROFILE_VIEWS });
};

// ============================================
// 🆕 OBTENER PERFIL COMPLETO CON VISTAS INCLUIDAS
// ============================================
export const getProfileWithViews = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id })

    try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true })
        
        const [usersRes, postsRes] = await Promise.all([
            getDataAPI(`user/${id}`, auth.token),
           
        ]);

        if (!usersRes.data || !usersRes.data.user) {
            throw new Error('Usuario no encontrado');
        }

        const userData = {
            ...usersRes.data.user,
            _id: id,
            profileViewsCount: usersRes.data.user.profileViewsCount || 0
        };

        const postsData = {
            _id: id,
            posts: postsRes.data.posts || [],
            result: postsRes.data.pagination?.totalPosts || postsRes.data.result || 0,
            page: 1
        };

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: userData
        });

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: postsData
        });

        // Registrar vista si no es el propio usuario
        if (auth.user._id !== id) {
            await dispatch(registerProfileView(id));
        }

        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        
    } catch (err) {
        console.error('❌ Error en getProfileWithViews:', err);
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.msg || 'Error al cargar perfil' }
        });
        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    }
};

// ============================================
// 🟢 GET PROFILE USERS - VERSIÓN ORIGINAL MEJORADA
// ============================================
export const getProfileUsers = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });

    try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
        
        // Endpoint para obtener el perfil del usuario
        const res = await getDataAPI(`user/${id}/profile`, auth.token);
       
        // ✅ Verificar la respuesta (backend devuelve { success, profile })
        if (!res.data || !res.data.success || !res.data.profile) {
            throw new Error('Usuario no encontrado en la respuesta');
        }

        const profileData = res.data.profile;

        // Construir objeto usuario con todos los campos necesarios
        const userData = {
            _id: profileData._id,
            username: profileData.username,
            avatar: profileData.avatar,
            fullname: profileData.fullname || profileData.username,
            bio: profileData.bio || '',
            story: profileData.story || '',
            mobile: profileData.mobile || '',
            address: profileData.address || '',
            website: profileData.website || '',
            followers: profileData.followers || [],
            following: profileData.following || [],
            createdAt: profileData.createdAt,
            role: profileData.role,
            isPro: profileData.isPro,
            isVerified: profileData.isVerified,
            profileViewsCount: profileData.profileViewsCount || 0,
            videoStats: profileData.videoStats || { totalVideos: 0, totalLikes: 0, totalViews: 0, totalComments: 0 },
            isFollowing: profileData.isFollowing || false
        };

        // Guardar en el estado de perfil (sin posts por ahora, si no tienes ese endpoint)
        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: userData
        });

        // Si tienes un endpoint separado para posts, llámalo aquí. 
        // Por ahora, despachamos un array vacío o lo omitimos si no es necesario.
        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: {
                _id: id,
                posts: [],
                result: 0,
                page: 1
            }
        });

        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        
    } catch (err) {
        console.error('❌ Error en getProfileUsers:', err);
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.message || err.message || 'Error al cargar perfil' }
        });
        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    }
};

// ============================================
// 🟢 UPDATE PROFILE USER
// ============================================
export const updateProfileUser = ({ userData, avatar, auth }) => async (dispatch) => {
    console.log('🚀 updateProfileUser - userData:', userData);
    console.log('🚀 updateProfileUser - avatar:', avatar ? 'presente' : 'null');
    
    if(userData.fullname && userData.fullname.length > 25) {
        return dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: "El nombre completo es demasiado largo (máx 25 caracteres)" }
        });
    }
  
    if(userData.story && userData.story.length > 200) {
        return dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: "La historia es demasiado larga (máx 200 caracteres)" }
        });
    }
  
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
  
        const updatedData = {
            fullname: userData.fullname || auth.user.fullname,
            mobile: userData.mobile || auth.user.mobile || '',
            address: userData.address || auth.user.address || '',
            story: userData.story || auth.user.story || '',
            website: userData.website || auth.user.website || '',
            avatar: userData.avatar || auth.user.avatar
        };
  
        console.log('📦 Enviando al backend:', updatedData);
  
        const res = await patchDataAPI("user", updatedData, auth.token);
      
        if (res.data && (res.data.msg || res.data.success)) {
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: { ...auth.user, ...updatedData }
                }
            });
  
            dispatch({
                type: GLOBALTYPES.ALERT, 
                payload: { success: res.data.msg || res.data.success || 'Perfil actualizado correctamente' }
            });
  
            console.log('✅ Perfil actualizado correctamente');
        }
      
    } catch (err) {
        console.error('❌ Error en updateProfileUser:', err);
      
        const errorMsg = err.response?.data?.msg || 
                         err.response?.data?.error ||
                         err.message || 
                         'Error al actualizar el perfil';
      
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: errorMsg }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// ============================================
// 🟢 FOLLOW USER - VERSIÓN MEJORADA
// ============================================
export const follow = ({ users, user, auth, socket }) => async (dispatch) => {
    let newUser;
    
    if(users.every(item => item._id !== user._id)){
        newUser = { ...user, followers: [...user.followers, auth.user] }
    } else {
        users.forEach(item => {
            if(item._id === user._id){
                newUser = { ...item, followers: [...item.followers, auth.user] }
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: { ...auth.user, following: [...auth.user.following, newUser] }
        }
    })

    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, auth.token)
        
        if(socket) {
            socket.emit('follow', res.data.newUser)
        }

        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(createNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.msg || 'Error al seguir usuario' }
        })
    }
}

// ============================================
// 🟢 UNFOLLOW USER - VERSIÓN MEJORADA
// ============================================
export const unfollow = ({ users, user, auth, socket }) => async (dispatch) => {
    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = { ...user, followers: DeleteData(user.followers, auth.user._id) }
    } else {
        users.forEach(item => {
            if(item._id === user._id){
                newUser = { ...item, followers: DeleteData(item.followers, auth.user._id) }
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBALTYPES.AUTH, 
        payload: {
            ...auth,
            user: { ...auth.user, following: DeleteData(auth.user.following, newUser._id) }
        }
    })
   
    try {
        const res = await patchDataAPI(`user/${user._id}/unfollow`, null, auth.token)
        
        if(socket) {
            socket.emit('unFollow', res.data.newUser)
        }

        const msg = {
            id: auth.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${auth.user._id}`,
        }

        dispatch(removeNotify({ msg, auth, socket }))

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.msg || 'Error al dejar de seguir' }
        })
    }
}

export const toggleSaveVideo = (videoId) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        if (!auth.token) {
            return { success: false, message: 'Necesitas iniciar sesión' };
        }

        const res = await patchDataAPI(`user/save-video/${videoId}`, {}, auth.token);
        
        if (res.data.saved) {
            // Video guardado
            dispatch({
                type: PROFILE_TYPES.SAVE_VIDEO,
                payload: { videoId }
            });
        } else {
            // Video removido de guardados
            dispatch({
                type: PROFILE_TYPES.UNSAVE_VIDEO,
                payload: { videoId }
            });
        }

        // También actualizar el auth.user si es necesario
        const { profile } = getState();
        const currentUser = auth.user;
        
        if (currentUser) {
            let updatedSavedVideos = [...(currentUser.savedVideos || [])];
            
            if (res.data.saved) {
                updatedSavedVideos.push(videoId);
            } else {
                updatedSavedVideos = updatedSavedVideos.filter(id => id !== videoId);
            }
            
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    ...auth,
                    user: { ...currentUser, savedVideos: updatedSavedVideos }
                }
            });
        }

        return res.data;

    } catch (err) {
        console.error('❌ Error toggling save video:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al guardar video' }
        });
        return { success: false, message: err.response?.data?.message };
    }
};

// ============================================
// 🆕 OBTENER VIDEOS GUARDADOS DEL PERFIL
// ============================================
export const getSavedVideosProfile = (userId, page = 1, limit = 12) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
        
        const res = await getDataAPI(`user/${userId}/saved-videos?page=${page}&limit=${limit}`, auth.token);
        
        dispatch({
            type: PROFILE_TYPES.GET_SAVED_VIDEOS,
            payload: {
                userId,
                videos: res.data.videos,
                total: res.data.total,
                page: res.data.page,
                hasMore: res.data.hasMore
            }
        });
        
        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        
        return res.data;

    } catch (err) {
        console.error('❌ Error getting saved videos:', err);
        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al cargar videos guardados' }
        });
    }
};

// ============================================
// 🆕 VERIFICAR SI VIDEO ESTÁ GUARDADO
// ============================================
export const checkSavedVideo = (videoId) => async (dispatch, getState) => {
    try {
        const { auth } = getState();
        
        if (!auth.token) return false;
        
        const res = await getDataAPI(`user/check-saved/${videoId}`, auth.token);
        
        dispatch({
            type: PROFILE_TYPES.CHECK_SAVED_VIDEO,
            payload: { videoId, saved: res.data.saved }
        });
        
        return res.data.saved;

    } catch (err) {
        console.error('❌ Error checking saved video:', err);
        return false;
    }
};

// ============================================
// 🆕 OBTENER PERFIL CON VIDEOS GUARDADOS
// ============================================
export const getProfileWithSavedVideos = ({ id, auth }) => async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id })

    try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true })
        
        const [usersRes, postsRes, savedRes] = await Promise.all([
            getDataAPI(`user/${id}`, auth.token),
               getDataAPI(`user/${id}/saved-videos?page=1&limit=12`, auth.token)
        ]);

        if (!usersRes.data || !usersRes.data.user) {
            throw new Error('Usuario no encontrado');
        }

        const userData = {
            ...usersRes.data.user,
            _id: id,
            profileViewsCount: usersRes.data.user.profileViewsCount || 0,
            followersCount: usersRes.data.user.followers?.length || 0,
            followingCount: usersRes.data.user.following?.length || 0,
            savedVideos: savedRes.data.videos || [],
            savedVideosTotal: savedRes.data.total || 0
        };

        const postsData = {
            _id: id,
            posts: postsRes.data.posts || [],
            result: postsRes.data.pagination?.totalPosts || postsRes.data.result || 0,
            page: 1
        };

        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: userData
        });

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: postsData
        });

        // Registrar vista si no es el propio usuario
        if (auth.user._id !== id) {
            await dispatch(registerProfileView(id));
        }

        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
        
    } catch (err) {
        console.error('❌ Error en getProfileWithSavedVideos:', err);
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.msg || 'Error al cargar perfil' }
        });
        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    }
};