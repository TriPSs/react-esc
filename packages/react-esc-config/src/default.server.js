import ip from 'ip'

import defaultConfig from './default'

// ========================================================
// Default Configuration For Server
// ========================================================
export default {

  ...defaultConfig,

  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || ip.address(),

    output    : 'server.js',
    clientInfo: 'client_info.json',
    serve     : true,

    // Only use the compiled server outside development
    useCompiled: defaultConfig.env !== 'development',

    dirs: {
      src   : 'src',
      dist  : 'dist',
      public: 'dist/public',
      server: 'server',
    },
  },

}
