import React, { PureComponent } from "react";
// import App from './App'
const LawyerManagement = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../operationManagement/operationLawyerManagement"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class LawyerManagementSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <LawyerManagement
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
