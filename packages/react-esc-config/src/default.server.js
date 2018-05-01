import ip from 'ip'

import defaultConfig from './default'

// ========================================================
// Default Configuration For Client
// ========================================================
export default {

  ...defaultConfig,

  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || ip.address(),

    serve: true,
  },

}
