import React, { PureComponent } from "react";
// import App from './App'
const BankAccount = React.lazy(() =>
  import(
    /* webpackChunkName: "operation" */ "../operationManagement/bankAccount"
  )
);
// import App from './App'
import LoadingCircular from "../../UI/loading/LoadingCircular";
export default class LoginSuspense extends PureComponent {
  render() {
    return (
      <React.Suspense fallback={<LoadingCircular />}>
        <BankAccount
          history={this.props.history}
          match={this.props.match}
          location={this.props.location}
          t={this.props.t}
        />
      </React.Suspense>
    );
  }
}
