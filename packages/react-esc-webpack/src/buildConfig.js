import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import externals from 'webpack-node-externals'

import buildLoaders from './buildLoaders'

export default (config) => {
  const { utils: { paths } } = config

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
    server: {
      name: 'server',

      target: 'node',

      externals: externals(),

      entry: [
        config.server.entry,
      ],

      output: {
        filename      : config.server.output,
        path          : paths.dist(),
        library       : 'server',
        libraryTarget : 'umd',
        umdNamedDefine: true,
        publicPath    : config.compiler_public_path,
      },
    },

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
