/* eslint key-spacing:0 spaced-comment:0 */
import path from 'path'
import _debug from 'debug'
import { argv } from 'yargs'
import ip from 'ip'
import defaultLayout from './layout'
import reducers from '../client/store/reducers'
import AppContainer from '../client/containers/AppContainer'

const localip = ip.address()
const debug   = _debug('app:config')
debug('Creating configuration for ESC.')

// ========================================================
// Default Configuration
// ========================================================
const config = {
  hasOwn: {
    server: false,
    nginx : false
  },

  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base : path.resolve(__dirname, '..'),
  dir_src   : 'src',
  dir_dist  : 'dist',
  dir_public: 'dist/public',
  dir_server: 'server',
  dir_test  : 'tests',

  // ----------------------------------
  // Entry points
  // ----------------------------------
  entry_client: 'client.js',
  entry_server: 'server.js',

  // ----------------------------------
  // App mount point config
  // ----------------------------------
  app_mount_point: {
    id   : 'root',
    style: {height: '100%'}
  },

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host  : process.env.HOST || localip,
  server_port  : process.env.PORT || 3000,

  universal: {
    output     : 'server.js',
    client_info: 'client_info.json'
  },

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_css_modules    : true,
  compiler_devtool        : 'source-map',
  compiler_hash_type      : 'hash',
  compiler_fail_on_warning: false,
  compiler_quiet          : false,
  compiler_public_path    : '/',
  compiler_stats          : {
    chunks      : false,
    chunkModules: false,
    colors      : true
  },
  compiler_vendor         : [
    'babel-polyfill',
    'history',
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [
    {type: 'text-summary'},
    {type: 'lcov', dir: 'coverage'}
  ],

  defaultLayout,
  reducers,
  AppContainer
}

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env' : {
    'NODE_ENV': JSON.stringify(config.env)
  },
  'NODE_ENV'    : config.env,
  '__DEV__'     : config.env === 'development',
  '__PROD__'    : config.env === 'production',
  '__TEST__'    : config.env === 'test',
  '__DEBUG__'   : config.env === 'development' && !argv.no_debug,
  '__COVERAGE__': !argv.watch && config.env === 'test',
  '__BASENAME__': JSON.stringify(process.env.BASENAME || '')
}

export default config
