// 📂 redux/reducers/categoryReducer.js - VERSIÓN ACTUALIZADA PARA VideoCommerce

import * as types from '../constants/categoryConstants';

const initialState = {
  // ==================== SLIDER ====================
  sliderCategories: [],
  sliderLoading: false,
  sliderError: null,

  // ==================== CATÉGORIES PRINCIPALES ====================
  categories: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMoreCategories: true,
  totalCategories: 0,
  totalPages: 1,

  // ==================== CATÉGORIES POPULAIRES ====================
  popularCategories: [],
  popularLoading: false,
  popularError: null,

  // ==================== PAGE CATÉGORIE ====================
  activeCategory: null,
  categoryInfo: {},
  videos: [],
  videosLoading: false,
  videosError: null,
  videosCurrentPage: 1,
  hasMoreVideos: false,
  totalVideos: 0,
  totalPages: 1,

  // ==================== FILTRES ====================
  filters: {
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    hasCommercial: false
  },
  filtersLoading: false,
  filtersError: null,
  activeFilters: {
    wilaya: null,
    minPrice: null,
    maxPrice: null,
    sortBy: 'recent'
  },

  // ==================== DÉTAILS CATÉGORIE ====================
  categoryDetails: null,
  detailsLoading: false,
  detailsError: null,

  // ==================== STATISTIQUES ====================
  stats: {
    totalCategories: 0,
    totalVideos: 0,
    categoriesWithVideos: 0,
    categoriesWithoutVideos: 0
  },
  topCategories: [],
  statsLoading: false,
  statsError: null,

  // ==================== RECHERCHE ====================
  searchResults: [],
  searchLoading: false,
  searchError: null,
  searchTerm: null
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // ==================== SLIDER ====================
    case types.GET_SLIDER_CATEGORIES:
      return { ...state, sliderLoading: true, sliderError: null };
      
    case types.GET_SLIDER_CATEGORIES_SUCCESS:
      console.log('🎠 Slider mis à jour:', action.payload?.length || 0);
      return {
        ...state,
        sliderCategories: action.payload || [],
        sliderLoading: false,
        sliderError: null
      };
      
    case types.GET_SLIDER_CATEGORIES_FAIL:
      return {
        ...state,
        sliderLoading: false,
        sliderError: action.payload
      };

    // ==================== CATÉGORIES PRINCIPALES ====================
    case types.GET_MAIN_CATEGORIES:
      return { ...state, loading: true, error: null };
      
    case types.GET_MAIN_CATEGORIES_SUCCESS:
      const isFirstPage = (action.payload.currentPage || 1) === 1;
      return {
        ...state,
        loading: false,
        categories: isFirstPage 
          ? (action.payload.categories || []) 
          : [...state.categories, ...(action.payload.categories || [])],
        currentPage: action.payload.currentPage || 1,
        hasMoreCategories: action.payload.hasMoreCategories || false,
        totalCategories: action.payload.totalCategories || 0,
        totalPages: action.payload.totalPages || 1,
        error: null
      };
      
    case types.GET_MAIN_CATEGORIES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        categories: []
      };

    // ==================== CATÉGORIES POPULAIRES ====================
    case types.GET_POPULAR_CATEGORIES:
      return { ...state, popularLoading: true, popularError: null };
      
    case types.GET_POPULAR_CATEGORIES_SUCCESS:
      return {
        ...state,
        popularCategories: action.payload || [],
        popularLoading: false,
        popularError: null
      };
      
    case types.GET_POPULAR_CATEGORIES_FAIL:
      return {
        ...state,
        popularLoading: false,
        popularError: action.payload
      };

    // ==================== VIDÉOS PAR CATÉGORIE ====================
    case types.GET_CATEGORY_VIDEOS:
      return { ...state, videosLoading: true, videosError: null };
      
    case types.GET_CATEGORY_VIDEOS_SUCCESS:
      const isFirstVideoPage = (action.payload.currentPage || 1) === 1;
      return {
        ...state,
        videosLoading: false,
        videosError: null,
        categoryInfo: isFirstVideoPage 
          ? (action.payload.categoryInfo || {}) 
          : state.categoryInfo,
        videos: isFirstVideoPage 
          ? (action.payload.videos || []) 
          : [...state.videos, ...(action.payload.videos || [])],
        videosCurrentPage: action.payload.currentPage || 1,
        hasMoreVideos: action.payload.hasMoreVideos || false,
        totalVideos: action.payload.totalVideos || 0,
        totalPages: action.payload.totalPages || 1,
        filters: action.payload.filters || state.filters
      };
      
    case types.GET_CATEGORY_VIDEOS_FAIL:
      return {
        ...state,
        videosLoading: false,
        videosError: action.payload
      };
      
    case types.LOAD_MORE_VIDEOS:
      return { ...state, videosLoading: true };

    // ==================== FILTRES ====================
    case types.GET_CATEGORY_FILTERS:
      return { ...state, filtersLoading: true, filtersError: null };
      
    case types.GET_CATEGORY_FILTERS_SUCCESS:
      return {
        ...state,
        filtersLoading: false,
        filters: action.payload.filters || {
          wilayas: [],
          priceRange: { min: 0, max: 1000000 },
          hasCommercial: false
        },
        categoryInfo: action.payload.categoryInfo || state.categoryInfo,
        filtersError: null
      };
      
    case types.GET_CATEGORY_FILTERS_FAIL:
      return {
        ...state,
        filtersLoading: false,
        filtersError: action.payload
      };

    // ==================== DÉTAILS CATÉGORIE ====================
    case types.GET_CATEGORY_DETAILS:
      return { ...state, detailsLoading: true, detailsError: null };
      
    case types.GET_CATEGORY_DETAILS_SUCCESS:
      return {
        ...state,
        detailsLoading: false,
        categoryDetails: action.payload.category || null,
        videos: action.payload.videos || [],
        videosCurrentPage: 1,
        hasMoreVideos: action.payload.pagination?.hasMore || false,
        totalVideos: action.payload.pagination?.totalVideos || 0,
        totalPages: action.payload.pagination?.totalPages || 1,
        detailsError: null
      };
      
    case types.GET_CATEGORY_DETAILS_FAIL:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.payload
      };

    // ==================== STATISTIQUES ====================
    case types.GET_CATEGORY_STATS:
      return { ...state, statsLoading: true, statsError: null };
      
    case types.GET_CATEGORY_STATS_SUCCESS:
      return {
        ...state,
        statsLoading: false,
        stats: action.payload.stats || state.stats,
        topCategories: action.payload.topCategories || [],
        statsError: null
      };
      
    case types.GET_CATEGORY_STATS_FAIL:
      return {
        ...state,
        statsLoading: false,
        statsError: action.payload
      };

    // ==================== RECHERCHE ====================
    case types.SEARCH_CATEGORIES:
      return { ...state, searchLoading: true, searchError: null };
      
    case types.SEARCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchResults: action.payload.categories || [],
        searchTerm: action.payload.searchTerm || null,
        searchError: null
      };
      
    case types.SEARCH_CATEGORIES_FAIL:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload,
        searchResults: []
      };

    // ==================== NAVIGATION ====================
    case types.SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
        categoryInfo: {},
        videos: [],
        videosCurrentPage: 1,
        hasMoreVideos: false,
        totalVideos: 0,
        videosLoading: false,
        videosError: null,
        filters: {
          wilayas: [],
          priceRange: { min: 0, max: 1000000 },
          hasCommercial: false
        },
        activeFilters: {
          wilaya: null,
          minPrice: null,
          maxPrice: null,
          sortBy: 'recent'
        }
      };

    // ==================== FILTRES ACTIFS ====================
    case types.SET_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          ...action.payload
        },
        videos: [],
        videosCurrentPage: 1,
        hasMoreVideos: false
      };

    case types.RESET_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: {
          wilaya: null,
          minPrice: null,
          maxPrice: null,
          sortBy: 'recent'
        },
        videos: [],
        videosCurrentPage: 1,
        hasMoreVideos: false
      };

    // ==================== NETTOYAGE ====================
    case types.RESET_CATEGORY_VIDEOS:
      return {
        ...state,
        videos: [],
        videosCurrentPage: 1,
        hasMoreVideos: false,
        totalVideos: 0,
        videosLoading: false,
        videosError: null
      };

    case types.CLEAR_CATEGORY_STATE:
      return {
        ...state,
        activeCategory: null,
        categoryInfo: {},
        videos: [],
        videosCurrentPage: 1,
        hasMoreVideos: false,
        totalVideos: 0,
        videosLoading: false,
        videosError: null,
        categoryDetails: null,
        searchResults: [],
        searchTerm: null
      };

    case types.CLEAR_CATEGORY_ERRORS:
      return {
        ...state,
        error: null,
        videosError: null,
        filtersError: null,
        detailsError: null,
        statsError: null,
        searchError: null,
        popularError: null,
        sliderError: null
      };

    default:
      return state;
  }
};

export default categoryReducer;