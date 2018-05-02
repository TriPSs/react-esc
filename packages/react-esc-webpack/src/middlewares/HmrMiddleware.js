import webpackHotMiddleware from 'webpack-hot-middleware'
import applyExpressMiddleware from './applyExpressMiddleware'

import log from '../log'

export default function (compiler, opts) {
  log('Enable Webpack Hot Module Replacement (HMR).')

  const middleware = webpackHotMiddleware(compiler, opts)
  return async(ctx, next) => {
    const hasNext = await applyExpressMiddleware(middleware, ctx.req, ctx.res)

    if (hasNext && next) {
      await next()
    }
  }
}
