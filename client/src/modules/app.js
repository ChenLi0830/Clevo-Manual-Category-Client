// Action types
const TOGGLE_LOGIN_MODAL = "TOGGLE_LOGIN_MODAL";
const LOGIN_OPERATOR = "LOGIN_OPERATOR";
const RESET_STATE = "RESET_STATE";

// Action creator
export const toggleModal = () => ({
  type: TOGGLE_LOGIN_MODAL,
});

export const loginOperator = (cellphone)=>({
  type: LOGIN_OPERATOR,
  payload: cellphone,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
const initialState = {
  showModal: false,
  operator: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_LOGIN_MODAL":
      return {...state, showModal: !state.showModal};
    case "LOGIN_OPERATOR":
      return {...state, operator: action.payload};
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




