import webpackMerge from 'webpack-merge'

function loadPackage(config, rule, options = {}) {
  if (Array.isArray(rule)) {
    const [pkg, pkgOptions] = rule

    return loadPackage(config, pkg, pkgOptions)
  }

  if (rule.indexOf('react-esc-webpack') > -1) {
    return require(rule)(config, options)
  }

  return false
}


export default (config) => {
  const { webpack } = config

  const webpackConfig = {

    module: {
      rules: [
        {
          test   : /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader : 'babel-loader',

        },
        {
          test   : /\.(woff|woff2|otf|eot|ttf)$/i,
          loaders: ['file-loader?hash=sha512&digest=hex&name=fonts/font-[name]-[hash:6].[ext]'],
        },
      ],
    },

  }

  const loaders = webpack.loaders.map((rule) => {
    if (typeof rule === 'function') {
      return rule(config)
    }

    return loadPackage(config, rule)

  }).filter(Boolean)

  return webpackMerge(
    webpackConfig,
    ...loaders,
  )
}
