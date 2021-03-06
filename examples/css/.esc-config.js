module.exports = {

  webpack: {
    loaders: [
      [
        'react-esc-webpack-css',
        {
          options: {
            // Options for the css loader, will overwrite defaults
          },
          cssNano: {
            enabled: true,
            options: {},
          },
        },
      ],
    ],

    globals   : {}, // Globals
  },

  client: {
    render: null, // Render method used on the client
  },

  server: {
    port: process.env.PORT || 3000,         // Port the server runs on
    host: process.env.HOST || 'localhost',  // Host the server runs on

    serve: true,  // Serve files with node, put this on false when you have nginx / apache serving the files

    render: null, // Render method used on the server
  },

}
