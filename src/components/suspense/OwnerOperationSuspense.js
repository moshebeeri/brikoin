import React, {PureComponent} from 'react'
// import App from './App'
const OwnerProject = React.lazy(() => import(/* webpackChunkName: "operation" */ "../operationManagement/ownerProject"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class LawyerManagementSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <OwnerProject history={this.props.history} match={this.props.match}
                                 location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}