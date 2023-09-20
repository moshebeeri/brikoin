import React, { PureComponent } from "react";
// import App from './App'
const OperationManagement = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../operationManagement/operationManagement"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class OperationManagementSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <OperationManagement
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
