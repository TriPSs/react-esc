import getConfig from '../utils/getConfig'
import KoaServer from '../../KoaServer'

export default ({ config = null, compileConfig } = {}) => {
  const server = new KoaServer()

  if (config === null || typeof config === 'string') {
    config = getConfig(process.cwd(), { config, compileConfig })
  }

  server.setup(config)
  server.start()
}
