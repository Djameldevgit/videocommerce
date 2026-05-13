// redux/actions/videoModeAction.js
export const SET_VIDEO_MODE = 'SET_VIDEO_MODE';

export const setVideoMode = (mode) => ({
  type: SET_VIDEO_MODE,
  payload: mode
});