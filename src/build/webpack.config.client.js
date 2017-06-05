import webpack from 'webpack'
import webpackConfig from './webpack.config'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import clone from 'clone'
import _debug from 'debug'

export default (config) => {
  const debug                           = _debug('app:esc:webpack:config:client')
  const paths                           = config.utils_paths
  const { __DEV__, __PROD__, __TEST__ } = config.globals

  debug('Create client configuration.')
  const webpackConfigClient = clone(webpackConfig(config))

  webpackConfigClient.name   = 'client'
  webpackConfigClient.target = 'web'

  // ------------------------------------
  // Entry Points
  // ------------------------------------
  const APP_ENTRY_PATHS = [
    paths.src(config.entry_client)
  ]

  webpackConfigClient.entry = {
    app   : __DEV__
      ? APP_ENTRY_PATHS.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
      : APP_ENTRY_PATHS,
    vendor: config.compiler_vendor
  }

  // ------------------------------------
  // Bundle Output
  // ------------------------------------
  webpackConfigClient.output = {
    filename  : `[name].[${config.compiler_hash_type}].js`,
    path      : paths.public(),
    publicPath: config.compiler_public_path
  }

  // ------------------------------------
  // Plugins
  // ------------------------------------
  if (__DEV__) {
    debug('Enable plugins for live development (HMR, NoErrors).')
    webpackConfigClient.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    )
  } else if (__PROD__) {
    debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
    webpackConfigClient.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          unused   : true,
          dead_code: true,
          warnings : false
        },
        output  : {
          comments: false
        },
      })
    )
  }

  // Don't split bundles during testing, since we only want import one bundle
  if (!__TEST__) {
    webpackConfigClient.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor']
      })
    )
  }

  // ------------------------------------
  // Finalize Configuration
  // ------------------------------------
  // when we don't know the public path (we know it only when HMR is enabled [in development]) we
  // need to use the extractTextPlugin to fix this issue:
  // http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
  if (!__DEV__) {
    debug('Apply ExtractTextPlugin to CSS loaders.')
    webpackConfigClient.module.loaders.filter((loader) =>
      loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
      const [first, ...rest] = loader.loaders
      loader.loader          = ExtractTextPlugin.extract(first, rest.join('!'))
      Reflect.deleteProperty(loader, 'loaders')
    })

    webpackConfigClient.plugins.push(
      new ExtractTextPlugin('[name].[contenthash].css', {
        allChunks: true
      })
    )
  }

  return webpackConfigClient
}
