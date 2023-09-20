import React, { PureComponent } from "react";
// import App from './App'
const ProjectsList = React.lazy(() =>
  import(/* webpackChunkName: "projectsList" */ "../projects/ProjectsList")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
import PageLaoding from "../../UI/loading/pageLoading";
export default class ProjectListSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<PageLaoding />}>
        <ProjectsList
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
