import React, {PureComponent} from 'react'
// import App from './App'
const OperationHub = React.lazy(() => import(/* webpackChunkName: "operation" */ "../operationHub/operationHub"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
import PageLaoding from "../../UI/loading/pageLoading";
export default class OperationHubRolesSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<PageLaoding/>}>
            <OperationHub history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}