import path from 'path'
import fs from 'fs'
import cli from 'commander'
import { green } from 'chalk'
import debug from 'debug'

import KoaServer from '../KoaServer'
import { version } from '../package.json'

const log = debug('react-esc:cli')

cli.name(`${green('react-esc')} start`)
  .description('Start the React ESC server.')
  .option('-f --file <location>', 'File location of the Server')
  .option('-c --config <location>', 'File location of the config file')
  .parse(process.argv)

const cwd = process.cwd()

const projectPgk = require(path.resolve(cwd, 'package.json'))

log(`CLI Version: ${version}`)
log(`Project Version: ${projectPgk.version}`)

const server = new KoaServer()

/*
 // TODO:: Make following configs work, based on NODE_ENV
 .esc-config.development.js
 .esc-config.production.js

 const envConfigLocation = path.resolve(process.cwd(), cli.config || '.esc-config.js')
 if (fs.existsSync(configLocation)) {
 server.setup(require(configLocation))
 }
 */

// TODO:: When above works use this as fallback when no config has bee found
const configLocation = path.resolve(cwd, cli.config || '.esc-config.js')
if (fs.existsSync(configLocation)) {
  const config = require(configLocation)
  server.setup(config)

  fs.createReadStream(configLocation).pipe(fs.createWriteStream(path.resolve(__dirname, '../config.js')))
}

server.start()
