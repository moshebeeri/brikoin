import React from "react";
import { connect } from "react-redux";
import { listenLedger } from "../../redux/actions/ledger";
import { withCusomeStyle } from "./withCusomeStyle";

export function withUser(WrappedComponent) {
  class User extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { listenLedger: false };
    }
    render() {
      if (!this.props.user) {
        return <div></div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state, props) => ({
    user: state.login.user
  });

  const mapDispatchToProps = {
    listenLedger
  };

  return withCusomeStyle(connect(mapStateToProps, mapDispatchToProps)(User));
}
