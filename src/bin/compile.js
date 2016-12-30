import fs from 'fs-extra'
import _debug from 'debug'
import webpackCompiler from '../build/webpack-compiler'
import webpackConfigClient from '../build/webpack.config.client'
import webpackConfigServer from '../build/webpack.config.server'
import defaultConfig from '../config'

const debug = _debug('app:bin:compile')

export default class compiler {

  static compile = async(givenConfig) => {
    try {
      const config = defaultConfig(givenConfig)
      const paths = config.utils_paths
      const clientInfo = paths.dist(config.universal.client_info)


      let stats

      debug('Run compiler for client')
      stats = await webpackCompiler(webpackConfigClient(config))
      if (stats.warnings.length && config.compiler_fail_on_warning) {
        debug('Config set to fail on warning, exiting with status code "1".')
        process.exit(1)
      }

      debug('Write client info')
      let {hash, version, assetsByChunkName} = stats
      await new compiler.writeClientInfo({hash, version, assetsByChunkName}, clientInfo)

      debug('Run compiler for server')
      stats = await webpackCompiler(webpackConfigServer(config))
      if (stats.warnings.length && config.compiler_fail_on_warning) {
        debug('Config set to fail on warning, exiting with status code "1".')
        process.exit(1)
      }

      debug('Copy static assets to dist folder.')
      fs.copySync(paths.src('static'), paths.public())
    } catch (e) {
      debug('Compiler encountered an error.', e)
      process.exit(1)
    }
  }

  static writeClientInfo = (data, clientInfo) => {
    return new Promise((resolve, reject) => {
      fs.writeJson(clientInfo, data, function (err) {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
}

