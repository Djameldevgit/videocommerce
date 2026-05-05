// redux/reducers/userVideoReducer.js (CREAR NUEVO ARCHIVO)

import { USER_VIDEO_TYPES } from '../actions/userVideoAction';

const initialState = {
  loading: false,
  profile: null,
  videos: [],
  savedVideos: [],
  likedVideos: [],
  activeTab: 'videos', // 'videos', 'saved', 'liked'
  
  // Videos del usuario
  userVideosTotal: 0,
  userVideosPage: 1,
  userVideosHasMore: true,
  
  // Videos guardados
  savedVideosTotal: 0,
  savedVideosPage: 1,
  savedVideosHasMore: true,
  
  // Videos liked
  likedVideosTotal: 0,
  likedVideosPage: 1,
  likedVideosHasMore: true
};

const userVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_VIDEO_TYPES.LOADING:
      return { ...state, loading: action.payload };
      
    case USER_VIDEO_TYPES.GET_USER_PROFILE:
      return { ...state, profile: action.payload };
      
    case USER_VIDEO_TYPES.GET_USER_VIDEOS:
      return {
        ...state,
        videos: action.payload.page === 1 
          ? action.payload.videos 
          : [...state.videos, ...action.payload.videos],
        userVideosTotal: action.payload.total,
        userVideosPage: action.payload.page,
        userVideosHasMore: action.payload.hasMore
      };
      case USER_VIDEO_TYPES.FOLLOW_USER:
  return {
    ...state,
    profile: state.profile ? {
      ...state.profile,
      isFollowing: action.payload.isFollowing,
      followersCount: action.payload.followersCount
    } : null
  };
    case USER_VIDEO_TYPES.GET_SAVED_VIDEOS:
      return {
        ...state,
        savedVideos: action.payload.page === 1 
          ? action.payload.videos 
          : [...state.savedVideos, ...action.payload.videos],
        savedVideosTotal: action.payload.total,
        savedVideosPage: action.payload.page,
        savedVideosHasMore: action.payload.hasMore
      };
      
    case USER_VIDEO_TYPES.GET_LIKED_VIDEOS:
      return {
        ...state,
        likedVideos: action.payload.page === 1 
          ? action.payload.videos 
          : [...state.likedVideos, ...action.payload.videos],
        likedVideosTotal: action.payload.total,
        likedVideosPage: action.payload.page,
        likedVideosHasMore: action.payload.hasMore
      };
      
    case USER_VIDEO_TYPES.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
      
    case USER_VIDEO_TYPES.FOLLOW_USER:
      return {
        ...state,
        profile: state.profile ? {
          ...state.profile,
          isFollowing: action.payload.isFollowing,
          followersCount: action.payload.followersCount
        } : null
      };
      
    case USER_VIDEO_TYPES.SAVE_VIDEO:
      // Actualizar el estado del video guardado en la lista actual
      const updateVideoList = (videos) => 
        videos.map(v => 
          v._id === action.payload.videoId 
            ? { ...v, isSaved: action.payload.isSaved }
            : v
        );
      
      return {
        ...state,
        videos: updateVideoList(state.videos),
        savedVideos: updateVideoList(state.savedVideos),
        likedVideos: updateVideoList(state.likedVideos)
      };
      
    case USER_VIDEO_TYPES.CLEAR_USER_VIDEO_STATE:
      return initialState;
      
    default:
      return state;
  }
};

export default userVideoReducer;