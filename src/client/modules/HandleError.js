/**
 * Created by tycho on 20/03/2017.
 */
import React from 'react'
import Helmet from 'react-helmet'
import PrettyError from 'pretty-error'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderHtmlLayout } from './RenderHtmlLayout'
import _debug from 'debug'

export default (error, resolve, ctx, defaultLayout) => {
  const debug = _debug('app:esc:server:universal:server:error')

  if (error && error.hasOwnProperty('redirect')) {
    ctx.redirect(error.redirect)

  } else {
    if (error) {
      let pe = new PrettyError()
      debug(pe.render(error))
    }

    let title   = `500 - Internal Server Error`
    let content = renderToStaticMarkup(
      <div>
        <Helmet {...{ ...defaultLayout, title }} />
        <h3>{title}</h3>
      </div>
    )
    let head    = Helmet.rewind()
    ctx.status  = 500
    ctx.body    = renderHtmlLayout(head, <div dangerouslySetInnerHTML={{ __html: content }} />)
  }

  resolve()
}