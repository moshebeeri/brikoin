import React from "react";
import { Provider } from "react-redux";
import FlexContainer from "./FlexContainer";
import store from "./redux/store";
export default class App extends React.Component {
  render() {
    const { manager } = this.props;
    return (
      <Provider store={store}>
        <FlexContainer manager={manager} />
      </Provider>
    );
  }
}
