import React, {PureComponent} from 'react'
// import App from './App'
const ProjectBuyers = React.lazy(() => import(/* webpackChunkName: "operation" */ "../operationManagement/projectBuyers"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class LoginSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <ProjectBuyers history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}