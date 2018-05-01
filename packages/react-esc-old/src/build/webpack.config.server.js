import webpackConfig, { cssLoaderConfig, postCssLoaderConfig, sassLoaderConfig } from './webpack.config'
import webpackMerge from 'webpack-merge'
import _debug from 'debug'
import externals from 'webpack-node-externals'

export default (config) => {

  const debug = _debug('app:esc:webpack:config:server')
  const paths = config.utils_paths

  debug('Create server configuration.')

  return webpackMerge(webpackConfig(config), {
    name  : 'server',
    target: 'node',

    externals: externals(),

    entry: [
      paths.clientDir(config.entry_server),
    ],

    module: {
      rules: [{
        test  : /\.scss$/,
        loader: [
          'simple-universal-style-loader',
          cssLoaderConfig,
          postCssLoaderConfig,
          sassLoaderConfig([paths.src('styles')]),
        ],
      }, {
        test  : /\.css/,
        loader: [
          'simple-universal-style-loader',
          cssLoaderConfig,
          postCssLoaderConfig,
        ],
      }],
    },

    output: {
      filename      : 'server.js',
      path          : paths.dist(),
      library       : 'server',
      libraryTarget : 'umd',
      umdNamedDefine: true,
      publicPath    : config.compiler_public_path,
    },
  })
}
