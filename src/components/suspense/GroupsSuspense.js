import React, {PureComponent} from 'react'
// import App from './App'
const Groups = React.lazy(() => import(/* webpackChunkName: "operation" */ "../groups/projectGroups"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class GroupsSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Groups history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}