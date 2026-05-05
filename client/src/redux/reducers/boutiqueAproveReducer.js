// redux/reducers/boutiqueAproveReducer.js - VERSIÓN CORREGIDA

// 🔥 CORREGIDO: Importar con el nombre correcto (doble P)
import { BOUTIQUE_APPROVE_TYPES } from "../actions/boutiqueAproveAction";

const initialState = {
  // Boutiques
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 1,
  hasMore: false,
  
  // Productos
  products: [],
  totalProducts: 0,
  pageProducts: 1,
  totalPagesProducts: 1,
  hasMoreProducts: false,
  
  loading: false,
  error: null
};

const boutiqueAproveReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============ LOADING ============
    case BOUTIQUE_APPROVE_TYPES.LOADING:
    case BOUTIQUE_APPROVE_TYPES.LOADING_BOUTIQUES:
      return { ...state, loading: action.payload };
    
    // ============ BOUTIQUES PENDIENTES ============
    case BOUTIQUE_APPROVE_TYPES.GET_BOUTIQUES_PENDIENTES:
      return {
        ...state,
        boutiques: action.payload.boutiques || [],
        total: action.payload.total || 0,
        page: action.payload.page || 1,
        totalPages: action.payload.totalPages || 1,
        hasMore: action.payload.hasMore || false,
        loading: false
      };
    
    // ============ APROBAR BOUTIQUE ============
    case BOUTIQUE_APPROVE_TYPES.APPROVE_BOUTIQUE:
      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== action.payload),
        total: Math.max(0, state.total - 1)
      };
    
    // ============ RECHAZAR BOUTIQUE ============
    case BOUTIQUE_APPROVE_TYPES.REJECT_BOUTIQUE:
      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== action.payload),
        total: Math.max(0, state.total - 1)
      };
    
    // ============ ACTIVAR BOUTIQUE DE PAGO ============
    case BOUTIQUE_APPROVE_TYPES.ACTIVATE_PAID_BOUTIQUE:
      return {
        ...state,
        // No eliminamos la boutique, solo actualizamos su estado
        boutiques: state.boutiques.map(b => 
          b._id === action.payload 
            ? { ...b, isActive: true, pendiente: false }
            : b
        ),
        loading: false
      };
    
    // ============ PRODUCTOS PENDIENTES ============
    case BOUTIQUE_APPROVE_TYPES.GET_PRODUCTS_PENDIENTES:
      return {
        ...state,
        products: action.payload.products || [],
        totalProducts: action.payload.total || 0,
        pageProducts: action.payload.page || 1,
        totalPagesProducts: action.payload.totalPages || 1,
        hasMoreProducts: action.payload.hasMore || false,
        loading: false
      };
    
    // ============ APROBAR PRODUCTO ============
    case BOUTIQUE_APPROVE_TYPES.APROBAR_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload.id),
        totalProducts: Math.max(0, state.totalProducts - 1)
      };
    
    // ============ RECHAZAR PRODUCTO ============
    case BOUTIQUE_APPROVE_TYPES.RECHAZAR_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload.id),
        totalProducts: Math.max(0, state.totalProducts - 1)
      };
    
    // ============ RESET ============
    case BOUTIQUE_APPROVE_TYPES.RESET:
      return initialState;
    
    default:
      return state;
  }
};

export default boutiqueAproveReducer;