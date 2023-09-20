import React, { PureComponent } from "react";
// import App from './App'
const Signup = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../signup/signup")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class SignupSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Signup
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
