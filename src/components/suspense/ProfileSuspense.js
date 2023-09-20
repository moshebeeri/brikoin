import React, {PureComponent} from 'react'
// import App from './App'
const Profile = React.lazy(() => import(/* webpackChunkName: "operation" */ "../profile/profile"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class ProjectListSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Profile history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}