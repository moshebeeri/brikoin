import React, {PureComponent} from 'react'
// import App from './App'
const PropertyLoader = React.lazy(() => import(/* webpackChunkName: "operation" */ "../propertyUploadWizard/propertyUpload"))
// import App from './App'
import LoadingCircular from '../../UI/loading/LoadingCircular'
export default class PropertyLoaderSuspense extends PureComponent {
    render() {
        return <React.Suspense fallback={<LoadingCircular/>}>
            <PropertyLoader history={this.props.history} match={this.props.match}
                          location={this.props.location} t={this.props.t}/>
        </React.Suspense>
    }
}