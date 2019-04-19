import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import debug from 'debug'

const log = debug('react-esc:cli:config')

const { NODE_ENV } = process.env

const ENV = NODE_ENV || 'development'

export default (cwd, { config, compileConfig }) => {
  const configCompiledLocation = path.resolve(cwd, '.compiled.esc-config.js')

  const configLocation = path.resolve(cwd, config || '.esc-config.js')
  const configExists = fs.existsSync(configCompiledLocation)

  if (!configExists && !compileConfig) {
    console.error('Config does not exists and compiling a new one is turned off!')

    return {}
  }

  if ((!configExists || ENV === 'development') && compileConfig) {
    log('Compiling new config...')

    // TODO:: Change this to use rollup directly here
    execSync(
      `rollup ${configLocation} --file ${configCompiledLocation} --format cjs -c ${path.resolve(__dirname, '../../rollup.config.js')}`,
      {
        stdio: 'pipe',
      },
    )
  }

  if (fs.existsSync(configCompiledLocation)) {
    log('Copying...')

    const configLoc = path.resolve(__dirname, '../../config.js')

    fs.copyFileSync(configCompiledLocation, configLoc)

    return require(configLoc)
  }

  return {}
}
