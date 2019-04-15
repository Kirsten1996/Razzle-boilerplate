import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";
import { compose, applyMiddleware, createStore } from "redux";
import createHistory from "history/createBrowserHistory";
import rootReducer from "../redux";

export default function configureStore(
  initialState = {},
  history = createHistory()
) {
  const middleware = [
    routerMiddleware(history), // react-router-redux middleware
    thunk
  ];

  const reduxEnhancers = [];

  if (process.env.NODE_ENV === "development") {
    if (typeof window !== "undefined") {
      if (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined") {
        reduxEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
      }
    }
  }

  const reducers = connectRouter(history)(rootReducer);

  const enhancers = compose(
    applyMiddleware(...middleware),
    ...reduxEnhancers
  );

  const store = createStore(reducers, initialState, enhancers);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("../redux", () => {
      const nextRootReducer = require("../redux").default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
