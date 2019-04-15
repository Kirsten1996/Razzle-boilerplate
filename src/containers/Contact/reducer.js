const LOAD = "my-app/contact/LOAD";

const initialState = {
  details: 0
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        ...action.payload,
        error: action.payload.error
      };

    // do reducer stuff
    default:
      return state;
  }
}

export function loadContact(details = 100) {
  return {
    type: LOAD,
    payload: { details: details }
  };
}
