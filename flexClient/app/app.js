import React, { Component } from "react";

import { render } from "react-dom";
import "./styles/styles.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./home";

let dom = document.getElementById("app");
render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div>
      <Provider store={store}>
        <Home />
      </Provider>
    </div>
  </MuiThemeProvider>,
  dom
);
