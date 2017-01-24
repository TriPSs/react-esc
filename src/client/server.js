import React from 'react'
import { match } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { syncHistoryWithStore } from 'react-router-redux'
import createMemoryHistory from 'react-router/lib/createMemoryHistory'
import { getStyles } from 'simple-universal-style-loader'
import Helmet from 'react-helmet'
import createStore from './store/createStore'
import _debug from 'debug'
import * as Assetic from './modules/Assetic'

import { renderHtmlLayout } from './modules/RenderHtmlLayout'
import PrettyError from 'pretty-error'
import { Resolver } from 'react-resolver'

export default async(config) => {
  const debug = _debug('app:server:universal:render')

  return getClientInfo => async(ctx, next) => {
    await new Promise((resolve, reject) => {

      try {
        const defaultLayout = config.defaultLayout
        const AppContainer  = config.AppContainer
        const initialState  = {}
        const memoryHistory = createMemoryHistory(ctx.req.url)
        const store         = createStore(initialState, memoryHistory, config.reducers)
        const routes        = require('routes').default(store)

        const history = syncHistoryWithStore(memoryHistory, store, {
          selectLocationState: (state) => state.router
        })

        match({history, routes, location: ctx.req.url}, async(err, redirect, props) => {
          debug('Handle route', ctx.req.url)

          let head, content
          let {app, vendor} = getClientInfo().assetsByChunkName

          let links = Assetic
            .getStyles(defaultLayout, ([vendor, app]))
            .map(asset => ({
              rel : 'stylesheet',
              href: `${asset}`
            }))

          const handleError = ({status, message, error = null, children = null}) => {
            if (error) {
              let pe = new PrettyError()
              debug(pe.render(error))
            }

            let title  = `${status} - ${message}`
            content    = renderToStaticMarkup(
              <div>
                <Helmet {...{...defaultLayout, title}} />
                <h3>{title}</h3>
                {children}
              </div>
            )
            head       = Helmet.rewind()
            ctx.status = 500
            ctx.body   = renderHtmlLayout(head, <div dangerouslySetInnerHTML={{__html: content}}/>)

            reject()
          }

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
              {type: 'text/javascript', innerHTML: `___INITIAL_STATE__ = ${JSON.stringify(store.getState())}`},
              {type: 'text/javascript', innerHTML: `___LAYOUT__ = ${JSON.stringify(layoutWithLinks)}`}
            ]
          }

          // Only inline all css when in dev mode
          if (config.compiler_css_inline) {
            layout.style = getStyles().map(style => ({
              cssText: style.parts.map(part => `${part.css}\n`).join('\n')
            }))
          }

          // ----------------------------------
          // Internal server error
          // ----------------------------------
          if (err) {
            handleError({status: 500, message: 'Internal server error', error: err})
            return
          }

          // ----------------------------------
          // No route matched
          // This should never happen if the router has a '*' route defined
          // ----------------------------------
          if (typeof err === 'undefined' && typeof redirect === 'undefined' && typeof props === 'undefined') {
            debug('No route found.')

            // We could call our next middleware maybe
            // await next()
            // return

            // Or display a 404 page
            handleError({status: 404, message: 'Page not found'})
            return
          }

          // ----------------------------------
          // Everything went fine so far
          // ----------------------------------
          let scripts = Assetic
            .getScripts(defaultLayout, [vendor, app])
            .map((asset, i) => <script key={i} type='text/javascript' src={`${asset}`}/>)

          Resolver
            .resolve(() => (
              <AppContainer
                history={history}
                routerKey={Math.random()}
                routes={routes}
                store={store}
                layout={layout}/>
            )) // Pass a render function for context!
            .then(({Resolved, data}) => {
              content = renderToString(
                <Resolved />
              )

              head       = Helmet.rewind()
              let body   = <div key='body' {...config.app_mount_point} dangerouslySetInnerHTML={{__html: content}}/>
              ctx.status = 200
              ctx.body   = renderHtmlLayout(head, [body, scripts], data)

              resolve()

            }).catch(err => handleError({status: 500, message: 'Internal Server Error', error: err}))
        })
      } catch (e) {
        debug('error', e)
      }
    })
  }
}
