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
    byFolder  : false,
    collection: [],

    logger: {
      enabled: false,
      options: {}
    }
  },

  defaultLayout,
  reducers    : false,
  AppContainer: false,

  loadFile: {
    reducers    : false,
    AppContainer: false
  },

  fallBack: {
    reducers,
    AppContainer
  }
}

export default clientConfig
