/**
 * Created by tycho on 19/12/2016.
 */
import path from 'path'

export default (givenConfig) => {

  const rootBase = (...args) => Reflect.apply(path.resolve, null, [path.resolve(__dirname, '..'), ...args])

  givenConfig.utils_paths.clientServer = rootBase.bind(null, 'src/client')

  return givenConfig

}
