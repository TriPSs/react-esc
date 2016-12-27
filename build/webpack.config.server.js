import webpackConfig from './webpack.config'
import clone from 'clone'
import _debug from 'debug'
import fs from 'fs'

export default (config) => {
  const debug = _debug('app:webpack:config')
  const paths = config.utils_paths

  debug('Create server configuration.')
  const webpackConfigServer = clone(webpackConfig(config))

  webpackConfigServer.name = 'server'
  webpackConfigServer.target = 'node'
  webpackConfigServer.externals = fs.readdirSync(paths.base('node_modules'))
                                    .concat([
                                      'react-dom/server', 'react/addons'
                                    ]).reduce(function (ext, mod) {
      ext[mod] = 'commonjs ' + mod
      return ext
    }, {})

// ------------------------------------
// Entry Points
// ------------------------------------
  webpackConfigServer.entry = [
    'babel-polyfill',
    paths.src(config.entry_server)
  ]

// ------------------------------------
// Bundle Output
// ------------------------------------
  webpackConfigServer.output = {
    filename: 'server.js',
    path: paths.dist(),
    library: 'server',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }

  return webpackConfigServer
}

