import React, { PureComponent } from "react";
// import App from './App'
const UserLedgers = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../userLedger/userLedger")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class UserLedgersSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <UserLedgers
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
