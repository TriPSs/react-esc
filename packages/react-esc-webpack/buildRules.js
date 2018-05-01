module.exports = function buildRules(webpackConfig, config) {
  const { webpack } = config

  return [
    {
      test   : /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader : 'babel-loader',

    }, {
      test   : /\.(woff|woff2|otf|eot|ttf)$/i,
      loaders: ['file-loader?hash=sha512&digest=hex&name=fonts/font-[name]-[hash:6].[ext]'],
    },

    ...webpack.rules.map((rule) => {
      if (typeof rule === 'function') {
        // TODO:: What params to give with?
        return rule()

      } else if (typeof rule === 'string' && rule.indexOf('react-esc-webpack') > -1) {
        // TODO:: What params to give with?
        return require(rule)(webpackConfig, config)
      }

      return false
    }).filter(Boolean),
  ]
}
