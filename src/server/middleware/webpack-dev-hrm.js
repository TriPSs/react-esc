import _debug from 'debug'
import middleware from 'koa-webpack'

const debug = _debug('app:esc:server:webpack-dev')

export default function (compiler, publicPath, config) {
  const paths = config.utils_paths

  debug('Enable webpack dev & hmr middleware.')

  return middleware({
    compiler: compiler,
    dev     : {
      publicPath,
      contentBase: paths.src(),
      hot        : true,
      quiet      : config.compiler_quiet,
      noInfo     : config.compiler_quiet,
      lazy       : false,
      stats      : config.compiler_stats,
      headers    : {
        'Access-Control-Allow-Origin': '*',
      },
    },
  })
}
