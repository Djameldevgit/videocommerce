import { GLOBALTYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'
 
 // 🔽 login con Google y Facebook (social)
 export const socialLogin = (data, platform) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    // ✅ QUITA "user/"
    const endpoint = platform === 'google' ? 'google_login' : 'facebook_login';
    const res = await postDataAPI(endpoint, data); // 🔗 POST /api/google_login

    // Ahora obtenemos el token desde la cookie usando refresh_token
    const refresh = await postDataAPI('refresh_token');

    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: refresh.data.access_token,
        user: refresh.data.user,
      },
    });

    localStorage.setItem('firstLogin', true);

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.msg },
    });

    if (typeof window !== 'undefined') window.location.href = '/';
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Error al iniciar sesión',
      },
    });
  }
};

  
export const sendAdminEmail = ({ recipients, subject, message, url = '#', token, onSuccess }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI('send-user-emails', { recipients, subject, message, url }, token);

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });

    if (onSuccess) onSuccess();
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error al enviar correos' },
    });
  }
};

    

 
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await postDataAPI('forgot', { email })

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
  }
}

export const resetPassword = (password, token) => async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
  
      const res = await postDataAPI('reset', { password }, token)
  
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
    } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
  }
  
  export const activationAccount = (activation_token) => async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
  
      // Activar la cuenta
      const res = await postDataAPI('activate', { activation_token });
  
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: res.data.msg },
      });
  
      // Una vez activado, recargar el usuario y token en auth
      const refresh = await postDataAPI('refresh_token');
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: refresh.data.access_token,
          user: refresh.data.user,
        },
      });
  
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error: err.response?.data?.msg || 'Error en activación',
        },
      });
    }
  };
   
  
export const sendActivationEmail = (token) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

        const res = await postDataAPI('send_activation_email', null, token); // null porque no enviamos body

        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        });
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response.data.msg
            }
        });
    }
};
 
 

  
export const login = (data) => async (dispatch) => {
  try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
      const res = await postDataAPI('login', data)

      dispatch({
          type: GLOBALTYPES.AUTH,
          payload: {
              token: res.data.access_token,
              user: res.data.user
          }
      })
    

      localStorage.setItem("firstLogin", true)
      dispatch({
          type: GLOBALTYPES.ALERT,
          payload: {
              success: res.data.msg
          }
      })

  } catch (err) {
      dispatch({
          type: GLOBALTYPES.ALERT,
          payload: {
              error: err.response.data.msg
          }
      })
  }
}
 
export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if (firstLogin) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

        try {
            const res = await postDataAPI('refresh_token')
            dispatch({
                type: GLOBALTYPES.AUTH,
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                }
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: {
                    error: err.response.data.msg
                }
            })
        }
    }
}

export const register = (data, t, lang) => async (dispatch) => {
    const check = valid(data, t, lang);
    if (check.errLength > 0)
        return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg })

    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

        const res = await postDataAPI('register', data)
        dispatch({
            type: GLOBALTYPES.AUTH,
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        })

        localStorage.setItem("firstLogin", true)
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                success: res.data.msg
            }
        })
    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT,
            payload: {
                error: err.response.data.msg
            }
        })
    }
}


export const logout = () => async (dispatch) => {
  try {
      localStorage.removeItem('firstLogin')
      await postDataAPI('logout')
      window.location.href = "/"
  } catch (err) {
      dispatch({ 
          type: GLOBALTYPES.ALERT, 
          payload: {
              error: err.response.data.msg
          } 
      })
  }
}