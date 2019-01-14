import path from 'path'
import cli from 'commander'
import { green } from 'chalk'
import debug from 'debug'

import start from './commands/start'
import getConfig from './utils/getConfig'
import { version } from '../package.json'

const log = debug('react-esc:cli')

cli.name(`${green('react-esc')} start`)
  .description('Start the React ESC server.')
  .option('-c --config <location>', 'File location of the config file')
  .option('-m --mode', 'Mode')
  .parse(process.argv)

const cwd = process.cwd()

const projectPgk = require(path.resolve(cwd, 'package.json'))

log(`CLI Version: ${version}`)
log(`Project Version: ${projectPgk.version}`)

const config = getConfig(cwd, cli)

start(config)
