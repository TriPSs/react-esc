import webpack from 'webpack'

import buildServer from '../buildServer'
import log from '../log'

export default async function UniversalMiddleware(config) {
  log('Enable Universal middleware.')

  const { server: { useCompiled, output }, utils: { paths } } = config

  if (!useCompiled) {
    try {
      log('Compile server.')

      await new Promise((resolve, reject) => {
        const compiler = webpack(buildServer(config))

        compiler.plugin('done', (stats) => {
          log(`Hash: ${stats.hash}`)
          resolve(true)
        })

        compiler.run((err) => {
          if (err) {
            reject(err)
          }
        })
      })

    } catch (error) {
      log('Error compiling server', error)
      return Promise.reject(error)
    }
  }

  return Promise.resolve(require(paths.dist(output)).default(config))
}
