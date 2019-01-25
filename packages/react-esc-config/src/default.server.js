import ip from 'ip'

import defaultConfig from './default'

// ========================================================
// Default Configuration For Server
// ========================================================
export default {

  ...defaultConfig,

  devServer: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || ip.address(),
  },

  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || ip.address(),

    entry     : 'server.js',
    output    : 'server.js',
    clientInfo: 'client_info.json',
    serve     : true,

    // Only use the compiled server outside development
    useCompiled: defaultConfig.env !== 'development',

    middlewares: [],
  },

}
