import webpackDevMiddleware from 'webpack-dev-middleware'
import applyExpressMiddleware from './applyExpressMiddleware'

import log from '../log'

export default (compiler, publicPath, config) => {
  const { utils: { paths }, webpack: { quiet, stats } } = config

  log('Enable webpack dev middleware.')

  const middleware = webpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.src(),
    hot        : true,
    logLevel   : quiet ? 'silent' : 'info',
    lazy       : false,
    headers    : { 'Access-Control-Allow-Origin': '*' },
    stats,
  })

  return async(ctx, next) => {
    const hasNext = await applyExpressMiddleware(middleware, ctx.req, {
      end      : content => (ctx.body = content),
      setHeader: () => {
        ctx.set.apply(ctx, arguments)
      },
    })

    if (hasNext) {
      await next()
    }
  }
}
