import webpack from 'webpack'
import webpackConfig, { cssLoaderConfig, postCssLoaderConfig, sassLoaderConfig } from './webpack.config'
import webpackMerge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import _debug from 'debug'

export default (config) => {

  const debug = _debug('app:esc:webpack:config:client')
  const paths = config.utils_paths
  const { __DEV__, __PROD__, __TEST__ } = config.globals

  debug('Create client configuration.')
  const webpackConfigClient = webpackMerge(webpackConfig(config), {

      name  : 'client',
      target: 'web',

      entry: {
        app   : __DEV__
          ? [
            'react-hot-loader/patch',
            `webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`,
            paths.src(config.entry_client),
          ] : paths.src(config.entry_client),
        vendor: config.compiler_vendor,
      },

      output: {
        filename  : `[name].[${config.compiler_hash_type}].js`,
        path      : paths.public(),
        publicPath: config.compiler_public_path,
      },

      module: {
        rules: [
          {
            test  : /\.scss$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'simple-universal-style-loader',
              use     : [
                cssLoaderConfig,
                postCssLoaderConfig,
                sassLoaderConfig([paths.src('styles')]),
              ],
            }),
          }, {
            test  : /\.css/,
            loader: ExtractTextPlugin.extract({
              fallback: 'simple-universal-style-loader',
              use     : [
                cssLoaderConfig,
                postCssLoaderConfig,
              ],
            }),
          },
        ],
      },

      plugins: [
        new ExtractTextPlugin({
          filename : '[name].[contenthash].css',
          allChunks: true,
          disable  : !__PROD__,
        }),
      ],
    },
  )

  if (__DEV__) {
    debug('Enable plugins for live development (HMR, NoErrors).')

    webpackConfigClient.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    )
  }

  if (__PROD__) {
    debug('Enable plugins for production')

    webpackConfigClient.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug   : false,
      }),

      new UglifyJSPlugin({
        parallel: true,

        uglifyOptions: {
          ecma: 8,

          mangle: {
            keep_fnames: true,
          },

          output: {
            comments: false,
            beautify: false,
          },

          compress: {
            warnings    : false,
            conditionals: true,
            unused      : true,
            comparisons : true,
            sequences   : true,
            dead_code   : true,
            evaluate    : true,
            if_return   : true,
            join_vars   : true,
          },
        },
      }),
    )
  }

  return webpackConfigClient
}
