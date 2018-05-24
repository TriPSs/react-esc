module.exports = {

  webpack: {
    loaders: [
      //  'react-esc-webpack-image',   // Enable react-esc-webpack-image
    ],

    // Globals
    globals: {},
  },

  client: {
    //  render: 'react-esc-render-jss', // Render method used on the client
  },

  server: {
    port: process.env.PORT || 3000,         // Port the server runs on
    host: process.env.HOST || 'localhost',  // Host the server runs on

    serve: true,  // Serve files with node, put this on false when you have nginx / apache serving the files

    // render: 'react-esc-render-jss', // Render method used on the server
  },

}
