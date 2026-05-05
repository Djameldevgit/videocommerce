// redux/reducers/authReducer.js
import { GLOBALTYPES } from '../actions/globalTypes';

const initialState = {
  user: null,
  token: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      console.log('🔐 [AUTH_REDUCER] Guardando:', action.payload);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token
      };
    default:
      return state;
  }
};

export default authReducer;