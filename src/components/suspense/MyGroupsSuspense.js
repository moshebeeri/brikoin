import React, { PureComponent } from "react";
// import App from './App'
const MyGroups = React.lazy(() =>
//  import(/* webpackChunkName: "projectsList" */ "../groups/myGroups")
 import(/* webpackChunkName: "groups" */ "../groups/projectGroups")
  // import(/* webpackChunkName: "projectsList" */ "../projects/ProjectsList")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
import PageLaoding from "../../UI/loading/pageLoading";
export default class MyGroupsSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<PageLaoding />}>
        <MyGroups
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
