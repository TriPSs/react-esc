import path from 'path'
import cli from 'commander'
import { green } from 'chalk'
import debug from 'debug'
import deepMerge from 'deepmerge'

import * as webpack from 'react-esc-webpack'
import defaultClientConfig from 'react-esc-config/default.client'
import defaultServerConfig from 'react-esc-config/default.server'
import buildPaths from 'react-esc-config/utils/buildPaths'

import getConfig from './utils/getConfig'
import getRoot from './utils/getRoot'
import { version } from '../package.json'

(async function () {
  const log = debug('react-esc:cli')

  cli.name(`${green('react-esc')} compile`)
    .description('Compile the project.')
    .option('-c --config <location>', 'File location of the config file')
    .parse(process.argv)

  const cwd = process.cwd()

  const projectPgk = require(path.resolve(cwd, 'package.json'))

  log(`CLI Version: ${version}`)
  log(`Project Version: ${projectPgk.version}`)

  log('Create client config')
  let clientConfig = deepMerge(defaultClientConfig, getConfig(cwd, cli))
  clientConfig.utils.paths = buildPaths(clientConfig.utils.dirs, null, getRoot())

  // Create webpack client config
  const webpackClient = webpack.buildClientConfig(clientConfig)
  let stats = await webpack.compile(clientConfig, webpackClient, 'client')

})()
