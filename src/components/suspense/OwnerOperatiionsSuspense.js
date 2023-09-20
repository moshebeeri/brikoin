import React, { PureComponent } from "react";
// import App from './App'
const OwnerOperations = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../operationManagement/ownerOperations"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class OwnerOperationsSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <OwnerOperations
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
