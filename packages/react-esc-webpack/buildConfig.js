const buildRules = require('./buildRules')

module.exports = function buildConfig(config) {
  const { webpack } = config

  const webpackConfig = {
    devtool: webpack.devTool,

    mode: webpack.mode,

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
      new webpack.DefinePlugin(webpack.globals),
    ],
  }

  webpackConfig.module.rules = buildRules(webpackConfig, config)

  return webpackConfig
}
