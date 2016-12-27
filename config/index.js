/**
 * Created by tycho on 19/12/2016.
 */
import path from 'path'
import ip from 'ip'
import { argv } from 'yargs'

export default (givenConfig) => {

  return givenConfig

  const env = process.env.NODE_ENV || 'development'

  const root = givenConfig.root ? givenConfig.root : path.resolve(__dirname, '..')
  const base = (...args) => Reflect.apply(path.resolve, null, [root, ...args])

  const rootBase = (...args) => Reflect.apply(path.resolve, null, [path.resolve(__dirname, '..'), ...args])

  const config = {
    env,

    globals: {
      'process.env' : {
        'NODE_ENV': JSON.stringify(env)
      },
      'NODE_ENV'    : env,
      '__DEV__'     : env === 'development',
      '__PROD__'    : env === 'production',
      '__TEST__'    : env === 'test',
      '__DEBUG__'   : env === 'development' && !argv.no_debug,
      '__COVERAGE__': !argv.watch && env === 'test',
      '__BASENAME__': JSON.stringify(process.env.BASENAME || '')
    },

    helmet: {
      helmetProps: {
        htmlAttributes: {lang: 'en'},
        title         : 'Title',
        defaultTitle  : 'Default Title',
        titleTemplate : '%s - Webpack App',
        meta          : [
          {charset: 'utf-8'},
          {name: 'viewport', content: 'width=device-width, initial-scale=1'}
        ],
        link          : [
          {rel: 'shortcut icon', href: '/favicon.ico'}
        ],
        script        : [],
        style         : []
      },
      rootProps  : {
        id   : 'root',
        style: {height: '100%'}
      }
    },

    server: {
      host: process.env.HOST || ip.address(),
      port: process.env.PORT || 3000
    },

    universal: {
      output     : '../client/server.js',
      client_info: 'client_info.json'
    },

    path: {
      base  : base,
      src   : base.bind(null, 'src'),
      app   : base.bind(null, 'src/app'),
      dist  : base.bind(null, 'dist'),
      public: base.bind(null, 'dist/public'),
      server: rootBase.bind(null, 'src/server')
    }
  }

  return config
}
