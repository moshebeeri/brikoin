import React, { PureComponent } from "react";
// import App from './App'
const Funding = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../investing/funding")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class FundingSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Funding
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
