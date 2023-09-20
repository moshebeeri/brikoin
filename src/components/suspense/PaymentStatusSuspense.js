import React, {PureComponent} from 'react'
// import App from './App'
const PaymentStatus = React.lazy(() => import(/* webpackChunkName: "operation" */ "../payment/PaymentStatus"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class PaymentStatusSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <PaymentStatus history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}