// redux/reducers/profileReducer.js
import { PROFILE_TYPES } from '../actions/profileAction'
import { EditData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    ids: [],
    users: [],
    posts: [],
    // Vistas de perfil
    profileViews: [],
    profileViewsCount: 0,
    profileStats: {
        totalViews: 0,
        weeklyViews: [],
        followersCount: 0,
        followingCount: 0
    },
    viewsLoading: false,
    viewsError: null,
    // 🆕 Videos guardados
    savedVideos: [],
    savedVideosTotal: 0,
    savedVideosPage: 1,
    savedVideosHasMore: false,
    savedStatus: {}, // { videoId: boolean }
    savedVideosLoading: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
            
        case PROFILE_TYPES.GET_USER:
            return {
                ...state,
                users: [...state.users, action.payload],
                profileViewsCount: action.payload.profileViewsCount || state.profileViewsCount,
                // 🆕 Guardar videos guardados del usuario
                savedVideos: action.payload.savedVideos || state.savedVideos,
                savedVideosTotal: action.payload.savedVideosTotal || state.savedVideosTotal
            };
            
        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
            
        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
            
        case PROFILE_TYPES.GET_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            };
            
        case PROFILE_TYPES.GET_POSTS:
            return {
                ...state,
                posts: [...state.posts, action.payload]
            };
            
        case PROFILE_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
            
        // Vistas de perfil
        case PROFILE_TYPES.REGISTER_PROFILE_VIEW:
            return {
                ...state,
                profileViewsCount: action.payload.count || state.profileViewsCount + 1,
                users: state.users.map(user => 
                    user._id === action.payload.userId 
                        ? { ...user, profileViewsCount: (user.profileViewsCount || 0) + 1 }
                        : user
                )
            };
            
        case PROFILE_TYPES.GET_PROFILE_VIEWS:
            return {
                ...state,
                profileViews: action.payload.views || [],
                profileViewsCount: action.payload.count || state.profileViewsCount,
                viewsLoading: action.payload.loading || false,
                viewsError: action.payload.error || null
            };
            
        case PROFILE_TYPES.GET_PROFILE_STATS:
            return {
                ...state,
                profileStats: action.payload || initialState.profileStats
            };
            
        case PROFILE_TYPES.CLEAR_PROFILE_VIEWS:
            return {
                ...state,
                profileViews: [],
                profileViewsCount: 0,
                profileStats: initialState.profileStats,
                viewsLoading: false,
                viewsError: null
            };
            
        // 🆕 SAVE VIDEOS - Guardar video
        case PROFILE_TYPES.SAVE_VIDEO:
            return {
                ...state,
                savedStatus: {
                    ...state.savedStatus,
                    [action.payload.videoId]: true
                },
                savedVideosTotal: state.savedVideosTotal + 1
            };
            
        // 🆕 SAVE VIDEOS - Quitar video guardado
        case PROFILE_TYPES.UNSAVE_VIDEO:
            return {
                ...state,
                savedStatus: {
                    ...state.savedStatus,
                    [action.payload.videoId]: false
                },
                savedVideos: state.savedVideos.filter(v => v._id !== action.payload.videoId),
                savedVideosTotal: Math.max(0, state.savedVideosTotal - 1)
            };
            
        // 🆕 OBTENER VIDEOS GUARDADOS
        case PROFILE_TYPES.GET_SAVED_VIDEOS:
            return {
                ...state,
                savedVideos: action.payload.page === 1 
                    ? action.payload.videos 
                    : [...state.savedVideos, ...action.payload.videos],
                savedVideosTotal: action.payload.total,
                savedVideosPage: action.payload.page,
                savedVideosHasMore: action.payload.hasMore,
                savedVideosLoading: false
            };
            
        // 🆕 VERIFICAR VIDEO GUARDADO
        case PROFILE_TYPES.CHECK_SAVED_VIDEO:
            return {
                ...state,
                savedStatus: {
                    ...state.savedStatus,
                    [action.payload.videoId]: action.payload.saved
                }
            };
            
        default:
            return state;
    }
}

export default profileReducer