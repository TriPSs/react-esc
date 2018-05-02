// ========================================================
// Default Configuration
// ========================================================
const env = process.env.NODE_ENV || 'development'

export default {

  env,

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
    mode   : 'production',
    devTool: 'source-map',

    loaders: [],
    plugins: [],

    globals: {
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },

      NODE_ENV: env,
      __DEV__ : env === 'development',
      __PROD__: env === 'production',
      __TEST__: env === 'test',
    },
  },

  utils: {
    // This one can be generated using the buildPaths util
    paths: {},
  },

}
