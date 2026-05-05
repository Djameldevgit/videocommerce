import { patchDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify

export const ROLES_TYPES = {
  LOADING: 'LOADING',
  USER_ROLE: 'USER_ROLE',
  USER_PRO: 'USER_PRO',
  MODERADOR_ROLE: 'MODERADOR_ROLE',
  ADMIN_ROLE: 'ADMIN_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE'
}

// ============================================
// ✅ ACTUALIZAR ROL CON NOTIFICACIÓN (FUNCIÓN UNIFICADA)
// ============================================
export const updateUserRole = (userId, newRole, token, auth, socket, userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await patchDataAPI(`update_role/${userId}`, { role: newRole }, token);

    // Actualización simultánea en roles
    dispatch({
      type: ROLES_TYPES.UPDATE_ROLE,
      payload: {
        userId,
        newRole,
        updatedUser: res.data.user
      }
    });

    // ✅ Enviar notificación al usuario cuyo rol cambió
    if (userData && userData._id !== auth.user?._id) {
      const roleMessages = {
        'admin': '👑 Vous avez été promu Administrateur',
        'userpro': '⭐ Vous avez été promu Utilizateur Profesionelle',
        'Moderateur': '🛡️ Vous avez été promu Modérateur',
        'user': '👤 Votre rôle a été changé à Utilisateur'
      };

      const msg = {
        id: auth.user._id,
        text: roleMessages[newRole] || `Votre rôle a été changé à ${newRole}`,
        recipients: [userId],
        url: `/profile/${userId}`,
        content: `Nouveau rôle: ${newRole}`,
        image: userData.avatar,
        type: 'role'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }

    // Si el usuario modificado es el mismo logueado
    const { auth: stateAuth } = getState();
    if (stateAuth.user?._id === userId) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...stateAuth,
          user: res.data.user
        }
      });
    }

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.msg } 
    });

    return res.data;

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        error: err.response?.data?.msg || 'Error updating role' 
      }
    });
    throw err;
  }
};

// ============================================
// ✅ ROLE USER CON NOTIFICACIÓN
// ============================================
export const roleuserautenticado = (user, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    const res = await patchDataAPI(`user/${user._id}/roleuser`, { role: 'user' }, auth.token);
    
    dispatch({
      type: ROLES_TYPES.USER_ROLE,
      payload: { user, res: res.data }
    });

    // ✅ Notificar al usuario cuyo rol cambió
    if (user._id !== auth.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '👤 Votre rôle a été changé à Utilisateur',
        recipients: [user._id],
        url: `/profile/${user._id}`,
        content: `Nouveau rôle: Utilisateur`,
        image: user.avatar,
        type: 'role'
      };
      dispatch(createNotify({ msg, auth, socket }));
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// ============================================
// ✅ ROLE SUPERUSER CON NOTIFICACIÓN
// ============================================
export const userPro = (user, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });

    const res = await patchDataAPI(`user/${user._id}/roleuserpro`, { role: 'userpro' }, auth.token);

    dispatch({
      type: ROLES_TYPES.USER_PRO,
      payload: { user: { ...user, role: 'userpro' } }
    });

    // ✅ Notificar al usuario cuyo rol cambió
    if (user._id !== auth.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '⭐ Vous avez été promu utilizateur Pro',
        recipients: [user._id],
        url: `/profile/${user._id}`,
        content: `Nouveau rôle: utilizateur Pro`,
        image: user.avatar,
        type: 'role'
      };
      dispatch(createNotify({ msg, auth, socket }));
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// ============================================
// ✅ ROLE MODERADOR CON NOTIFICACIÓN
// ============================================
export const rolemoderador = (user, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    const res = await patchDataAPI(`user/${user._id}/rolemoderador`, { role: 'moderador' }, auth.token);

    dispatch({
      type: ROLES_TYPES.MODERADOR_ROLE,
      payload: { user, res: res.data }
    });

    // ✅ Notificar al usuario cuyo rol cambió
    if (user._id !== auth.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '🛡️ Vous avez été promu Modérateur',
        recipients: [user._id],
        url: `/profile/${user._id}`,
        content: `Nouveau rôle: Modérateur`,
        image: user.avatar,
        type: 'role'
      };
      dispatch(createNotify({ msg, auth, socket }));
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};

// ============================================
// ✅ ROLE ADMIN CON NOTIFICACIÓN
// ============================================
export const roleadmin = (user, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: ROLES_TYPES.LOADING, payload: true });
    const res = await patchDataAPI(`user/${user._id}/roleadmin`, { role: 'admin' }, auth.token);

    dispatch({
      type: ROLES_TYPES.ADMIN_ROLE,
      payload: { user, res: res.data }
    });

    // ✅ Notificar al usuario cuyo rol cambió
    if (user._id !== auth.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '👑 Vous avez été promu Administrateur',
        recipients: [user._id],
        url: `/profile/${user._id}`,
        content: `Nouveau rôle: Administrateur`,
        image: user.avatar,
        type: 'role'
      };
      dispatch(createNotify({ msg, auth, socket }));
    }

    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: ROLES_TYPES.LOADING, payload: false });
  }
};