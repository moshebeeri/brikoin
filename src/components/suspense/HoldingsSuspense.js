import React, {PureComponent} from 'react'
// import App from './App'
const Holdings = React.lazy(() => import(/* webpackChunkName: "operation" */ "../holdings/holdingsNew"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class HoldingsSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Holdings history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}