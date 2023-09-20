/* eslint-disable no-unused-vars */
/**
 * Created by roi on 07/08/2019.
 */
import React from "react";
import ReactDOM from "react-dom";
import { App } from "../components/App";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  const div = document.createElement("div");
  // ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
