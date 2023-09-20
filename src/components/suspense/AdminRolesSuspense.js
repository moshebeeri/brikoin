import React, { PureComponent } from "react";
// import App from './App'
const AdminManagerRoles = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../admin/managerRoles")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class AdminManagerRolesSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <AdminManagerRoles
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
