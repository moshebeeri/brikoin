import React, { PureComponent } from "react";
// import App from './App'
const AppHeader = React.lazy(() =>
  import(/* webpackChunkName: "start" */ "../appHeader/appHeader")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class AppHeaderSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <AppHeader
          history={this.props.history}
          match={this.props.match}
          cookies={this.props.cookies}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
