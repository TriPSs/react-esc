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

  defaultLayout: 'config/layout',
  reducers     : 'store/reducers'
}

export default clientConfig
