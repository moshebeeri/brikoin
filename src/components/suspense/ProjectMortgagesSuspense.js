import React, {PureComponent} from 'react'
// import App from './App'
const ProjectMortgages = React.lazy(() => import(/* webpackChunkName: "operation" */ "../investing/projectMortgages"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class ProjectMortgagesSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <ProjectMortgages history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}