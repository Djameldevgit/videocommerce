// redux/reducers/videoModeReducer.js - CON LOGS
const initialState = {
  videoPlaybackMode: localStorage.getItem('videoPlaybackMode') || 'live'
};

console.log('🎬 VideoModeReducer inicializado con:', initialState);

const videoModeReducer = (state = initialState, action) => {
  console.log('📥 Action recibida en videoModeReducer:', action.type, action.payload);
  
  switch (action.type) {
    case 'SET_VIDEO_MODE':
      console.log('✅ SET_VIDEO_MODE ejecutado:', action.payload);
      return {
        ...state,
        videoPlaybackMode: action.payload
      };
    default:
      return state;
  }
};

export default videoModeReducer;