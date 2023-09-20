import React, { PureComponent } from "react";
// import App from './App'
const Footer = React.lazy(() =>
  import(/* webpackChunkName: "start" */ "../footer/footer")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class FooterSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Footer
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
