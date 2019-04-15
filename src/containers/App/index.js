import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";

import loadFont from "../../helpers/loadFonts";
import Home from "../Home";
import Contact from "../Contact";
import "normalize.css";

class App extends Component {
  componentDidMount() {
    loadFont("https://fonts.googleapis.com/css?family=Play|Ubuntu:300,400,500");
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/contact" component={Contact} />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);
