// 📂 redux/actions/categoryActions.js - VERSIÓN CORREGIDA (sin metadata)

import * as types from '../constants/categoryConstants';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

// ==================== 1. OBTENER CATEGORÍAS PARA SLIDER ====================
export const getSliderCategories = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SLIDER_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/slider`);
    
    console.log('🎠 Catégories pour slider:', data.categories?.length || 0);
    
    dispatch({
      type: types.GET_SLIDER_CATEGORIES_SUCCESS,
      payload: data.categories || []
    });
    
    return { success: true, categories: data.categories };
    
  } catch (error) {
    console.error('❌ Erreur getSliderCategories:', error);
    dispatch({
      type: types.GET_SLIDER_CATEGORIES_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 2. OBTENER CATEGORÍAS PRINCIPALES ====================
export const getMainCategories = (page = 1, limit = 10, includeVideos = false) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_MAIN_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
      params: { page, limit, videos: includeVideos }
    });
    
    console.log(`📊 Catégories principales - page ${page}:`, {
      categoriesCount: data.categories?.length || 0,
      pagination: data.pagination
    });
    
    dispatch({
      type: types.GET_MAIN_CATEGORIES_SUCCESS,
      payload: {
        categories: data.categories || [],
        currentPage: data.pagination?.currentPage || page,
        hasMoreCategories: data.pagination?.hasMore || false,
        totalCategories: data.pagination?.totalCategories || 0,
        totalPages: data.pagination?.totalPages || 1
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getMainCategories:', error);
    dispatch({
      type: types.GET_MAIN_CATEGORIES_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 3. OBTENER CATEGORÍAS POPULARES ====================
export const getPopularCategories = (limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_POPULAR_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/popular`, {
      params: { limit }
    });
    
    dispatch({
      type: types.GET_POPULAR_CATEGORIES_SUCCESS,
      payload: data.categories || []
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getPopularCategories:', error);
    dispatch({
      type: types.GET_POPULAR_CATEGORIES_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 4. OBTENER VIDEOS POR CATEGORÍA ====================
export const getVideosByCategory = (
  categorySlug,
  page = 1,
  limit = 12,
  wilaya = null,
  minPrice = null,
  maxPrice = null,
  sortBy = 'recent'
) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_VIDEOS });
    
    console.log(`📡 getVideosByCategory - ${categorySlug}, page ${page}`);
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/${categorySlug}/videos`, {
      params: {
        page,
        limit,
        wilaya,
        minPrice,
        maxPrice,
        sortBy
      }
    });
    
    console.log(`✅ Vidéos reçus: ${data.videos?.length || 0}, total: ${data.total || 0}`);
    
    const isFirstPage = page === 1;
    
    dispatch({
      type: types.GET_CATEGORY_VIDEOS_SUCCESS,
      payload: {
        categoryInfo: data.categoryInfo || {},
        videos: isFirstPage ? (data.videos || []) : data.videos || [],
        currentPage: data.page || page,
        hasMoreVideos: data.hasMore || false,
        totalVideos: data.total || 0,
        totalPages: data.totalPages || 1,
        filters: data.filters || {}
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getVideosByCategory:', error);
    dispatch({
      type: types.GET_CATEGORY_VIDEOS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false, videos: [] };
  }
};

// ==================== 5. CHARGER PLUS DE VIDÉOS (SCROLL INFINI) ====================
export const loadMoreVideos = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { 
      activeCategory,
      videosCurrentPage = 0,
      videos = [],
      activeFilters = {}
    } = state.category || {};

    const nextPage = videosCurrentPage + 1;
    
    if (!activeCategory) {
      console.error('❌ Pas de catégorie active');
      return;
    }
    
    console.log(`📡 loadMoreVideos - Chargement page ${nextPage} pour ${activeCategory}`);
    
    dispatch({ type: types.LOAD_MORE_VIDEOS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/${activeCategory}/videos`, {
      params: { 
        page: nextPage, 
        limit: 12,
        wilaya: activeFilters.wilaya,
        minPrice: activeFilters.minPrice,
        maxPrice: activeFilters.maxPrice,
        sortBy: activeFilters.sortBy || 'recent'
      }
    });
    
    dispatch({
      type: types.GET_CATEGORY_VIDEOS_SUCCESS,
      payload: {
        categoryInfo: state.category.categoryInfo,
        videos: [...videos, ...(data.videos || [])],
        currentPage: nextPage,
        hasMoreVideos: data.hasMore || false,
        totalVideos: data.total || state.category.totalVideos,
        totalPages: data.totalPages || 1,
        filters: data.filters || {}
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur loadMoreVideos:', error);
    dispatch({
      type: types.GET_CATEGORY_VIDEOS_FAIL,
      payload: error.response?.data?.message || 'Erreur chargement vidéos'
    });
  }
};

// ==================== 6. OBTENER FILTRES POUR CATÉGORIE ====================
export const getCategoryFilters = (categorySlug) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_FILTERS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/${categorySlug}/filters`);
    
    console.log('🎯 Filtres reçus:', {
      wilayasCount: data.filters?.wilayas?.length || 0,
      priceRange: data.filters?.priceRange
    });
    
    dispatch({
      type: types.GET_CATEGORY_FILTERS_SUCCESS,
      payload: {
        categoryInfo: data.categoryInfo || {},
        filters: data.filters || {
          wilayas: [],
          priceRange: { min: 0, max: 1000000 },
          hasCommercial: false
        }
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getCategoryFilters:', error);
    dispatch({
      type: types.GET_CATEGORY_FILTERS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 7. OBTENER DÉTAILS D'UNE CATÉGORIE ====================
export const getCategoryDetails = (identifier, includeVideos = false, page = 1, limit = 12) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_DETAILS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/${identifier}`, {
      params: { videos: includeVideos, page, limit }
    });
    
    dispatch({
      type: types.GET_CATEGORY_DETAILS_SUCCESS,
      payload: {
        category: data.category || {},
        videos: data.videos || [],
        pagination: data.pagination || null
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getCategoryDetails:', error);
    dispatch({
      type: types.GET_CATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 8. RECHERCHER DES CATÉGORIES ====================
export const searchCategories = (query, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: types.SEARCH_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/search/${query}`, {
      params: { limit }
    });
    
    dispatch({
      type: types.SEARCH_CATEGORIES_SUCCESS,
      payload: {
        categories: data.categories || [],
        total: data.total || 0,
        searchTerm: query
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur searchCategories:', error);
    dispatch({
      type: types.SEARCH_CATEGORIES_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 9. OBTENER STATISTIQUES DES CATÉGORIES ====================
export const getCategoryStats = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_STATS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/stats`);
    
    dispatch({
      type: types.GET_CATEGORY_STATS_SUCCESS,
      payload: {
        stats: data.stats || {},
        topCategories: data.topCategories || []
      }
    });
    
    return data;
    
  } catch (error) {
    console.error('❌ Erreur getCategoryStats:', error);
    dispatch({
      type: types.GET_CATEGORY_STATS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

// ==================== 10. FILTRES ACTIFS ====================
export const setActiveFilters = (filters) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_FILTERS, 
    payload: filters 
  });
};

export const resetActiveFilters = () => (dispatch) => {
  dispatch({ type: types.RESET_ACTIVE_FILTERS });
};

// ==================== 11. NAVIGATION ====================
export const setActiveCategory = (categorySlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_CATEGORY, 
    payload: categorySlug 
  });
};

// ==================== 12. NETTOYAGE ====================
export const resetCategoryVideos = () => (dispatch) => {
  dispatch({ type: types.RESET_CATEGORY_VIDEOS });
};

export const clearCategoryState = () => (dispatch) => {
  dispatch({ type: types.CLEAR_CATEGORY_STATE });
};

export const clearCategoryErrors = () => (dispatch) => {
  dispatch({ type: types.CLEAR_CATEGORY_ERRORS });
};





export const getCategoriesForAccordion = () => () => {
  
};
export const getCategoryTree = () => () => {
  
};
export const getCategoryPosts = () => () => {
  
};