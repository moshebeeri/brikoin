import React, {PureComponent} from 'react'
// import App from './App'
const AdminApproveRoles = React.lazy(() => import(/* webpackChunkName: "operation" */ "../admin/rolesAdminPanel"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class AdminApproveRolesSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <AdminApproveRoles history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}