import React, { PureComponent } from "react";
// import App from './App'
const Home = React.lazy(() =>
  import(/* webpackChunkName: "home" */ "../home/home")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
import PageLaoding from "../../UI/loading/pageLoading";
export default class HomeSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<PageLaoding />}>
        <Home
          history={this.props.history}
          cookies={this.props.cookies}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
