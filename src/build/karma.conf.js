// @remove-file-on-eject
import { argv } from 'yargs'
import createWebpackConfig from './webpack.config.client'
import createConfig from '../config'
import _debug from 'debug'

export default (givenConfig) => {
  const debug         = _debug('app:esc:karma')
  const config        = createConfig(givenConfig)
  const webpackConfig = createWebpackConfig(config)

  debug('Create configuration.')

  const karmaConfig = {
    basePath: config.utils_paths.src(), // project root in relation to bin/karma.js

    files: [
      {
        pattern : config.utils_paths.tests('test-bundle.js'),
        watched : false,
        served  : true,
        included: true
      }
    ],

    singleRun        : !argv.watch,
    frameworks       : ['mocha'],
    reporters        : ['mocha'],
    preprocessors    : {
      [config.utils_paths.tests('test-bundle.js')]: ['webpack']
    },
    browsers         : ['PhantomJS'],
    webpack          : webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      stats : 'errors-only'
    },
    coverageReporter : {
      reporters: config.coverage_reporters
    }
  }

  if (config.globals.__COVERAGE__) {
    karmaConfig.reporters.push('coverage')
    karmaConfig.webpack.module.rules.push({
      enforce: 'pre',
      test   : /\.(js|jsx)$/,
      include: new RegExp(config.dir_src),
      loader : 'isparta-loader',
      exclude: /node_modules/
    })
  }

  return karmaConfig
}
