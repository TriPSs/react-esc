import webpackMerge from 'webpack-merge'
import externals from 'webpack-node-externals'

import buildBaseConfig from './buildBaseConfig'

export default (config) => {
  return webpackMerge(
    buildBaseConfig(config),

    /**
     * Server specific configuration
     */
    {
      name: 'server',

      target: 'node',

      externals: externals(),

      entry: config.utils.paths.server,

      output: {
        filename      : config.server.output,
        path          : config.utils.paths.dist(),
        library       : 'server',
        libraryTarget : 'umd',
        umdNamedDefine: true,
        publicPath    : config.webpack.publicPath,
        globalObject  : 'true',
      },
    },
  )
}
