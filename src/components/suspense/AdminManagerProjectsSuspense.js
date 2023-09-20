import React, { PureComponent } from "react";
// import App from './App'
const AdminManageProjects = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../admin/manageProjects")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class AdminManageProjectsSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <AdminManageProjects
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
