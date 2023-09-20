import React, {PureComponent} from 'react'
// import App from './App'
const Lending = React.lazy(() => import(/* webpackChunkName: "operation" */ "../lending/lending"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class LendingSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Lending history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}