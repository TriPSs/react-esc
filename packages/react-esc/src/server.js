import Koa from 'koa'
import cookiesMiddleware from 'universal-cookie-koa'

import deepMerge from 'deepmerge'
import debug from 'debug'

import defaultConfig from 'react-esc-config/default.server'

const log = debug('react-esc:server')

export default class Server {

  config = defaultConfig

  webpackConfig = {
    client: null,
    server: null,
  }

  setup = config => this.config = deepMerge(this.config, config)

/*  setWebpackConfigServer = (config, force = false) => this.setWebpackConfig('server', config, force)

  setWebpackConfigClient = (config, force = false) => this.setWebpackConfig('client', config, force)

  setWebpackConfig = (type, config = {}, force = false) => {
    const generateConfig = type === 'server' ? generateServerConfig : generateClientConfig

    if (force) {
      this.webpackConfig[type] = config

    } else {
      this.webpackConfig[type] = generateConfig(config)
    }
  }*/

  buildApp = () => {
    const app = new Koa()

   /* if (this.webpackConfig.client === null) {
      this.setWebpackConfig('client')
    }

    if (this.webpackConfig.server === null) {
      this.setWebpackConfig('server')
    }*/

    return app
  }

  start = (app = null, { port = null, host = null } = {}) => {
    if (app === null) {
      app = this.buildApp()
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
