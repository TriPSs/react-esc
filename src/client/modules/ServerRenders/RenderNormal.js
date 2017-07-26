import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import { Resolver } from 'react-esc-resolver'
import { renderHtmlLayout } from './RenderHtmlLayout'
import Helmet from 'react-helmet'

export const renderNormal = ({ AppContainer, store, location, context, layout, config, scripts, redirectIfNecessary }) =>
  new Promise((resolve, reject) => {
    Resolver.renderServer(() => (
      <Provider {...{ store }}>
        <StaticRouter {...{ location, context }}>
          <AppContainer {...{ store, layout }} />
        </StaticRouter>
      </Provider>
    )).then((Resolved) => {
      let head, content, body

      redirectIfNecessary(context)
      content = renderToString(
        <Resolved />
      )

      head = Helmet.rewind()
      body = <div key='body' {...config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

      resolve(renderHtmlLayout(head, [body, scripts], store.getState()))
    }).catch(reject)
  })

export default renderNormal