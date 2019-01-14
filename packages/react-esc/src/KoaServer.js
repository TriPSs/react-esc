import fs from 'fs-extra'
import Koa from 'koa'
import serve from 'koa-static'
import cookiesMiddleware from 'universal-cookie-koa'

import deepMerge from 'deepmerge'
import debug from 'debug'

import * as webpack from 'react-esc-webpack'
import defaultConfig from 'react-esc-config/default.server'
import { buildPaths } from 'react-esc-config/utils'

import { getMiddleware } from './utils'

const log = debug('react-esc:koa-server')

export default class KoaServer {

  config = defaultConfig

  webpackConfig = {
    client: null,
    server: null,
  }

  setup = (config, cwd = null) => {
    this.config = deepMerge(this.config, config)

    this.config.utils.paths = buildPaths(this.config.utils.dirs, cwd, __dirname)
  }

  /**
   * Builds a app
   *
   * @returns {Promise<module.Application|*>}
   */
  buildApp = async() => {
    const app = new Koa()
    let clientInfo

    // Enable the cookies middleware
    app.use(cookiesMiddleware())

    // Load middlewares
    this.config.server.middlewares.forEach(mw => {
      const middleware = getMiddleware(app, this.config, mw)

      // If we get multiple middlewares then use them all
      if (Array.isArray(middleware)) {
        middleware.forEach(mw => app.use(mw))

      } else {
        app.use(middleware)
      }
    })

    if (this.config.env === 'development' && !this.config.server.useCompiled) {
      // Build the compiler config
      const compilerConfig = webpack.buildClientConfig(this.config)
      const compiler = webpack.buildCompiler(compilerConfig)

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

      const { utils: { paths }, webpack: { quiet, stats } } = this.config
      // TODO:: Format this on webpack package
      const middleware = await webpack.middleware({
        config: {
          dev: {
            publicPath,
            contentBase: paths.src(),
            hot        : true,
            logLevel   : quiet ? 'silent' : 'info',
            lazy       : false,
            headers    : { 'Access-Control-Allow-Origin': '*' },
            stats,
          },
        },
        compiler,
      })

      app.use(middleware)

      // Serve static assets from ~/src/static since Webpack is unaware of
      // these files. This middleware doesn't need to be enabled outside
      // of development since this directory will be copied into ~/dist
      // when the application is compiled.
      app.use(serve(this.config.utils.paths.src('static')))

    } else {
      log('Read client info.')

      // Get assets from client_info.json
      clientInfo = fs.readJsonSync(this.config.utils.paths.dist(this.config.server.clientInfo), { throw: false })

      if (!clientInfo) {
        clientInfo = {}
      }

      // Serve all the statis files if enabled
      if (this.config.server.serve) {
        const servePublic = this.config.utils.paths.public()
        log(`Enabling serving of the static files in "${servePublic}"`)
        app.use(serve(servePublic))
      }
    }

    const universalMiddleware = await webpack.middlewares.universalMiddleware(this.config)

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
  }

}
