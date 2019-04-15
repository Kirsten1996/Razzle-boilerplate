import React from "react";
import { hydrate } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import App from "./containers/App/index";
import configureStore from "./config/store";
import createHistory from "history/createBrowserHistory";
import "normalize.css";

const initialState = {};
// const initialState = window.__PRELOADED_STATE__
const store = configureStore(initialState);

const history = createHistory();
history.listen((location, action) => {
  if (action === "PUSH") {
    window.scrollTo(0, 0);
  }
});

hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
