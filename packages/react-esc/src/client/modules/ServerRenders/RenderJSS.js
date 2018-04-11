import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import { Resolver } from 'react-esc-resolver'
import Helmet from 'react-helmet'
import { CookiesProvider } from 'react-cookie'

import { JssProvider, SheetsRegistry, jss } from 'react-jss'
import { minify } from 'html-minifier'

import createGenerateClassName from '../JSS/createGenerateClassName'
import { renderJSSHtmlLayout } from './RenderJSSHtmlLayout'

export default ({
  AppContainer,
  store,
  location,
  context,
  layout,
  config,
  scripts,
  redirectIfNecessary,
  cookies,
}) => new Promise((resolve, reject) => {
  // Create a sheetsRegistry instance.
  const sheetsRegistry = new SheetsRegistry()

  let options = {
    createGenerateClassName,
  }

  if (config.jss && config.jss.options) {
    options = {
      ...options,
      ...config.jss.options,
    }
  }

  jss.setup(options)

  Resolver.renderServer(() => (
    <Provider {...{ store }}>
      <StaticRouter {...{ location, context }}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <CookiesProvider {...{ cookies }}>
            <AppContainer {...{ store, layout }} />
          </CookiesProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )).then((Resolved) => {
    redirectIfNecessary(context, reject)

    // Grab the CSS from our sheetsRegistry.
    const css = minify(sheetsRegistry.toString(), { collapseWhitespace: true })

    const content = renderToString(
      <Resolved />,
    )

    const head = Helmet.rewind()
    const body = <div key='body' {...config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

    resolve(renderJSSHtmlLayout(head, [body, scripts], css, store.getState()))

  }).catch(reject)
})
