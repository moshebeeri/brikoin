import React, { PureComponent } from "react";
// import App from './App'
const ApartmentLegalsSeller = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../initialWizard/apartmentLegalSeller"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class ApartmentLegalsSellerSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <ApartmentLegalsSeller
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
