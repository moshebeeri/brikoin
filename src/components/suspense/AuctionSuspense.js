import React, { PureComponent } from "react";
// import App from './App'
const Auctions = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../investing/investingAuctions")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class AuctionsSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Auctions
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
