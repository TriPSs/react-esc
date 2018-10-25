import webpack from 'webpack'
import webpackMerge from 'webpack-merge'
import externals from 'webpack-node-externals'

import buildLoaders from './buildLoaders'

export default (config) => {
  const { utils: { paths } } = config

  const webpackConfig = {

    devtool: config.webpack.devTool,

    mode: 'development', // config.webpack.mode,

    node: {
      fs: 'empty',
    },

    resolve: {
      modules: [
        paths.src(),
        'node_modules',
      ],

      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
    },

    module: {
      rules: [
        {
          test   : /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader : 'babel-loader',
          options: {
            cacheDirectory: true,

            plugins:
              config.webpack.globals.__DEV__ ?
                ['react-hot-loader/babel']
                : [],
          },
        },
      ],
    },

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

      entry: paths.server,

      output: {
        filename      : config.server.output,
        path          : paths.dist(),
        library       : 'server',
        libraryTarget : 'umd',
        umdNamedDefine: true,
        publicPath    : config.webpack.publicPath,
      },
    },

    /**
     * Client specific configuration
     */
    client: {
      name: 'client',

      target: 'web',

      entry: {
        app: [paths.client],
        ...config.webpack.clientEntries,
      },

      output: {
        filename  : `[name].[${config.webpack.hashType}].js`,
        path      : paths.public(),
        publicPath: config.webpack.publicPath,
      },

    },
  }

  return webpackMerge(
    webpackConfig,
    buildLoaders(config),
  )
}
