import defaultLayout from './layout'
import reducers from '../client/store/reducers'
import AppContainer from '../client/containers/AppContainer'

// ========================================================
// Default Configuration For Client
// ========================================================
const clientConfig = {

  // ----------------------------------
  // Store Configuration
  // ----------------------------------
  custom_enhancers: [],

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
