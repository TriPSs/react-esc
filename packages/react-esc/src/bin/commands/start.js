import getConfig from '../utils/getConfig'
import KoaServer from '../../KoaServer'

export default async ({ config = null, compileConfig } = {}) => {
  const server = new KoaServer()

  if (config === null || typeof config === 'string') {
    config = await getConfig(process.cwd(), { config, compileConfig })
  }

  server.setup(config)
  server.start()
}
