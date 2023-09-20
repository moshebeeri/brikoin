import React, { PureComponent } from "react";
// import App from './App'
const ApartmentBuyers = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../operationManagement/apartmentBuyers"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class ApartmentBuyersSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <ApartmentBuyers
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
