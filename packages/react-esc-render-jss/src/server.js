import React from 'react'
import Helmet from 'react-helmet'

import { JssProvider, SheetsRegistry, jss } from 'react-jss'
import { minify } from 'html-minifier'

import createGenerateClassName from './utils/createGenerateClassName'
import renderHtmlLayout from './utils/renderHtmlLayout'

export default class JssServer {

  constructor(config) {
    this.sheetsRegistry = new SheetsRegistry()
    this.config = config
  }

  render(App, ...props) {
    let options = {
      createGenerateClassName,
    }

    if (this.config.jss && this.config.jss.options) {
      options = {
        ...options,
        ...this.config.jss.options,
      }
    }

    jss.setup(options)

    return (
      <JssProvider registry={this.sheetsRegistry} jss={jss}>
        <App {...{
          props,
        }} />
      </JssProvider>
    )
  }

  postRender({ content, scripts, store }) {
    // Grab the CSS from our sheetsRegistry.
    const css = minify(this.sheetsRegistry.toString(), { collapseWhitespace: true })

    const head = Helmet.rewind()
    const body = <div key='body' {...this.config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

    return renderHtmlLayout(head, [body, scripts], css, store.getState())
  }

}
