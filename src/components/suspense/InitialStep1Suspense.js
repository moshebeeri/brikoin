import React, {PureComponent} from 'react'
// import App from './App'
const InitialStep1 = React.lazy(() => import(/* webpackChunkName: "operation" */ "../initialWizard/initialStep1"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class InitialStep1Suspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <InitialStep1 history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}