import webpackMerge from 'webpack-merge'
import HtmlPlugin from 'html-webpack-plugin'

import buildBaseConfig from './buildBaseConfig'

export default (config) => {
  return webpackMerge(
    buildBaseConfig(config),

    /**
     * Client specific configuration
     */
    {
      name: 'client',

      target: 'web',

      entry: {
        app: [config.utils.paths.client],
        ...config.webpack.clientEntries,
      },

      // If the user does not want a server then add the Html plugin
      plugins: typeof config.server === 'boolean' && !config.server
        ? [new HtmlPlugin(config.client.htmlPlugin)]
        : [],

      output: {
        filename    : `[name].[${config.webpack.hashType}].js`,
        path        : config.utils.paths.public(),
        publicPath  : config.webpack.publicPath,
        globalObject: 'this',
      },
    },
  )
}
