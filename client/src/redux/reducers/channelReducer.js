// redux/reducers/channelReducer.js
import { CHANNEL_TYPES } from '../constants/channelConstants';

const initialState = {
  loading: false,
  channel: null,
  channels: [],
  userChannels: [],
  videos: [],
  totalVideos: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  followers: [],
  followingChannels: [],
  stats: null,
  viewsCount: 0,
  channelFeed: {
    videos: [],
    loading: false,
    page: 1,
    hasMore: true,
    total: 0,
    channelId: null
  },
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNEL_TYPES.CHANNEL_LOADING:
      return { ...state, loading: action.payload };

    // ✅ Manejar creación de canal
    case CHANNEL_TYPES.CREATE_CHANNEL_REQUEST:
      return { ...state, loading: true };
    
    case CHANNEL_TYPES.CREATE_CHANNEL_SUCCESS:
      return { 
        ...state, 
        loading: false,
        userChannels: [action.payload, ...state.userChannels]
      };
    
    case CHANNEL_TYPES.CREATE_CHANNEL_FAIL:
      return { ...state, loading: false };

    case CHANNEL_TYPES.GET_CHANNEL:
      return { ...state, channel: action.payload };

    case CHANNEL_TYPES.GET_USER_CHANNELS:
      return { ...state, userChannels: action.payload };

    case CHANNEL_TYPES.CLEAR_CHANNEL:
      return { ...state, channel: null, videos: [], totalVideos: 0, currentPage: 1, totalPages: 1, hasMore: false, followers: [], stats: null };

    case CHANNEL_TYPES.GET_CHANNEL_VIDEOS:
      return {
        ...state,
        videos: action.payload.page === 1 ? action.payload.videos : [...state.videos, ...action.payload.videos],
        totalVideos: action.payload.total,
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        hasMore: action.payload.hasMore,
      };

    case CHANNEL_TYPES.FOLLOW_CHANNEL:
      if (state.channel?._id === action.payload.channelId) {
        return {
          ...state,
          channel: { ...state.channel, followersCount: action.payload.followersCount, isFollowing: true },
        };
      }
      return state;

    case CHANNEL_TYPES.UNFOLLOW_CHANNEL:
      if (state.channel?._id === action.payload.channelId) {
        return {
          ...state,
          channel: { ...state.channel, followersCount: action.payload.followersCount, isFollowing: false },
        };
      }
      return state;

    case CHANNEL_TYPES.GET_CHANNEL_FOLLOWERS:
      return { ...state, followers: action.payload };

    case CHANNEL_TYPES.GET_USER_FOLLOWING_CHANNELS:
      return { ...state, followingChannels: action.payload };

    case CHANNEL_TYPES.REGISTER_CHANNEL_VIEW:
      return {
        ...state,
        viewsCount: action.payload.count,
        channel: state.channel ? { ...state.channel, profileViewsCount: action.payload.count } : state.channel,
      };

    case CHANNEL_TYPES.CHANNEL_STATS:
      return { ...state, stats: action.payload };

    case CHANNEL_TYPES.UPDATE_CHANNEL:
      if (state.channel?._id === action.payload._id) {
        return { ...state, channel: { ...state.channel, ...action.payload } };
      }
      // También actualizar en userChannels
      if (state.userChannels.length > 0) {
        return {
          ...state,
          userChannels: state.userChannels.map(ch => 
            ch._id === action.payload._id ? { ...ch, ...action.payload } : ch
          )
        };
      }
      return state;
      
    case CHANNEL_TYPES.CHANNEL_FEED_LOADING:
      return { ...state, channelFeed: { ...state.channelFeed, loading: action.payload } };
    
    case CHANNEL_TYPES.GET_CHANNEL_FEED_VIDEOS:
      return {
        ...state,
        channelFeed: {
          videos: action.payload.page === 1 ? action.payload.videos : [...state.channelFeed.videos, ...action.payload.videos],
          page: action.payload.page,
          hasMore: action.payload.hasMore,
          total: action.payload.total,
          channelId: action.payload.channelId,
          loading: false
        }
      };
    
    case CHANNEL_TYPES.CLEAR_CHANNEL_FEED:
      return {
        ...state,
        channelFeed: {
          videos: [],
          loading: false,
          page: 1,
          hasMore: true,
          total: 0,
          channelId: null
        }
      };
      
    case CHANNEL_TYPES.CLEAR_CHANNEL_VIDEOS:
      return {
        ...state,
        videos: [],
        totalVideos: 0,
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      };

    default:
      return state;
  }
};

export default channelReducer;