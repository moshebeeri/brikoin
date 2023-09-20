import React, { PureComponent } from "react";
// import App from './App'
const MyLoans = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../holdings/MyLoans")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class MyLoansSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <MyLoans
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
