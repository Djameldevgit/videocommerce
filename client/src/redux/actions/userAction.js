import { GLOBALTYPES } from './globalTypes';
import { imageUpload } from '../../utils/imageUpload';
import {   getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';

export const USER_TYPES = {
    LOADING_USERS: 'LOADING_USERS',
    GET_USERS: 'GET_USERS',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    // NUEVAS CONSTANTES PARA ACTIVACIÓN/DESACTIVACIÓN
    ACTIVATE_USER: 'ACTIVATE_USER',
    DEACTIVATE_USER: 'DEACTIVATE_USER',
    TOGGLE_ACTIVE_STATUS: 'TOGGLE_ACTIVE_STATUS',
    // NUEVAS CONSTANTES PARA BLOQUEO/DESBLOQUEO
    BLOCK_USER: 'BLOCK_USER',
    UNBLOCK_USER: 'UNBLOCK_USER',

    ACTIVATE_PRO: 'ACTIVATE_PRO',
    DEACTIVATE_PRO: 'DEACTIVATE_PRO',



};

export const updateUserFeatures = ({ userId, features, token }) => async (dispatch) => {
    try {
        const res = await fetch(`/api/users/${userId}/features`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify(features)
        });

        const data = await res.json();
        if (data.msg) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: data.msg }
            });
        }

        dispatch({
            type: USER_TYPES.UPDATE_USER,
            payload: { ...data.user }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.message }
        });
    }
};

export const toggleVerification = (userId, token) => async (dispatch) => {
    try {
        const res = await patchDataAPI(`users/${userId}/toggle-verify`, {}, token);

        dispatch({
            type: USER_TYPES.UPDATE_USER,
            payload: res.data.user,
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.msg },
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || "Error al cambiar verificación" },
        });
    }
};

export const getUsers = (token) => async (dispatch) => {
    try {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });

        const res = await getDataAPI('users', token);
        if (!res || !res.data) {
            console.error("Respuesta inválida en getUsers:", res);
            return;
        }

        dispatch({
            type: USER_TYPES.GET_USERS,
            payload: { ...res.data, page: 1 },
        });

    } catch (err) {
        console.error('Error in getUsers:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response?.data?.msg || err.message || 'Error loading users'
            }
        });
    } finally {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
    }
};

export const getUsersAction = (token) => async (dispatch) => {
    try {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });
        const res = await getDataAPI(`users`, token);

        dispatch({
            type: USER_TYPES.GET_USERS,
            payload: { ...res.data, page: 1 },
        });

        dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

export const updateUser = ({ content, images, auth, status }) => async (dispatch) => {
    let media = [];
    const imgNewUrl = images.filter(img => !img.url);
    const imgOldUrl = images.filter(img => img.url);

    if (status.content === content && imgNewUrl.length === 0 && imgOldUrl.length === status.images.length) return;

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
        if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

        const res = await patchDataAPI(`user/${status._id}`, {
            content, images: [...imgOldUrl, ...media]
        }, auth.token);

        dispatch({ type: USER_TYPES.UPDATE_USER, payload: res.data.newUser });
        dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response.data.msg }
        });
    }
};

// ============================================
// ACCIONES DE ACTIVAR/DESACTIVAR USUARIO
// ============================================

// Activar usuario (cambia isActive a true)
export const activateUser = (userId, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await patchDataAPI(`user/${userId}/activate`, {}, token);

        dispatch({
            type: USER_TYPES.ACTIVATE_USER,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Usuario activado correctamente' }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al activar usuario' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// Desactivar usuario (cambia isActive a false)
export const deactivateUser = (userId, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await patchDataAPI(`user/${userId}/deactivate`, {}, token);

        dispatch({
            type: USER_TYPES.DEACTIVATE_USER,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Usuario desactivado correctamente' }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al desactivar usuario' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// Toggle activar/desactivar (alterna el estado)
export const toggleActiveStatus = (userId, token) => async (dispatch) => {
    try {
        const res = await patchDataAPI(`toggle_active/${userId}`, null, token);
        
        dispatch({
            type: USER_TYPES.TOGGLE_ACTIVE_STATUS,
            payload: res.data.user,
        });
        
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.msg || 'Estado actualizado' }
        });
    } catch (err) {
        console.error(err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || 'Error al cambiar estado' }
        });
    }
};

// ============================================
// ACCIONES DE BLOQUEAR/DESBLOQUEAR USUARIO
// ============================================

// Bloquear usuario con motivo, descripción y fecha límite
export const blockUser = (userId, blockData, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await patchDataAPI(`user/${userId}/block`, {
            reason: blockData.reason,
            description: blockData.description,
            blockExpiryDate: blockData.blockExpiryDate
        }, token);

        dispatch({
            type: USER_TYPES.BLOCK_USER,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Usuario bloqueado correctamente' }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al bloquear usuario' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// Desbloquear usuario
export const unblockUser = (userId, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await patchDataAPI(`user/${userId}/unblock`, {}, token);

        dispatch({
            type: USER_TYPES.UNBLOCK_USER,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message || 'Usuario desbloqueado correctamente' }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al desbloquear usuario' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// ============================================
// ELIMINAR USUARIO
// ============================================

export const deleteUser = ({ id, auth }) => async (dispatch) => {
    try {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: true });

        await deleteDataAPI(`user/${id}`, auth.token);

        dispatch({
            type: USER_TYPES.DELETE_USER,
            payload: id
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: 'Usuario eliminado correctamente' }
        });

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.msg || 'Error al eliminar usuario' }
        });
    } finally {
        dispatch({ type: USER_TYPES.LOADING_USERS, payload: false });
    }
};
export const activatePro = (userId, proExpiryDate, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        // ✅ Verificar que la URL sea correcta
        const res = await patchDataAPI(`user/${userId}/activate-pro`, { proExpiryDate }, token);

        dispatch({
            type: USER_TYPES.ACTIVATE_PRO,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message }
        });

    } catch (err) {
        console.error('Error activatePro:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al activar Usuario Pro' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};

// Desactivar usuario Pro
export const deactivatePro = (userId, token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        // ✅ Verificar que la URL sea correcta
        const res = await patchDataAPI(`user/${userId}/deactivate-pro`, {}, token);

        dispatch({
            type: USER_TYPES.DEACTIVATE_PRO,
            payload: res.data.user
        });

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { success: res.data.message }
        });

    } catch (err) {
        console.error('Error deactivatePro:', err);
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { error: err.response?.data?.message || 'Error al desactivar Usuario Pro' }
        });
    } finally {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
};