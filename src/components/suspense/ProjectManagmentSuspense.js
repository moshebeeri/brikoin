import React, {PureComponent} from 'react'
// import App from './App'
const ProjectManagement = React.lazy(() => import(/* webpackChunkName: "operation" */ "../admin/ProjectManagement"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class ProjectManagementSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <ProjectManagement history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}