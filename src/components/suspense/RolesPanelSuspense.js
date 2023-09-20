import React, { PureComponent } from "react";
// import App from './App'
const RolesPanel = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../profile/rolesPanel")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class RolesPanelSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <RolesPanel
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
