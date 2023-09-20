import React, { PureComponent } from "react";
// import App from './App'
const PropertyLoaderList = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../propertyUploadWizard/propertyUploadList"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class PropertyLoaderListSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <PropertyLoaderList
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
