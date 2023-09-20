import React, {PureComponent} from 'react'
// import App from './App'
const SingleView = React.lazy(() => import(/* webpackChunkName: "operation" */ "../projects/SingleView"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class SingleViewSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <SingleView history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}