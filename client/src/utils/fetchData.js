// utils/fetchData.js - VERSIÓN CORREGIDA
import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ✅ CORREGIDO: Añadir 'Bearer ' antes del token
export const getDataAPI = async (url, token) => {
    const res = await axios.get(`${BASE_URL}/api/${url}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
    return res;
}

// ✅ CORREGIDO: Añadir 'Bearer ' antes del token
export const postDataAPI = async (url, post, token) => {
    const res = await axios.post(`${BASE_URL}/api/${url}`, post, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
    return res;
}

// ✅ CORREGIDO: Añadir 'Bearer ' antes del token
export const putDataAPI = async (url, post, token) => {
    const res = await axios.put(`${BASE_URL}/api/${url}`, post, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
    return res;
}

// ✅ CORREGIDO: Añadir 'Bearer ' antes del token
export const patchDataAPI = async (url, post, token) => {
    const res = await axios.patch(`${BASE_URL}/api/${url}`, post, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
    return res;
}

// ✅ CORREGIDO: Añadir 'Bearer ' antes del token
export const deleteDataAPI = async (url, token) => {
    const res = await axios.delete(`${BASE_URL}/api/${url}`, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    })
    return res;
}