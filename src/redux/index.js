import { combineReducers } from "redux";

import contactReducer from "../containers/Contact/reducer";

const rootReducers = combineReducers({
  contact: contactReducer
});

export default rootReducers;
