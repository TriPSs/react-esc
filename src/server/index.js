// @remove-file-on-eject
import server from './server'
import defaultConfig from '../config'

export default (givenConfig) => {
  const config = defaultConfig(givenConfig)

  return server(config)
}