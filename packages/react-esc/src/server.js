import React from 'react'
import { renderToString } from 'react-dom/server'
import { getStyles } from 'simple-universal-style-loader'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import { Resolver } from 'react-esc-resolver'
import debug from 'debug'
import hasOwnProperty from 'has-own-property'

import ServerRender from './render/ServerRender'
import Assetic from './utils'

import createStore from './createStore'

/*import createStore from './store/createStore'
 import handleError from './modules/HandleError'
 import renderMethods from './modules/ServerRenders'*/

const log = debug('react-esc:server')

export default async(config) => {

  // Put the function to render the app here
  let renderClass = null

  if (config.server.render !== null) {
    const { RenderServer } = require(config.server.render)

    renderClass = new RenderServer(config)

  } else {
    renderClass = new ServerRender(config)
  }

  return getClientInfo => async(ctx) => new Promise((resolve, reject) => {
    log('Handle route', ctx.req.url)

    const store = createStore(config, ctx.request.universalCookies)

    // TODO:: Vanaf hier
    const defaultLayout = require('modules/layout').default // Locatie uit config
    const AppContainer = require('containers/AppContainer').default // Locatie uit config

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

    let context = {}
    Resolver.renderServer(hot(module)(() => (
      <Provider {...{ store }}>
        <StaticRouter {...{ location, context }}>
          <CookiesProvider {...{ cookies }}>
            {renderClass.render(AppContainer, { layout, store })}
          </CookiesProvider>
        </StaticRouter>
      </Provider>
    )))
      .then((Resolved) => {
        redirectIfNecessary(context, reject)

        const content = renderToString(
          <Resolved />,
        )

        resolve(renderClass.postRender({ content, scripts, store }))
      }).catch(reject)
  })
}
