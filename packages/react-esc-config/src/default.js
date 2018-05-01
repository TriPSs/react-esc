// ========================================================
// Default Configuration
// ========================================================
export default {

  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // App mount point config
  // ----------------------------------
  app: {
    mountPoint: {
      id   : 'root',
      style: { height: '100%' },
    },
  },

  // ----------------------------------
  // Store Configuration
  // ----------------------------------
  store: {
    reducersLoc: 'store/reducers',  // Location in the project witch returns all reducers
    enhancers  : [],

    middleware: {
      byFolder  : false,
      collection: [],
    },
  },

  // ----------------------------------
  // Webpack Configuration
  // ----------------------------------
  webpack: {
    loaders: [],
    plugins: [],

    globals: {},
  },

}
