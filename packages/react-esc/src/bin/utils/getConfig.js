import fs from 'fs'
import path from 'path'

export default (cwd, cli) => {
  /*
   // TODO:: Make following configs work, based on NODE_ENV
   .esc-config.development.js
   .esc-config.production.js

   const envConfigLocation = path.resolve(process.cwd(), cli.config || '.esc-config.js')
   if (fs.existsSync(configLocation)) {
   server.setup(require(configLocation))
   }
   */

  const configLocation = path.resolve(cwd, cli.config || '.esc-config.js')

  if (fs.existsSync(configLocation)) {
    const config = require(configLocation)

    fs.createReadStream(configLocation).pipe(fs.createWriteStream(path.resolve(__dirname, '../../config.js')))

    return config
  }

  return {}
}
