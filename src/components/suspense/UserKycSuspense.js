import React, { PureComponent } from "react";
// import App from './App'
const UserKyc = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../investing/userKyc")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class UserKycSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <UserKyc
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
