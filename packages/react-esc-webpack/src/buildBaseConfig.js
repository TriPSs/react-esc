import webpack from 'webpack'
import webpackMerge from 'webpack-merge'

import buildLoaders from './buildLoaders'

export default (config) => {
  const webpackConfig = {

    devtool: config.webpack.devTool,

    mode: 'development', // config.webpack.mode,

    node: {
      fs: 'empty',
    },

    resolve: {
      modules: [
        config.utils.paths.src(),
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
  }

  return webpackMerge(
    webpackConfig,
    buildLoaders(config),
  )
}
