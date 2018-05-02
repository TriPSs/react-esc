import webpackDevMiddleware from 'webpack-dev-middleware'
import applyExpressMiddleware from './applyExpressMiddleware'

import log from '../log'

export default (compiler, publicPath, config) => {
  const { paths } = config.utils

  log('Enable webpack dev middleware.')

  const middleware = webpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.src(), // TODO:: This will not work, paths is not in the config yet
    hot        : true,
    logLevel   : config.compiler_quiet ? 'silent' : 'info',
    lazy       : false,
    stats      : config.compiler_stats,
    headers    : { 'Access-Control-Allow-Origin': '*' },
  })

  return async(ctx, next) => {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, {
      end      : (content) => (ctx.body = content),
      setHeader: () => {
        ctx.set.apply(ctx, arguments)
      },
    })

    if (hasNext) {
      await next()
    }
  }
}
