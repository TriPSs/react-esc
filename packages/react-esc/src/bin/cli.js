#! /usr/bin/env node
import cli from 'commander'
import { version, description } from '../package.json'

cli.version(version, '-v, --version')
.description(`React ESC (🤖) ${description}`)
.usage('<command> [options]')
.option('-d, --debug', 'Set what to output with DEBUG', 'react-esc:*')
.command('start', 'Start the React ESC server').alias('s')
.parse(process.argv)


