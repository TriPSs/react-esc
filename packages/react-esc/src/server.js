import React from 'react'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { Resolver } from 'react-esc-resolver'
import debug from 'debug'
import hasOwnProperty from 'has-own-property'
import { CookiesProvider } from 'react-cookie'

import ServerRender from './render/ServerRender'
import { Assetic, handleError } from './utils'

import createStore from './createStore'

const log = debug('react-esc:server')

export default async(config) => {

  // Put the function to render the app here
  let RenderServer = null

  switch (config.render) {
    case 'react-esc-render-jss':
    case 'jss':
      ({ RenderServer } = require('react-esc-render-jss'))
      break

    default:
      RenderServer = ServerRender
  }

  return getClientInfo => async(ctx) => new Promise((resolve, reject) => {
    log('Handle route', ctx.req.url)

    const store = createStore(config, ctx.request.universalCookies)

    const defaultLayout = require('modules/layout').default // Locatie uit config
    const AppContainer = require('App').default // Locatie uit config

    // Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
    // user agent is not known.
    // -----------------------------------------------------------------------------
    global.navigator = global.navigator || {}
    global.navigator.userAgent = global.navigator.userAgent || ctx.req.headers['user-agent']

    let compilerPath = config.webpack.publicPath

    // Remove the `/` if the compiler path has it, as the assets already has one
    if (compilerPath.substr(compilerPath.length - 1) === '/') {
      compilerPath = compilerPath.slice(0, -1)
    }

    const { assetsByChunkName } = getClientInfo()
    const assets = Object.keys(assetsByChunkName).map(chunkName => assetsByChunkName[chunkName])

    const links = Assetic
      .getStyles(defaultLayout, assets)
      .map(asset => ({
        rel : 'stylesheet',
        href: `${compilerPath}${asset}`,
      }))

    // This will be transferred to the client side in __LAYOUT__ variable
    // when universal is enabled we need to make sure the client to know about the chunk styles
    const layoutWithLinks = {
      ...defaultLayout,
      link: [
        ...defaultLayout.link,
        ...links,
      ],
    }

    // React-helmet will overwrite the layout once the client start running so that
    // we don't have to remove our unused styles generated on server side
    const layout = {
      ...layoutWithLinks,
      script: [
        ...defaultLayout.script,
        { type: 'text/javascript', innerHTML: `___LAYOUT__ = ${JSON.stringify(layoutWithLinks)}` },
      ],
    }

    // ----------------------------------
    // Everything went fine so far
    // ----------------------------------
    const scripts = Assetic
      .getScripts(defaultLayout, assets)
      .map((asset, i) => (
        <script key={i} type='text/javascript' src={`${compilerPath}${asset}`} />
      ))

    const redirectIfNecessary = (context, reject) => {
      if (hasOwnProperty(context, 'url')) {
        reject({
          redirect: context.url,
          status  : context.status || 302,
        })
      }
    }

    // Generate a new renderClass every request
    const renderClass = new RenderServer(config)

    let context = {}
    Resolver.renderServer(() => (
      <Provider store={store}>
        <StaticRouter location={ctx.req.url} context={context}>
          <CookiesProvider cookies={ctx.request.universalCookies}>
            {renderClass.render(AppContainer, { layout })}
          </CookiesProvider>
        </StaticRouter>
      </Provider>
    )).then((Resolved) => {
      redirectIfNecessary(context, reject)

      const content = renderToString(
        <Resolved />,
      )

      if (hasOwnProperty(context, 'status')) {
        ctx.status = context.status

      } else {
        ctx.status = 200
      }

      const head = Helmet.renderStatic()

      ctx.body = renderClass.postRender({
        content,
        head,
        body: (
          <div
            key='body'
            {...config.app.mountPoint}
            dangerouslySetInnerHTML={{ __html: content }} />
        ),
        scripts,
        store,
      })

      resolve()
    }).catch(error => handleError(
      error,
      resolve,
      ctx,
      defaultLayout,
    ))
  })
}
