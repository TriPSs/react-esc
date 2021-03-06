module.exports = {

  webpack: {
    loaders: [
      //  'react-esc-webpack-image',   // Enable react-esc-webpack-image
    ],

    // Globals
    globals: {},
  },

  render: 'react-esc-render-jss', // Render method used
  
  server: {
    port: process.env.PORT || 3000,         // Port the server runs on
    host: process.env.HOST || 'localhost',  // Host the server runs on

    serve: true,  // Serve files with node, put this on false when you have nginx / apache serving the files
  },

}
