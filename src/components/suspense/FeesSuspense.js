import React, {PureComponent} from 'react'
// import App from './App'
const Fees = React.lazy(() => import(/* webpackChunkName: "operation" */ '../myFees/myFees'))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class FeesSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Fees history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}