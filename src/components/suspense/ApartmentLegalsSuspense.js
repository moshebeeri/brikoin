import React, {PureComponent} from 'react'
// import App from './App'
const ApartmentLegals = React.lazy(() => import(/* webpackChunkName: "operation" */ "../initialWizard/apartmentLegals"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class ApartmentLegalsSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <ApartmentLegals history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}