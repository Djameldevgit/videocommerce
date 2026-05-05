// 📂 redux/reducers/boutiqueProductReducer.js

import { BOUTIQUE_PRODUCT_TYPES } from "../actions/boutiqueProductAction";
 
const initialState = {
  products: {}, // Para productos por boutique
  userProducts: { products: [], total: 0 }, // 🔥 Para productos del usuario logueado
  currentProduct: null,
  feed: {
    products: [],
    page: 1,
    total: 0,
    totalPages: 1,
    hasMore: true,
    loading: false,
    error: null
  },
  loading: false,
  loadingFeed: false,
  loadingProducts: false,
  error: null,
  stats: {},
  lastCreatedProduct: null,
  lastFilters: {}
   
};

const boutiqueProductReducer = (state = initialState, action) => {
  console.log('🔄 [boutiqueProductReducer] Action recibida:', action.type);
  console.log('📦 Payload:', action.payload);
  
  switch (action.type) {
    
    case BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS:
      console.log('📦 LOADING_BOUTIQUE_PRODUCTS:', action.payload);
      return {
        ...state,
        loadingProducts: action.payload
      };

    // 🔥 CASE PARA GET_USER_PRODUCTS - ESTE ES EL QUE FALTA
    case BOUTIQUE_PRODUCT_TYPES.GET_USER_PRODUCTS: {
      console.log('✅ PROCESANDO GET_USER_PRODUCTS');
      const newState = {
        ...state,
        userProducts: {
          products: action.payload.products || [],
          total: action.payload.total || 0
        },
        loadingProducts: false
      };
      console.log('📊 Nuevo userProducts:', newState.userProducts);
      return newState;
    }

    case BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCTS: {
      const { 
        boutiqueId, 
        products = [], 
        total, 
        page, 
        totalPages, 
        hasMore, 
        reset = false 
      } = action.payload;
      
      if (!boutiqueId) return state;
      
      const existing = state.products[boutiqueId] || { products: [], total: 0 };
      const existingProducts = existing.products || [];
      
      const shouldReset = reset || page === 1;
      let newProducts;
      if (shouldReset) {
        newProducts = [...products];
      } else {
        newProducts = [...existingProducts, ...products];
      }
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            products: newProducts,
            total: total || 0,
            page: page || 1,
            totalPages: totalPages || 1,
            hasMore: hasMore !== undefined ? hasMore : (page < totalPages),
            loading: false,
            error: null
          }
        }
      };
    }

    case BOUTIQUE_PRODUCT_TYPES.ADD_BOUTIQUE_PRODUCT: {
      const product = action.payload.product || action.payload;
      const boutiqueId = action.payload.boutiqueId || product?.boutique;
      
      if (!boutiqueId || !product) return state;
      
      const currentProducts = state.products[boutiqueId] || { products: [], total: 0 };
      const exists = currentProducts.products.some(p => p._id === product._id);
      if (exists) return state;
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...currentProducts,
            products: [product, ...currentProducts.products],
            total: (currentProducts.total || 0) + 1
          }
        },
        userProducts: {
          products: [product, ...state.userProducts.products],
          total: state.userProducts.total + 1
        }
      };
    }

    case BOUTIQUE_PRODUCT_TYPES.DELETE_BOUTIQUE_PRODUCT: {
      const { boutiqueId, productId } = action.payload;
      if (!boutiqueId || !productId) return state;
      
      const currentProducts = state.products[boutiqueId] || { products: [], total: 0 };
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...currentProducts,
            products: currentProducts.products.filter(p => p._id !== productId),
            total: Math.max(0, (currentProducts.total || 0) - 1)
          }
        },
        userProducts: {
          products: state.userProducts.products.filter(p => p._id !== productId),
          total: Math.max(0, state.userProducts.total - 1)
        }
      };
    }

    case BOUTIQUE_PRODUCT_TYPES.UPDATE_BOUTIQUE_PRODUCT: {
      const { boutiqueId, product } = action.payload;
      if (!boutiqueId || !product) return state;
      
      const currentProducts = state.products[boutiqueId] || { products: [], total: 0 };
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...currentProducts,
            products: currentProducts.products.map(p => 
              p._id === product._id ? { ...p, ...product } : p
            )
          }
        },
        userProducts: {
          ...state.userProducts,
          products: state.userProducts.products.map(p => 
            p._id === product._id ? { ...p, ...product } : p
          )
        }
      };
    }

    case BOUTIQUE_PRODUCT_TYPES.RESET_BOUTIQUE_PRODUCTS: {
      const { boutiqueId } = action.payload;
      if (!boutiqueId) return state;
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            products: [],
            total: 0,
            page: 1,
            totalPages: 1,
            hasMore: true,
            loading: false,
            error: null
          }
        }
      };
    }
    case BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCT_DETAIL:
      return {
        ...state,
        currentProduct: action.payload,
        loadingProducts: false
      };
    
    // 🔥 NUEVO CASE PARA CLEAR_BOUTIQUE_PRODUCT_DETAIL
    case BOUTIQUE_PRODUCT_TYPES.CLEAR_BOUTIQUE_PRODUCT_DETAIL:
      return {
        ...state,
        currentProduct: null
      };
      case BOUTIQUE_PRODUCT_TYPES.GET_SAME_BOUTIQUE_PRODUCTS:
      return {
        ...state,
        sameBoutiqueProducts: action.payload
      };
    
    case BOUTIQUE_PRODUCT_TYPES.GET_SIMILAR_PRODUCTS:
      return {
        ...state,
        similarProducts: action.payload
      };
 

   


   default:
      return state;
  }

};

export default boutiqueProductReducer;