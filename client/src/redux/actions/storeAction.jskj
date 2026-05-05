import { STORE_TYPES } from '../constants/storeConstants'
import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'

// ==================== CREAR TIENDA ====================
export const createStore = ({ storeData, auth }) => async (dispatch) => {
  console.log('🔄 ACTION: createStore')
  console.log('📦 StoreData recibido:', storeData)
  console.log('👤 Auth:', auth)
  
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    // Preparar datos para el backend
    const payload = {
      name: storeData.name || 'Mi Tienda',
      description: storeData.description || '',
      category: storeData.category || 'General',
      plan: storeData.plan || 'Free',
      duration: storeData.duration || 30,
      price: storeData.price || 0,
      credits: storeData.credits || 0,
      storage: storeData.storage || 100,
      originalPlan: storeData.originalPlan || null
    }

    console.log('📤 Payload a enviar:', payload)
    console.log('🔑 Token:', auth.token ? '✅ Presente' : '❌ Ausente')

    if (!auth.token) {
      throw new Error('Token de autenticación no encontrado')
    }

    // Llamar a la API
    const res = await postDataAPI('stores', payload, auth.token)

    console.log('✅ Respuesta del servidor:', res.data)

    // Despachar acciones de éxito
    dispatch({
      type: STORE_TYPES.CREATE_STORE,
      payload: res.data.store
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Tienda creada con éxito! 🎉',
        loading: false
      }
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    // Redirigir después de éxito
    if (res.data.store?._id) {
      setTimeout(() => {
        window.location.href = `/store-dashboard` // y que el componente maneje la lógica
      }, 1500)
    }

    return res.data

  } catch (err) {
    console.error('❌ ERROR en createStore:')
    console.error('   Respuesta:', err.response?.data)
    console.error('   Status:', err.response?.status)
    console.error('   Mensaje:', err.message)

    let errorMsg = 'Error al crear la tienda'

    if (err.response) {
      // Manejar diferentes tipos de errores
      if (err.response.status === 400) {
        errorMsg = err.response.data.msg || 'Datos inválidos'
      } else if (err.response.status === 401) {
        errorMsg = 'Sesión expirada. Por favor, inicia sesión nuevamente.'
        // Redirigir a login
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else if (err.response.status === 500) {
        errorMsg = 'Error del servidor. Por favor, intenta más tarde.'
      } else {
        errorMsg = err.response.data.msg || `Error (${err.response.status})`
      }
    }

    // Despachar acciones de error
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: errorMsg
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: errorMsg,
        loading: false
      }
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    throw err
  }
}

// ==================== OBTENER TIENDA POR ID ====================
export const getStoreById = ({ id, auth }) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    const token = auth?.token
    const res = await getDataAPI(`stores/${id}`, token)

    dispatch({
      type: STORE_TYPES.GET_STORE,
      payload: res.data
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    return res.data

  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.response?.data?.msg || err.message
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al obtener la tienda'
      }
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== OBTENER TIENDAS DEL USUARIO ====================
export const getStoresByUser = ({ userId, auth }) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    const token = auth?.token
    const res = await getDataAPI(`stores/user/${userId}`, token)

    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: res.data.stores || res.data
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    return res.data

  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.response?.data?.msg || err.message
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== OBTENER TODAS LAS TIENDAS ====================
export const getAllStores = ({ page = 1, limit = 20, category, plan } = {}) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    let url = `stores/all?page=${page}&limit=${limit}`
    if (category) url += `&category=${category}`
    if (plan) url += `&plan=${plan}`

    const res = await getDataAPI(url)

    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: res.data
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    return res.data

  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.response?.data?.msg || err.message
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== ACTUALIZAR TIENDA ====================
export const updateStore = ({ id, storeData, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    const res = await patchDataAPI(`stores/update/${id}`, storeData, auth.token)

    dispatch({
      type: STORE_TYPES.UPDATE_STORE,
      payload: res.data.store
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Tienda actualizada con éxito!',
        loading: false
      }
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    return res.data

  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.response?.data?.msg || err.message
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al actualizar la tienda',
        loading: false
      }
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== CAMBIAR PLAN ====================
export const changePlan = ({ id, plan, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await patchDataAPI(`stores/change-plan/${id}`, { plan }, auth.token)

    dispatch({
      type: STORE_TYPES.CHANGE_PLAN,
      payload: res.data.store
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Plan cambiado con éxito!',
        loading: false
      }
    })

    return res.data

  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al cambiar el plan',
        loading: false
      }
    })
    
    throw err
  }
}

// ==================== ELIMINAR TIENDA ====================
export const deleteStore = ({ id, auth }) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })

    const res = await deleteDataAPI(`stores/delete/${id}`, auth.token)

    dispatch({
      type: STORE_TYPES.DELETE_STORE,
      payload: id
    })

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Tienda eliminada con éxito!',
        loading: false
      }
    })

    return res.data

  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al eliminar la tienda',
        loading: false
      }
    })
    
    throw err
  }
}

// ==================== BUSCAR TIENDAS ====================
export const searchStores = ({ query, category, city }) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })

    let url = 'stores/search?'
    const params = []
    
    if (query) params.push(`q=${encodeURIComponent(query)}`)
    if (category) params.push(`category=${encodeURIComponent(category)}`)
    if (city) params.push(`city=${encodeURIComponent(city)}`)
    
    url += params.join('&')

    const res = await getDataAPI(url)

    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: res.data
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })

    return res.data

  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.response?.data?.msg || err.message
    })

    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== RESET ERROR ====================
export const resetStoreError = () => (dispatch) => {
  dispatch({
    type: STORE_TYPES.ERROR_STORE,
    payload: null
  })
}

// ==================== ACCIONES LEGACY (para compatibilidad) ====================

// Función wrapper para mantener compatibilidad con código antiguo
export const createStoreLegacy = (storeData) => async (dispatch, getState) => {
  const state = getState()
  const { auth } = state
  
  return dispatch(createStore({
    storeData,
    auth: {
      token: auth.token || auth.userInfo?.token,
      user: auth.user || auth.userInfo
    }
  }))
}

// Reset para compatibilidad
export const resetStoreCreate = () => (dispatch) => {
  dispatch({
    type: STORE_TYPES.CREATE_STORE,
    payload: null
  })
}

// storeActions.js - AGREGAR ESTAS ACCIONES

// ==================== OBTENER MI TIENDA ====================
export const getMyStore = () => async (dispatch, getState) => {
  try {
    const { auth } = getState()
    
    if (!auth.token) {
      throw new Error('No autenticado')
    }
    
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    const res = await getDataAPI('stores/my-store', auth.token)
    
    dispatch({
      type: STORE_TYPES.GET_MY_STORE,
      payload: res.data.store
    })
    
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    return res.data
    
  } catch (err) {
    console.error('❌ Error en getMyStore action:', err)
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al obtener tu tienda'
      }
    })
    
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
    
    throw err
  }
}

// ==================== TOGGLE ACTIVAR/DESACTIVAR ====================
export const toggleStoreActive = (storeId) => async (dispatch, getState) => {
  try {
    const { auth } = getState()
    
    if (!auth.token) {
      throw new Error('No autenticado')
    }
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await patchDataAPI(`stores/toggle-active/${storeId}`, {}, auth.token)
    
    dispatch({
      type: STORE_TYPES.TOGGLE_ACTIVE,
      payload: res.data.store
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Visibilidad actualizada',
        loading: false
      }
    })
    
    return res.data
    
  } catch (err) {
    console.error('❌ Error en toggleStoreActive:', err)
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || 'Error al cambiar visibilidad',
        loading: false
      }
    })
    
    throw err
  }
}