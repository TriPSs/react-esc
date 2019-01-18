import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

export default (cwd, cli) => {
  const configLocation = path.resolve(cwd, cli.config || '.esc-config.js')

  if (fs.existsSync(configLocation)) {
    const configLoc = path.resolve(__dirname, '../../config.js')
    execSync(`rollup ${configLocation} --file ${configLoc} --format cjs -c ${path.resolve(__dirname, '../../rollup.config.js')}`)

    return require(configLoc)
  }

  return {}
}
