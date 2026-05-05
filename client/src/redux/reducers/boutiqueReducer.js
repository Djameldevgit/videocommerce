// 📂 redux/reducers/boutiqueReducer.js - VERSIÓN CORREGIDA Y ESTABLE
import { BOUTIQUE_TYPES } from '../actions/boutiqueAction';

const initialState = {
  // Estados existentes
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 0,
  homeBoutiques: [],
  boutiquesByCategory: {},
  currentBoutique: null,
  boutiqueByDomain: null,
  userBoutiques: [],
  boutiqueStats: {},
  loading: false,
  loadingByCategory: {},
  error: null,
  
  // Estados para administración
  adminBoutiques: [],
 
  adminTotal: 0,
  adminPage: 1,
  adminTotalPages: 1,
  adminHasMore: false,
  loadingAdmin: false,
};

const boutiqueReducer = (state = initialState, action) => {
  switch (action.type) {

    // ============ LOADING STATES ============
    case BOUTIQUE_TYPES.LOADING_BOUTIQUE:
      return { ...state, loading: action.payload };

    case BOUTIQUE_TYPES.GET_BOUTIQUES_FOR_HOME:
      return { ...state, homeBoutiques: action.payload };

    case BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY:
      return {
        ...state,
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.category]: action.payload.loading
        }
      };

    case 'UPDATE_BOUTIQUE_STATS':
      return {
        ...state,
        boutiques: state.boutiques.map(b =>
          b._id === action.payload.boutiqueId
            ? { ...b, stats: action.payload.stats }
            : b
        ),
        currentBoutique: state.currentBoutique?._id === action.payload.boutiqueId
          ? { ...state.currentBoutique, stats: action.payload.stats }
          : state.currentBoutique
      };
 
    case 'UPDATE_BOUTIQUE_VIEWS':
      const { boutiqueId: viewBoutiqueId, views } = action.payload;
      
      const updateViewsInList = (list) => {
        if (!list || !Array.isArray(list)) return list;
        return list.map(b => {
          if (b && b._id === viewBoutiqueId) {
            return { ...b, views: views };
          }
          return b;
        });
      };
      
      return {
        ...state,
        boutiques: updateViewsInList(state.boutiques),
        userBoutiques: updateViewsInList(state.userBoutiques),
        homeBoutiques: updateViewsInList(state.homeBoutiques),
        currentBoutique: state.currentBoutique && state.currentBoutique._id === viewBoutiqueId
          ? { ...state.currentBoutique, views: views }
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain && state.boutiqueByDomain._id === viewBoutiqueId
          ? { ...state.boutiqueByDomain, views: views }
          : state.boutiqueByDomain
      };
    
    // ============ GET BOUTIQUES BY CATEGORY ============
    case BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY: {
      const {
        categoryPath,
        boutiques = [],
        total = 0,
        page = 1,
        totalPages = 1,
        hasMore = false,
        categoryInfo = null,
        children = [],
        filterMetadata = null
      } = action.payload;

      const existingData = state.boutiquesByCategory[categoryPath];
      const existingBoutiques = existingData?.boutiques || [];
      const updatedBoutiquesCat = page === 1 ? boutiques : [...existingBoutiques, ...boutiques];

      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [categoryPath]: {
            boutiques: updatedBoutiquesCat,
            total,
            page,
            totalPages,
            hasMore,
            categoryInfo,
            children,
            filterMetadata
          }
        },
        error: null
      };
    }

    // ============ CREATE BOUTIQUE ============
    case BOUTIQUE_TYPES.CREATE_BOUTIQUE:
      const newBoutique = action.payload;

      const categoryPathNew = newBoutique.subCategorySlug
        ? `${newBoutique.categorySlug}/${newBoutique.subCategorySlug}`
        : newBoutique.categorySlug;

      const existingCategoryData = state.boutiquesByCategory[categoryPathNew] || {
        boutiques: [],
        total: 0,
        page: 1,
        totalPages: 1,
        hasMore: true,
        categoryInfo: null,
        children: [],
        filterMetadata: null
      };

      return {
        ...state,
        boutiques: [newBoutique, ...state.boutiques],
        userBoutiques: [newBoutique, ...state.userBoutiques],
        homeBoutiques: [newBoutique, ...state.homeBoutiques],
        total: state.total + 1,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [categoryPathNew]: {
            ...existingCategoryData,
            boutiques: [newBoutique, ...existingCategoryData.boutiques],
            total: existingCategoryData.total + 1
          }
        },
        error: null
      };

    // ============ GET BOUTIQUES ============
    case BOUTIQUE_TYPES.GET_BOUTIQUES:
      return {
        ...state,
        boutiques: action.payload.boutiques || [],
        total: action.payload.total || 0,
        page: action.payload.page || 1,
        totalPages: action.payload.totalPages || 1,
        error: null
      };

    // ============ GET BOUTIQUE ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE:
      return { ...state, currentBoutique: action.payload, error: null };

    case BOUTIQUE_TYPES.GET_BOUTIQUE_BY_DOMAIN:
      return { ...state, boutiqueByDomain: action.payload, error: null };

    case BOUTIQUE_TYPES.GET_USER_BOUTIQUES:
      return { ...state, userBoutiques: action.payload || [], error: null };

    // ============ UPDATE BOUTIQUE HEADER IMAGES ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_HEADER_IMAGES:
      const { boutiqueId, header_images } = action.payload;

      const updateHeaderImagesInBoutique = (boutique) => {
        if (!boutique) return boutique;
        if (boutique._id === boutiqueId) {
          return { ...boutique, header_images: header_images };
        }
        return boutique;
      };

      const updatedBoutiques = state.boutiques.map(updateHeaderImagesInBoutique);
      const updatedUserBoutiques = state.userBoutiques.map(updateHeaderImagesInBoutique);
      const updatedHomeBoutiques = state.homeBoutiques.map(updateHeaderImagesInBoutique);

      const updatedBoutiquesByCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updatedBoutiquesByCategory[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(updateHeaderImagesInBoutique)
          };
        }
      });

      return {
        ...state,
        boutiques: updatedBoutiques,
        userBoutiques: updatedUserBoutiques,
        homeBoutiques: updatedHomeBoutiques,
        currentBoutique: updateHeaderImagesInBoutique(state.currentBoutique),
        boutiqueByDomain: updateHeaderImagesInBoutique(state.boutiqueByDomain),
        boutiquesByCategory: updatedBoutiquesByCategory,
        error: null
      };

    // ============ UPDATE BOUTIQUE ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE:
      const updatedBoutique = action.payload;

      const updatedBoutiquesList = state.boutiques.map(b => b._id === updatedBoutique._id ? updatedBoutique : b);
      const updatedUserBoutiquesList = state.userBoutiques.map(b => b._id === updatedBoutique._id ? updatedBoutique : b);
      const updatedHomeBoutiquesList = state.homeBoutiques.map(b => b._id === updatedBoutique._id ? updatedBoutique : b);

      const updatedBoutiquesByCategoryUpdate = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updatedBoutiquesByCategoryUpdate[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(b => b._id === updatedBoutique._id ? updatedBoutique : b)
          };
        }
      });

      return {
        ...state,
        boutiques: updatedBoutiquesList,
        userBoutiques: updatedUserBoutiquesList,
        homeBoutiques: updatedHomeBoutiquesList,
        currentBoutique: state.currentBoutique?._id === updatedBoutique._id ? updatedBoutique : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === updatedBoutique._id ? updatedBoutique : state.boutiqueByDomain,
        boutiquesByCategory: updatedBoutiquesByCategoryUpdate,
        error: null
      };

    // ============ DELETE BOUTIQUE ============
    case BOUTIQUE_TYPES.DELETE_BOUTIQUE:
      const deletedId = action.payload;
      const deletedFromCategory = {};

      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          const filteredBoutiques = categoryData.boutiques.filter(b => b._id !== deletedId);
          deletedFromCategory[key] = {
            ...categoryData,
            boutiques: filteredBoutiques,
            total: Math.max(0, categoryData.total - (categoryData.boutiques.length - filteredBoutiques.length))
          };
        }
      });

      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== deletedId),
        userBoutiques: state.userBoutiques.filter(b => b._id !== deletedId),
        homeBoutiques: state.homeBoutiques.filter(b => b._id !== deletedId),
        adminBoutiques: state.adminBoutiques.filter(b => b._id !== deletedId),
        adminPendientes: state.adminPendientes.filter(b => b._id !== deletedId),
        currentBoutique: state.currentBoutique?._id === deletedId ? null : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === deletedId ? null : state.boutiqueByDomain,
        boutiquesByCategory: deletedFromCategory,
        total: Math.max(0, state.total - 1),
        error: null
      };

    // ============ UPDATE BOUTIQUE STATUS ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS:
      const { id, status, isActive } = action.payload;
      const newStatus = status !== undefined ? status : isActive;

      const updateStatusInList = list => list.map(b => b._id === id ? { ...b, isActive: newStatus } : b);

      const updateStatusInCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updateStatusInCategory[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(b => b._id === id ? { ...b, isActive: newStatus } : b)
          };
        }
      });

      return {
        ...state,
        boutiques: updateStatusInList(state.boutiques),
        userBoutiques: updateStatusInList(state.userBoutiques),
        homeBoutiques: updateStatusInList(state.homeBoutiques),
        adminBoutiques: updateStatusInList(state.adminBoutiques),
        boutiquesByCategory: updateStatusInCategory,
        currentBoutique: state.currentBoutique?._id === id ? { ...state.currentBoutique, isActive: newStatus } : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === id ? { ...state.boutiqueByDomain, isActive: newStatus } : state.boutiqueByDomain,
        error: null
      };

    // ============ GET BOUTIQUE STATS ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_STATS:
      const { boutiqueId: statsBoutiqueId, stats } = action.payload;
      return {
        ...state,
        boutiqueStats: {
          ...state.boutiqueStats,
          [statsBoutiqueId]: stats
        },
        error: null
      };

    // ============ FOLLOW BOUTIQUE ============
    case BOUTIQUE_TYPES.FOLLOW_BOUTIQUE:
      const { boutiqueId: followId, following, followersCount } = action.payload;

      const updateFollowInList = (list) => list.map(b =>
        b._id === followId
          ? {
              ...b,
              stats: { ...b.stats, followersCount },
              isFollowing: following
            }
          : b
      );

      return {
        ...state,
        boutiques: updateFollowInList(state.boutiques),
        userBoutiques: updateFollowInList(state.userBoutiques),
        homeBoutiques: updateFollowInList(state.homeBoutiques),
        currentBoutique: state.currentBoutique?._id === followId
          ? {
              ...state.currentBoutique,
              stats: { ...state.currentBoutique.stats, followersCount },
              isFollowing: following
            }
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === followId
          ? {
              ...state.boutiqueByDomain,
              stats: { ...state.boutiqueByDomain.stats, followersCount },
              isFollowing: following
            }
          : state.boutiqueByDomain,
        boutiquesByCategory: Object.keys(state.boutiquesByCategory).reduce((acc, key) => {
          acc[key] = {
            ...state.boutiquesByCategory[key],
            boutiques: updateFollowInList(state.boutiquesByCategory[key].boutiques)
          };
          return acc;
        }, {})
      };

    // ============ LIKE BOUTIQUE ============
    case BOUTIQUE_TYPES.LIKE_BOUTIQUE:
      const { boutiqueId: likeId, liked, likesCount } = action.payload;

      const updateLikeInList = (list) => list.map(b =>
        b._id === likeId
          ? {
              ...b,
              stats: { ...b.stats, likesCount },
              isLiked: liked
            }
          : b
      );

      return {
        ...state,
        boutiques: updateLikeInList(state.boutiques),
        userBoutiques: updateLikeInList(state.userBoutiques),
        homeBoutiques: updateLikeInList(state.homeBoutiques),
        currentBoutique: state.currentBoutique?._id === likeId
          ? {
              ...state.currentBoutique,
              stats: { ...state.currentBoutique.stats, likesCount },
              isLiked: liked
            }
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === likeId
          ? {
              ...state.boutiqueByDomain,
              stats: { ...state.boutiqueByDomain.stats, likesCount },
              isLiked: liked
            }
          : state.boutiqueByDomain,
        boutiquesByCategory: Object.keys(state.boutiquesByCategory).reduce((acc, key) => {
          acc[key] = {
            ...state.boutiquesByCategory[key],
            boutiques: updateLikeInList(state.boutiquesByCategory[key].boutiques)
          };
          return acc;
        }, {})
      };

    // ============ GET BOUTIQUE LIKES ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_LIKES:
      const { boutiqueId: likesBoutiqueId, likesCount: newLikesCount, userLiked } = action.payload;

      const updateLikesInList = (list) => list.map(b =>
        b._id === likesBoutiqueId
          ? {
              ...b,
              stats: { ...b.stats, likesCount: newLikesCount },
              isLiked: userLiked
            }
          : b
      );

      return {
        ...state,
        boutiques: updateLikesInList(state.boutiques),
        currentBoutique: state.currentBoutique?._id === likesBoutiqueId
          ? {
              ...state.currentBoutique,
              stats: { ...state.currentBoutique.stats, likesCount: newLikesCount },
              isLiked: userLiked
            }
          : state.currentBoutique,
        boutiqueStats: {
          ...state.boutiqueStats,
          [likesBoutiqueId]: {
            ...state.boutiqueStats[likesBoutiqueId],
            likesCount: newLikesCount
          }
        }
      };

    // ============ GET BOUTIQUE FOLLOWERS ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_FOLLOWERS:
      const { boutiqueId: followersBoutiqueId, followersCount: newFollowersCount, userFollowing } = action.payload;

      const updateFollowersInList = (list) => list.map(b =>
        b._id === followersBoutiqueId
          ? {
              ...b,
              stats: { ...b.stats, followersCount: newFollowersCount },
              isFollowing: userFollowing
            }
          : b
      );

      return {
        ...state,
        boutiques: updateFollowersInList(state.boutiques),
        currentBoutique: state.currentBoutique?._id === followersBoutiqueId
          ? {
              ...state.currentBoutique,
              stats: { ...state.currentBoutique.stats, followersCount: newFollowersCount },
              isFollowing: userFollowing
            }
          : state.currentBoutique,
        boutiqueStats: {
          ...state.boutiqueStats,
          [followersBoutiqueId]: {
            ...state.boutiqueStats[followersBoutiqueId],
            followersCount: newFollowersCount
          }
        }
      };

    // ============ ADMIN ACTIONS ============
    
    case BOUTIQUE_TYPES.LOADING_ADMIN_BOUTIQUES:
      return { ...state, loadingAdmin: action.payload };
    
    case BOUTIQUE_TYPES.GET_ADMIN_BOUTIQUES: {
      const { boutiques = [], total = 0, page = 1, totalPages = 1, hasMore = false, isSearching = false } = action.payload;
      
      const updatedAdminBoutiques = (page === 1 || isSearching) 
        ? boutiques 
        : [...state.adminBoutiques, ...boutiques];
      
      return {
        ...state,
        adminBoutiques: updatedAdminBoutiques,
        adminTotal: total,
        adminPage: page,
        adminTotalPages: totalPages,
        adminHasMore: hasMore,
        loadingAdmin: false
      };
    }
    
    case BOUTIQUE_TYPES.GET_ADMIN_BOUTIQUES_PENDIENTES: {
      const { boutiques: pendientes = [], total: pendTotal = 0, page: pendPage = 1, totalPages: pendTotalPages = 1, hasMore: pendHasMore = false } = action.payload;
      
      const updatedPendientes = pendPage === 1 ? pendientes : [...state.adminPendientes, ...pendientes];
      
      return {
        ...state,
        adminPendientes: updatedPendientes,
        adminTotal: pendTotal,
        adminPage: pendPage,
        adminTotalPages: pendTotalPages,
        adminHasMore: pendHasMore,
        loadingAdmin: false
      };
    }
    
    case BOUTIQUE_TYPES.APPROVE_BOUTIQUE:
      return {
        ...state,
        adminPendientes: state.adminPendientes.filter(b => b._id !== action.payload)
      };
    
    case BOUTIQUE_TYPES.REJECT_BOUTIQUE:
      return {
        ...state,
        adminPendientes: state.adminPendientes.filter(b => b._id !== action.payload)
      };
    
    case BOUTIQUE_TYPES.UPDATE_ADMIN_BOUTIQUE_STATUS: {
      const { id: statusId, isActive: statusIsActive } = action.payload;
      
      const updateAdminStatusInList = (list) => 
        list.map(b => b._id === statusId ? { ...b, isActive: statusIsActive } : b);
      
      return {
        ...state,
        adminBoutiques: updateAdminStatusInList(state.adminBoutiques),
        adminPendientes: updateAdminStatusInList(state.adminPendientes)
      };
    }
    
    case BOUTIQUE_TYPES.CLEAR_ADMIN_BOUTIQUES:
      return {
        ...state,
        adminBoutiques: [],
        adminPendientes: [],
        adminTotal: 0,
        adminPage: 1,
        adminTotalPages: 1,
        adminHasMore: false,
        loadingAdmin: false
      };

    // ============ CLEAR OPERATIONS ============
    case 'CLEAR_BOUTIQUES':
      return { ...initialState };

    case 'CLEAR_CURRENT_BOUTIQUE':
      return { ...state, currentBoutique: null, boutiqueByDomain: null };

    case 'CLEAR_BOUTIQUES_BY_CATEGORY':
      const { categoryPath: clearCategoryPath } = action.payload;
      const newBoutiquesByCategory = { ...state.boutiquesByCategory };
      delete newBoutiquesByCategory[clearCategoryPath];
      return { ...state, boutiquesByCategory: newBoutiquesByCategory };

    case 'RESET_BOUTIQUE_CATEGORY':
      const { categoryPath: resetCategoryPath } = action.payload;
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [resetCategoryPath]: {
            boutiques: [],
            total: 0,
            page: 1,
            totalPages: 1,
            hasMore: false,
            categoryInfo: null,
            children: [],
            filterMetadata: null
          }
        },
        loadingByCategory: {
          ...state.loadingByCategory,
          [resetCategoryPath]: false
        }
      };

    // ============ ERROR HANDLING ============
    case 'BOUTIQUE_ERROR':
      return { ...state, error: action.payload, loading: false, loadingByCategory: {} };
// ============ ACTIVATE PAID BOUTIQUE ============
case BOUTIQUE_TYPES.ACTIVATE_PAID_BOUTIQUE:
  const { id: activateId, isActive: activateStatus } = action.payload;
  
  const updateActivateInList = (list) => list.map(b =>
    b._id === activateId ? { ...b, isActive: activateStatus } : b
  );
  
  return {
    ...state,
    boutiques: updateActivateInList(state.boutiques),
    userBoutiques: updateActivateInList(state.userBoutiques),
    homeBoutiques: updateActivateInList(state.homeBoutiques),
    adminBoutiques: updateActivateInList(state.adminBoutiques),
    currentBoutique: state.currentBoutique?._id === activateId
      ? { ...state.currentBoutique, isActive: activateStatus }
      : state.currentBoutique,
    boutiqueByDomain: state.boutiqueByDomain?._id === activateId
      ? { ...state.boutiqueByDomain, isActive: activateStatus }
      : state.boutiqueByDomain,
    error: null
  };


    default:
      return state;
  }
};

export default boutiqueReducer;