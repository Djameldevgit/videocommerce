// redux/reducers/userReducer.js - VERSIÓN COMPLETA OPTIMIZADA

import { USER_TYPES } from '../actions/userAction';

const initialState = {
    // Usuarios normales
    loading: false,
    users: [],
    result: 0,
    page: 1,
    error: null,
    
    // Usuarios bloqueados (para admin)
    blockedUsers: [],
    blockedResult: 0,
    blockedPage: 1,
    loadingBlocked: false,
    
    // Comentarios admin
    adminComments: {}
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        // ============ USUARIOS NORMALES ============
        case USER_TYPES.LOADING_USERS:
            return { ...state, loading: action.payload };

        case USER_TYPES.GET_USERS:
            console.log('📥 GET_USERS recibido:', {
                usersCount: action.payload.users?.length || 0,
                firstUser: action.payload.users?.[0] ? {
                    username: action.payload.users[0].username,
                    channelPlan: action.payload.users[0].channelPlan,
                    channelPlanExpiresAt: action.payload.users[0].channelPlanExpiresAt,
                    isBlocked: action.payload.users[0].isBlocked,
                    isActive: action.payload.users[0].isActive,
                    isPro: action.payload.users[0].isPro,
                    proExpiryDate: action.payload.users[0].proExpiryDate
                } : null
            });
            return {
                ...state,
                users: action.payload.users || [],
                result: action.payload.result || 0,
                page: action.payload.page || 1,
                loading: false
            };

        // ============ ACTUALIZACIÓN DE USUARIO (UNIFICADA) ============
        case USER_TYPES.UPDATE_USER:
            console.log('🔄 UPDATE_USER recibido:', {
                userId: action.payload._id,
                username: action.payload.username,
                channelPlan: action.payload.channelPlan,
                channelPlanExpiresAt: action.payload.channelPlanExpiresAt,
                isPro: action.payload.isPro,
                isVerified: action.payload.isVerified,
                isActive: action.payload.isActive,
                isBlocked: action.payload.isBlocked
            });
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id 
                        ? { ...user, ...action.payload } 
                        : user
                )
            };

        case USER_TYPES.UPDATE_USER_VERIFICATION:
            return {
                ...state,
                users: state.users.map(u =>
                    u._id === action.payload._id 
                        ? { ...u, isVerified: action.payload.isVerified } 
                        : u
                ),
            };

        case USER_TYPES.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(u => u._id !== action.payload),
                result: state.result - 1
            };

        // ============ ACTIVAR/DESACTIVAR USUARIO ============
        case USER_TYPES.ACTIVATE_USER:
            console.log('🟢 ACTIVATE_USER recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { ...user, isActive: true }
                        : user
                )
            };

        case USER_TYPES.DEACTIVATE_USER:
            console.log('🔴 DEACTIVATE_USER recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { ...user, isActive: false }
                        : user
                )
            };

        case USER_TYPES.TOGGLE_ACTIVE_STATUS:
            console.log('🔄 TOGGLE_ACTIVE_STATUS recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { ...user, isActive: action.payload.isActive }
                        : user
                )
            };

        // ============ BLOQUEO/DESBLOQUEO USUARIO ============
        case USER_TYPES.BLOCK_USER:
            console.log('🔵 BLOCK_USER recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { 
                            ...user, 
                            isBlocked: true,
                            isActive: false,
                            blockDetails: action.payload.blockDetails || {
                                reason: action.payload.reason,
                                description: action.payload.description,
                                blockExpiryDate: action.payload.blockExpiryDate,
                                blockDate: action.payload.blockDate || new Date(),
                                blockedBy: action.payload.blockedBy
                            }
                          }
                        : user
                ),
                blockedUsers: state.blockedUsers.some(u => u._id === action.payload._id)
                    ? state.blockedUsers.map(user =>
                        user._id === action.payload._id
                            ? { ...user, isBlocked: true, ...action.payload }
                            : user
                      )
                    : [...state.blockedUsers, action.payload]
            };

        case USER_TYPES.UNBLOCK_USER:
            console.log('🟢 UNBLOCK_USER recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { 
                            ...user, 
                            isBlocked: false,
                            isActive: true,
                            blockDetails: null
                          }
                        : user
                ),
                blockedUsers: state.blockedUsers.filter(
                    user => user._id !== action.payload._id
                )
            };

        // ============ USUARIO PRO (LEGACY) ============
        case USER_TYPES.ACTIVATE_PRO:
            console.log('⭐ ACTIVATE_PRO recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { 
                            ...user, 
                            isPro: true,
                            proExpiryDate: action.payload.proExpiryDate || null,
                            // También actualizar channelPlan para mantener consistencia
                            channelPlan: action.payload.proExpiryDate ? 'pro' : user.channelPlan,
                            channelPlanExpiresAt: action.payload.proExpiryDate || user.channelPlanExpiresAt
                          }
                        : user
                )
            };

        case USER_TYPES.DEACTIVATE_PRO:
            console.log('🚫 DEACTIVATE_PRO recibido:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload._id
                        ? { 
                            ...user, 
                            isPro: false,
                            proExpiryDate: null,
                            // No cambiar channelPlan automáticamente, solo si estaba en pro
                            channelPlan: user.channelPlan === 'pro' ? 'free' : user.channelPlan,
                            channelPlanExpiresAt: user.channelPlan === 'pro' ? null : user.channelPlanExpiresAt
                          }
                        : user
                )
            };

        // ============ CHANNEL PLAN (NUEVO SISTEMA) ============
        case USER_TYPES.UPDATE_USER_PLAN:
            console.log('📦 UPDATE_USER_PLAN iniciado:', action.payload);
            return {
                ...state,
                loading: true
            };

        case USER_TYPES.UPDATE_USER_PLAN_SUCCESS:
            console.log('✅ UPDATE_USER_PLAN_SUCCESS:', action.payload);
            return {
                ...state,
                users: state.users.map(user =>
                    user._id === action.payload.userId
                        ? { 
                            ...user, 
                            channelPlan: action.payload.plan,
                            channelPlanExpiresAt: action.payload.expiresAt,
                            isPro: (action.payload.plan === 'pro' || action.payload.plan === 'business'),
                            // Actualizar proExpiryDate para compatibilidad legacy
                            proExpiryDate: action.payload.expiresAt || null
                          }
                        : user
                ),
                loading: false
            };

        case USER_TYPES.UPDATE_USER_PLAN_FAIL:
            console.log('❌ UPDATE_USER_PLAN_FAIL:', action.payload);
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        // ============ USUARIOS BLOQUEADOS (para admin) ============
        case USER_TYPES.LOADING_BLOCKED_USERS:
            return { ...state, loadingBlocked: action.payload };

        case USER_TYPES.GET_BLOCKED_USERS:
            console.log('📥 GET_BLOCKED_USERS recibido:', {
                blockedUsersCount: action.payload.blockedUsers?.length || 0,
                page: action.payload.page
            });
            return {
                ...state,
                blockedUsers: action.payload.page === 1
                    ? action.payload.blockedUsers
                    : [...state.blockedUsers, ...action.payload.blockedUsers],
                blockedResult: action.payload.result || 0,
                blockedPage: action.payload.page || 1,
                loadingBlocked: false
            };

        // ============ COMENTARIOS ADMIN ============
        case USER_TYPES.GET_ADMIN_COMMENTS:
            return {
                ...state,
                adminComments: {
                    ...state.adminComments,
                    [action.payload.adminUserId]: action.payload.comments
                }
            };

        case USER_TYPES.ADD_ADMIN_COMMENT:
            return {
                ...state,
                adminComments: {
                    ...state.adminComments,
                    [action.payload.blogAuthor]: [
                        action.payload,
                        ...(state.adminComments[action.payload.blogAuthor] || [])
                    ]
                }
            };

        // ============ RESET / LIMPIAR ERRORES ============
        case USER_TYPES.CLEAR_USER_ERROR:
            return {
                ...state,
                error: null
            };

        case USER_TYPES.RESET_USERS:
            return {
                ...initialState
            };

        default:
            return state;
    }
};

export default userReducer;