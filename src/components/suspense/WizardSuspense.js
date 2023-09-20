import React, { PureComponent } from "react";
// import App from './App'
const Wizard = React.lazy(() =>
  import(/* webpackChunkName: "operation" */ "../wizard/wizard")
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class WizardSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <Wizard
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
