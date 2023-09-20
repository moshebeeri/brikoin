import React, { PureComponent } from "react";
// import App from './App'
const TradeList = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../tradesHome/TradesList")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class TradeListSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <TradeList
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
