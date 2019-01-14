import webpack from 'webpack'
import log from './log'

export default (config, webpackConfig, type) => new Promise((resolve, reject) => {
  const compiler = webpack(webpackConfig)

  log(`Starting compiler for ${type}`)
  // Run the compiler
  compiler.run((error, stats) => {
    if (error) {
      log('Webpack compiler encountered a fatal error.', err)

      return reject(error)
    }

    const jsonStats = stats.toJson()
    log('Webpack compile completed.')
    log(stats.toString(config.webpack.stats))

    if (jsonStats.errors.length > 0) {
      log('Webpack compiler encountered errors.')
      log(jsonStats.errors.join('\n'))

      return reject(new Error('Webpack compiler encountered errors'))

    } else if (jsonStats.warnings.length > 0) {
      log('Webpack compiler encountered warnings.')
      log(jsonStats.warnings.join('\n'))

    } else {
      log('No errors or warnings encountered.')
    }

    resolve(jsonStats)
  })
})

