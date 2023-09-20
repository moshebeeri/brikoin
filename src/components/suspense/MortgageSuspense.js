import React, {PureComponent} from 'react'
// import App from './App'
const Mortgage = React.lazy(() => import(/* webpackChunkName: "operation" */ "../mortgage/mortgage"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class MortgageSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Mortgage history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}