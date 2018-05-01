// ========================================================
// Default Configuration
// ========================================================
export default {

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
    enhancers: [],

    middleware: {
      byFolder  : false,
      collection: [],
    },
  },

}
