import React from 'react'
import { getStyles } from 'simple-universal-style-loader'
import _debug from 'debug'
import CookieStorage from 'react-esc-storage/CookieStorage'

import createStore from './store/createStore'
import * as Assetic from './modules/Assetic'
import handleError from './modules/HandleError'
import renderMethods from './modules/ServerRenders'

export default async (config) => {
  const debug = _debug('app:esc:server:universal:render')

  return getClientInfo => async (ctx) => await new Promise((resolve) => {
    debug('Handle route', ctx.req.url)

    const store         = createStore(config)
    const defaultLayout = require('modules/layout').default
    const AppContainer  = require('containers/AppContainer').default

    // Add Cookie to global so we can use it in the Storage module
    global.cookie = new CookieStorage(ctx.cookies)

    // Set global that the server is rendering
    global.isServer = true
    global.isClient = false

    // Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
    // user agent is not known.
    // -----------------------------------------------------------------------------
    global.navigator           = global.navigator || {}
    global.navigator.userAgent = global.navigator.userAgent || ctx.req.headers['user-agent']

    let { app, vendor } = getClientInfo().assetsByChunkName

    let links = Assetic
      .getStyles(defaultLayout, ([vendor, app]))
      .map(asset => ({
        rel : 'stylesheet',
        href: `${asset}`
      }))

    // This will be transferred to the client side in __LAYOUT__ variable
    // when universal is enabled we need to make sure the client to know about the chunk styles
    let layoutWithLinks = {
      ...defaultLayout,
      link: links
    }

    // React-helmet will overwrite the layout once the client start running so that
    // we don't have to remove our unused styles generated on server side
    let layout = {
      ...layoutWithLinks,
      script: [
        ...defaultLayout.script,
        { type: 'text/javascript', innerHTML: `___LAYOUT__ = ${JSON.stringify(layoutWithLinks)}` }
      ]
    }

    // Only inline all css when in dev mode
    if (config.compiler_css_inline) {
      const styles = getStyles()

      if (styles) {
        layout.style = getStyles().map(style => ({
          cssText: style.parts.map(part => `${part.css}\n`).join('\n')
        }))
      }
    }

    // ----------------------------------
    // Everything went fine so far
    // ----------------------------------
    let scripts = Assetic
      .getScripts(defaultLayout, [vendor, app])
      .map((asset, i) => <script key={i} type='text/javascript' src={`${asset}`} />)

    const redirectIfNecessary = (context) => {
      if (context.url) {
        ctx.status = 302
        ctx.redirect(context.url)
      }
    }

    let context = {}
    renderMethods[config.compiler_render]({
      AppContainer,
      store,
      context,
      layout,
      config,
      scripts,
      redirectIfNecessary,
      location: ctx.req.url,
    }).then((body) => {
      ctx.status = 200
      ctx.body   = body

      resolve()
    }).catch(error => handleError(
      error,
      resolve,
      ctx,
      defaultLayout
    ))
  })
}
