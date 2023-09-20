import React, { PureComponent } from "react";
// import App from './App'
const InitialStep2 = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../initialWizard/initialStep2")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class InitialStep2Suspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <InitialStep2
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
