import Koa from 'koa'
import serve from 'koa-static'
import webpack from 'webpack'
import generateWebpackConfigClient from '../build/webpack.config.client'
import Universal from './middleware/universal'
import webpackDevHrmMiddleware from './middleware/webpack-dev-hrm'
import fs from 'fs-extra'
import _debug from 'debug'

const debug = _debug('app:esc:server')

export default async (config) => {
  const webpackConfigClient = generateWebpackConfigClient(config)

  const app = new Koa()
  let clientInfo

  // Add the custom middlewares
  if (config.server_middlewares.length > 0) {
    config.server_middlewares.forEach(middleware => app.use(middleware))
  }

  if (config.env === 'development' && !config.use_compiled_server) {
    const compiler = webpack(webpackConfigClient)

    // Enable webpack-dev and webpack-hot middleware
    const { publicPath } = webpackConfigClient.output

    // Catch the hash of the build in order to use it in the universal middleware
    compiler.plugin('done', stats => {
      // Create client info from the fresh build
      clientInfo = {
        assetsByChunkName: {
          app   : `app.${stats.hash}.js`,
          vendor: `vendor.${stats.hash}.js`,
        },
      }
    })

    app.use(webpackDevHrmMiddleware(compiler, publicPath, config))

    // Serve static assets from ~/src/static since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
    app.use(serve(config.utils_paths.src('static')))
  } else {
    debug('Read client info.')
    // Get assets from client_info.json
    fs.readJSON(config.utils_paths.dist(config.universal.client_info), (err, data) => {
      if (err) {
        clientInfo = {}
        debug('Failed to read client_data!')
        return
      }

      clientInfo = data
    })

    if (!config.hasOwn || !config.hasOwn.nginx) {
      app.use(serve(config.utils_paths.public()))
    }
  }

  let um = await new Universal.middleware(config)
  app.use(um(() => clientInfo))

  return app
}
