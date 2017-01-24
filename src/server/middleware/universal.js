import webpack from 'webpack'
import webpackConfig from '../../build/webpack.config.server'
import _debug from 'debug'

export default class Universal {
  static middleware = async(config) => {
    const debug = _debug('app:server:universal')

    const {use_compiled_server} = config
    const output                = config.utils_paths.dist(config.universal.output)

    if (!use_compiled_server) {
      try {
        debug('Compile server.')
        await new Promise((resolve, reject) => {
          let compiler = webpack(webpackConfig(config))

          compiler.plugin('done', stats => {
            debug('Hash: ' + stats.hash)
            resolve(true)
          })

          compiler.run(function (err, stats) {
            if (err) {
              reject(err)
            }
          })
        })
      } catch (error) {
        debug('Error compiling server', error)
        return Promise.reject(error)
      }
    }

    return Promise.resolve(require(output).default(config))
  }
}

