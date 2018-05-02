import webpackMerge from 'webpack-merge'

import buildConfig from './buildConfig'

export default (config) => {
  const { server, client, ...rest } = buildConfig(config)

  return webpackMerge(rest, server)
}
