import fs from 'fs'
import Koa from 'koa'
import serve from 'koa-static'
import Universal from 'packages/react-esc-old/src/server/middleware/universal'
import cookiesMiddleware from 'universal-cookie-koa'

import deepMerge from 'deepmerge'
import debug from 'debug'

import webpack from 'react-esc-webpack'
import defaultConfig from 'react-esc-config/default.server'
import { buildPaths } from 'react-esc-config/utils'

import { getMiddleware } from './utils'

const log = debug('react-esc:server')

export default class Server {

  config = defaultConfig

  webpackConfig = {
    client: null,
    server: null,
  }

  setup = (config) => {
    this.config = deepMerge(this.config, config)

    this.config.utils.paths = buildPaths(this.config.server.dirs)
  }

  buildApp = async() => {
    const app = new Koa()
    let clientInfo

    // Enable the cookies middleware
    app.use(cookiesMiddleware())

    // Load middlewares
    this.config.server.middlewares.forEach(middleware => app.use(getMiddleware(app, this.config, middleware)))

    if (this.config.env === 'development' && !this.config.server.useCompiled) {
      // Build the compiler config
      const compilerConfig = webpack.buildClientConfig(this.config)
      const compiler = webpack.getCompiler(compilerConfig)

      // Enable webpack-dev and webpack-hot middleware
      const { output: { publicPath } } = compilerConfig

      // Catch the hash of the build in order to use it in the universal middleware
      compiler.plugin('done', (stats) => {
        // Create client info from the fresh build
        clientInfo = {
          assetsByChunkName: {
            app   : `app.${stats.hash}.js`,
            vendor: `vendor.${stats.hash}.js`,
          },
        }
      })

      app.use(webpack.middelwares.devMiddleware(compiler, publicPath, this.config))
      app.use(webpack.middelwares.hmrMiddleware(compiler))

      // Serve static assets from ~/src/static since Webpack is unaware of
      // these files. This middleware doesn't need to be enabled outside
      // of development since this directory will be copied into ~/dist
      // when the application is compiled.
      app.use(serve(this.config.utils.paths.src('static')))

    } else {
      log('Read client info.')
      // Get assets from client_info.json
      fs.readJSON(config.utils_paths.dist(this.config.server.clientInfo), (err, data) => {
        if (err) {
          clientInfo = {}
          log('Failed to read client_data!')
          return
        }

        clientInfo = data
      })
    }

    const serverCompiler = webpack.getCompiler(webpack.buildServerConfig(this.config))
    const universalMiddleware = await webpack.middlewares.universalMiddleware(serverCompiler, this.config)

    app.use(universalMiddleware(() => clientInfo))

    return app
  }

  start = async(app = null, { port = null, host = null } = {}) => {
    if (app === null) {
      app = await this.buildApp()
    }

    if (port === null) {
      ({ port } = this.config.server)
    }

    if (host === null) {
      ({ host } = this.config.server)
    }

    app.listen(port)

    log(`Server is now running at http://${host}:${port}.`)
    log(`Server accessible via localhost:${port} if you are using the project defaults.`)
  }

}
