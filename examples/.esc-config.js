/**
 *  Full example of all the settings
 */
module.exports = {

  webpack: {
    loaders: [
      'react-esc-webpack-image',  // Enable react-esc-webpack-image
      'react-esc-webpack-css',    // Enable react-esc-webpack-css
      'react-esc-webpack-scss',   // Enable react-esc-webpack-scss
    ],

    // Globals
    globals: {},
  },

  client: {
    render: null, // Render method used on the client
  },

  server: {
    port: process.env.PORT || 3000,         // Port the server runs on
    host: process.env.HOST || 'localhost',  // Host the server runs on

    serve : true,   // Serve files with node, put this on false when you have nginx / apache serving the files
    render: null,   // Render method used on the server
  },

}
