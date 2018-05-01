import React from 'react'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'

import { JssProvider, SheetsRegistry, jss } from 'react-jss'
import { minify } from 'html-minifier'

import createGenerateClassName from './utils/createGenerateClassName'
import renderHtmlLayout from './utils/renderHtmlLayout'

const sheetsRegistry = new SheetsRegistry()

export default {

  render: ({ config }) => {
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

    return (App, ...props) => (
      <JssProvider registry={sheetsRegistry} jss={jss}>
        <App {...{
          props,
        }} />
      </JssProvider>
    )
  },

  postRender: ({ content, scripts, store, config }) => {
    // Grab the CSS from our sheetsRegistry.
    const css = minify(sheetsRegistry.toString(), { collapseWhitespace: true })

    const head = Helmet.rewind()
    const body = <div key='body' {...config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

    return renderHtmlLayout(head, [body, scripts], css, store.getState())
  },

}
