import React, {PureComponent} from 'react'
// import App from './App'
const Mortgages = React.lazy(() => import(/* webpackChunkName: "morgages" */ "../mortgages/myMortgages"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class MortgagesSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <Mortgages history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}