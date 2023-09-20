import React, { PureComponent } from "react";
// import App from './App'
const ProjectFullDetails = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../projects/ProjectFullDetails")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
import PageLaoding from "../../UI/loading/pageLoading";
export default class ProjectFullDetailsSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<PageLaoding />}>
        <ProjectFullDetails
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
