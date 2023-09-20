import React, {PureComponent} from 'react'
// import App from './App'
const Selling = React.lazy(() => import(/* webpackChunkName: "operation" */ "../selling/selling"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class SellingSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Selling history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}