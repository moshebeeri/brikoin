import React, {PureComponent} from 'react'
// import App from './App'
const Admin = React.lazy(() => import(/* webpackChunkName: "operation" */ "../admin/admin"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class AdminSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Admin history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}