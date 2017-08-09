import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import { Resolver } from 'react-esc-resolver'
import Helmet from 'react-helmet'

import preset from 'jss-preset-default'
import { JssProvider, SheetsRegistry } from 'react-jss'
import { create } from 'jss'
import { minify } from 'html-minifier'
import { renderJSSHtmlLayout } from './RenderJSSHtmlLayout'

export const renderJSS = ({ AppContainer, store, location, context, layout, config, scripts, redirectIfNecessary }) =>
  new Promise((resolve, reject) => {
    // Create a sheetsRegistry instance.
    const sheetsRegistry = new SheetsRegistry()

    // Configure JSS
    const jss = create(preset());

    if (config.jss.options) {
      jss.options = {
        ...jss.options,
        ...config.jss.options,
      }
    }

    Resolver.renderServer(() => (
      <Provider {...{ store }}>
        <StaticRouter {...{ location, context }}>
          <JssProvider registry={sheetsRegistry} jss={jss}>
            <AppContainer {...{ store, layout }} />
          </JssProvider>
        </StaticRouter>
      </Provider>
    )).then((Resolved) => {
      redirectIfNecessary(context)

      // Grab the CSS from our sheetsRegistry.
      const css = minify(sheetsRegistry.toString(), { collapseWhitespace: true })

      const content = renderToString(
        <Resolved />
      )

      const head = Helmet.rewind()
      const body = <div key='body' {...config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

      resolve(renderJSSHtmlLayout(head, [body, scripts], css, store.getState()))

    }).catch(reject)
  })

export default renderJSS