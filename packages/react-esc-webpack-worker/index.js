/**
 * @param config
 * @param options
 * @returns {{module: {rules: {test: RegExp, loader: string, options: {inline: boolean, name: string, publicPath: *, fallback: boolean}}[]}}}
 */
module.exports = (config, options) => {
  return {
    module: {
      rules: [
        {
          test   : options.test ? options.test : /\.worker\.js$/,
          loader : 'worker-loader',
          options: {
            name      : options.name ? options.name : '[name].[hash].js',
            fallback  : !!options.fallback,
            inline    : !!options.inline,
            publicPath: options.publicPath ? options.publicPath : config.webpack.publicPath,
          },
        },
      ],
    },
  }
}
