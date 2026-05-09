// redux/reducers/channelReducer.js
import { CHANNEL_TYPES } from '../constants/channelConstants';

const initialState = {
  loading: false,
  channel: null,
  channels: [],
  userChannels: [],
  channelVideos: {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false,
  },
  followers: [],
  followingChannels: [],
  stats: null,
  viewsCount: 0,
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNEL_TYPES.CHANNEL_LOADING:
      return { ...state, loading: action.payload };

    case CHANNEL_TYPES.GET_CHANNEL:
      return { ...state, channel: action.payload };

    case CHANNEL_TYPES.GET_USER_CHANNELS:   // ← NUEVO CASE
      return { ...state, userChannels: action.payload };

    case CHANNEL_TYPES.CLEAR_CHANNEL:
      return { ...state, channel: null, channelVideos: initialState.channelVideos, followers: [], stats: null };

    case CHANNEL_TYPES.GET_CHANNEL_VIDEOS:
      return {
        ...state,
        channelVideos: {
          items: action.payload.videos,
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          hasMore: action.payload.hasMore,
        },
      };

    case CHANNEL_TYPES.FOLLOW_CHANNEL:
      if (state.channel && state.channel._id === action.payload.channelId) {
        return {
          ...state,
          channel: { ...state.channel, followersCount: action.payload.followersCount, isFollowing: true },
        };
      }
      return state;

    case CHANNEL_TYPES.UNFOLLOW_CHANNEL:
      if (state.channel && state.channel._id === action.payload.channelId) {
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
      if (state.channel && state.channel._id === action.payload._id) {
        return { ...state, channel: { ...state.channel, ...action.payload } };
      }
      return state;

    default:
      return state;
  }
};

export default channelReducer;