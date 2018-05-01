import { cssLoaderConfig, postCssLoaderConfig } from 'packages/react-esc-old/src/build/webpack.config'

module.exports = function webpackCss(webpackConfig) {

  return {
    test  : /\.css/,
    loader: ExtractTextPlugin.extract({
      fallback: 'simple-universal-style-loader',
      use     : [
        cssLoaderConfig,
        postCssLoaderConfig,
      ],
    }),
  }
}
