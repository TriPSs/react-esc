/**
 * Created by tycho on 19/12/2016.
 */
import path from 'path'
import defaultConfig from './default'

export default (givenConfig) => {

  const config = Object.assign(defaultConfig, givenConfig);

  if (!givenConfig.hasOwn || !givenConfig.hasOwn.server) {
    const rootBase = (...args) => Reflect.apply(path.resolve, null, [path.resolve(__dirname, '..'), ...args])

    config.utils_paths.clientDir = rootBase.bind(null, 'client')
  } else {
    config.utils_paths.clientDir = givenConfig.utils_paths.src
  }

  // Set all paths
  config.utils_paths.src    = config.utils_paths.base.bind(null, config.dir_src)
  config.utils_paths.dist   = config.utils_paths.base.bind(null, config.dir_dist)
  config.utils_paths.public = config.utils_paths.base.bind(null, config.dir_public)

  return config
}
