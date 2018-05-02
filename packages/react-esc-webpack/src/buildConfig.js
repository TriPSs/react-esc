import webpack from 'webpack'
import webpackMerge from 'webpack-merge'

import buildLoaders from './buildLoaders'

export default (config) => {
  const webpackConfig = {

    devtool: config.webpack.devTool,

    mode: config.webpack.mode,

    node: {
      fs: 'empty',
    },

    /* resolve: {
     modules   : [
     paths.src(),
     'node_modules',
     ],
     extensions: [
     '.js',
     '.jsx',
     '.json',
     ],
     symlinks  : false,
     },
     */

    plugins: [
      new webpack.DefinePlugin(config.webpack.globals),
    ],

    /**
     * Server specific configuration
     */
    server: {},

    /**
     * Client specific configuration
     */
    client: {},
  }

  return webpackMerge(
    webpackConfig,
    buildLoaders(config),
  )
}
