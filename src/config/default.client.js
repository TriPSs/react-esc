import defaultLayout from './layout'
import reducers from '../client/store/reducers'
import AppContainer from '../client/containers/AppContainer'

// ========================================================
// Default Configuration For Client
// ========================================================
const clientConfig = {
  // ----------------------------------
  // Middleware Configuration
  // ----------------------------------
  middlewares: {
    byFolder: false,
    collection: []
  },

  defaultLayout,
  reducers,
  AppContainer
}

export default clientConfig
