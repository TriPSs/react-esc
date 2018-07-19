import webpackMerge from 'webpack-merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

function cssLoaderConfig(options) {
  const cssOptions = options.options || {}

  return {
    loader : 'css-loader',
    options: webpackMerge({
      sourceMap     : true,
      minimize      : true,
      modules       : true,
      importLoaders : true,
      localIdentName: '[name]__[local]___[hash:base64:5]',
    }, cssOptions),
  }
}

export default ({ webpack: { globals: { __PROD__ } } }, options) => ({

  /**
   * Server configuration
   */
  server: {
    module: {
      rules: [
        {
          test  : /\.css/,
          loader: [
            'simple-universal-style-loader',
            cssLoaderConfig(options),
          ],
        },
      ],
    },
  },

  /**
   * Client configuration
   */
  client: {
    module: {
      rules: [
        {
          test  : /\.css/,
          loader: ExtractTextPlugin.extract({
            fallback: 'simple-universal-style-loader',
            use     : [
              cssLoaderConfig(options),
            ],
          }),
        },
      ],
    },

    plugins: [
      new ExtractTextPlugin({
        filename : '[name].css',
        allChunks: true,
        disable  : !__PROD__,
      }),
    ],
  },

})
