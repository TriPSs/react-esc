import fs from 'fs'
import path from 'path'
import debug from 'debug'
import { red } from 'chalk'

import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

const log = debug('react-esc:cli:config')

const { NODE_ENV } = process.env

const ENV = NODE_ENV || 'development'

export default async (cwd, { config, compileConfig }) => {
  const configCompiledLocation = path.resolve(cwd, '.compiled.esc-config.js')

  const configLocation = path.resolve(cwd, config || '.esc-config.js')
  const configExists = fs.existsSync(configCompiledLocation)

  if (!configExists && !compileConfig) {
    log(red('Config does not exists and compiling a new one is turned off!'))

    return {}
  }

  if ((!configExists || ENV === 'development') && compileConfig !== 'false') {
    log('Compiling new config...')

    const bundle = await rollup({
      input: configLocation,

      context: 'null',

      moduleContext: 'null',

      plugins: [

        babel({
          babelrc: false,

          plugins: [
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
          ],

          runtimeHelpers: true,

          exclude: /node_modules/,
        }),

      ],
    })

    await bundle.write({
      file: configCompiledLocation,
      format: 'cjs'
    })
  }

  if (fs.existsSync(configCompiledLocation)) {
    log('Copying...')

    const configLoc = path.resolve(__dirname, '../../config.js')

    fs.copyFileSync(configCompiledLocation, configLoc)

    return require(configLoc)
  }

  return {}
}
