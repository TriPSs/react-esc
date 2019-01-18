const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (config, options) => {
  if (!options || !Array.isArray(options)) {
    return {}
  }

  return {
    plugins: [
      new CopyWebpackPlugin(options),
    ],
  }
}
