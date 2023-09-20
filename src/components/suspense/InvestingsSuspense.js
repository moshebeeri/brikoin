import React, { PureComponent } from "react";
// import App from './App'
const Investing = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../investing/investing")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class InvestingSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Investing
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
