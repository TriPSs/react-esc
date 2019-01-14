/**
 *  Full example of all the settings
 */
module.exports = {

  webpack: {
    loaders: [
      'react-esc-webpack-image',  // Enable react-esc-webpack-image
      'react-esc-webpack-css',    // Enable react-esc-webpack-css
      'react-esc-webpack-scss',   // Enable react-esc-webpack-scss
      'react-esc-webpack-worker', // Enable react-esc-webpack-worker
    ],

    // Globals
    globals: {},
  },

  render: 'react-esc-render-jss', // Render method used

  // server: false, // This disables the server

  server: {
    port: process.env.PORT || 3000,         // Port the server runs on
    host: process.env.HOST || 'localhost',  // Host the server runs on

    serve: true,   // Serve files with node, put this on false when you have nginx / apache serving the files

    middlewares: [
      [
        'package-name',
        {
          // Package options
          foo: 'bar',
        },
        {
          withApp    : false, // Also pass the app as second param: middleware(options, app)
          returnValue: null,  // This middleware returns a certain value that is what app.use needs
          local      : false, // Is package name a relative path?
        },
      ],

      [
        'package-name',
        function (config) {
          // Options can also be an function

          return {
            foo: config.foo,
          }

          return false // Returning false will cancel the loading
        },
      ],

      [
        // Load relative path, must return a array containing multiple middlewares or a function
        './config/custom-middleware',
        null,
        {
          local: true,
        },
      ],
    ],
  },

  store: {
    middleware: {
      byFolder: false, // true, load all midlwares in store/middleware.js / store/middleware/index.js

      collection: [],
    },
  },

  utils: {
    dirs: {
      src   : 'src',
      dist  : 'dist',
      public: 'dist/public',
      server: null,
      client: null,
    },
  },

}
