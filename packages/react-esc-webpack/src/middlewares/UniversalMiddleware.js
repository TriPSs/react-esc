import log from '../log'

export default async function UniversalMiddleware(compiler, config) {
  log('Enable Universal middleware.')

  const { server: { useCompiled, output }, utils: { paths } } = config

  if (!useCompiled) {
    try {
      log('Compile server.')

      await new Promise((resolve, reject) => {
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
