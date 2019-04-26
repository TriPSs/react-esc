import path from 'path'
import fs from 'fs-extra'
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
    .option('--compile-config <compile>', 'Compile new config', true)
    .parse(process.argv)

  const cwd = process.cwd()

  const projectPgk = require(path.resolve(cwd, 'package.json'))

  log(`CLI Version: ${version}`)
  log(`Project Version: ${projectPgk.version}`)

  log('Create client config')
  let clientConfig = deepMerge(defaultClientConfig, await getConfig(cwd, cli))
  clientConfig.utils.paths = buildPaths(clientConfig.utils.dirs, null, getRoot())

  // Create webpack client config
  const webpackClient = webpack.buildClientConfig(clientConfig)
  let stats = await webpack.compile(clientConfig, webpackClient, 'client')

  // User also wants a server so let's compile that
  if (typeof clientConfig.server !== 'boolean' || clientConfig.server) {
    log('Create server config')
    let serverConfig = deepMerge(defaultServerConfig, getConfig(cwd, cli))
    serverConfig.utils.paths = buildPaths(serverConfig.utils.dirs, null, getRoot())

    log('Write client info')
    let { hash, version, assetsByChunkName } = stats
    await fs.writeJsonSync(serverConfig.utils.paths.dist(serverConfig.server.clientInfo), {
      hash,
      version,
      assetsByChunkName,
    })

    // Create webpack server config
    const webpackServer = webpack.buildServerConfig(serverConfig)
    await webpack.compile(serverConfig, webpackServer, 'server')

    log('Copy static assets to dist folder.')
    fs.copySync(serverConfig.utils.paths.src('static'), serverConfig.utils.paths.public())

    log('Copy images to public img folder.')
    if (fs.existsSync(serverConfig.utils.paths.dist('img'))) {
      fs.copySync(serverConfig.utils.paths.dist('img'), serverConfig.utils.paths.public('img'))
      fs.removeSync(serverConfig.utils.paths.dist('img'))
    }

    log('Copy fonts to public fonts folder.')
    if (fs.existsSync(serverConfig.utils.paths.dist('fonts'))) {
      fs.copySync(serverConfig.utils.paths.dist('fonts'), serverConfig.utils.paths.public('fonts'))
      fs.removeSync(serverConfig.utils.paths.dist('fonts'))
    }
  }

  log('\nDone!')
})()
