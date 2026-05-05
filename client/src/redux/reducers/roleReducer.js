import { ROLES_TYPES } from '../actions/roleAction';

const initialState = {
  isAdmin: false,
  isModerator: false,
  isuserpro: false,
  lastUpdated: null
};

export const roleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ROLES_TYPES.UPDATE_ROLE:
      return {
        ...state, // 🔑 mantiene el resto del estado
        isAdmin: action.payload.newRole === 'admin',
        isModerator: action.payload.newRole === 'Moderateur',
        isuserpro: action.payload.newRole === 'userpro',
        lastUpdated: Date.now()
      };
    default:
      return state;
  }
};
