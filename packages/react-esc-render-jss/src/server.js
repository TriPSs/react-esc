import React from 'react'

import { JssProvider, SheetsRegistry, jss } from 'react-jss'

import createGenerateClassName from './utils/createGenerateClassName'
import renderHtmlLayout from './utils/renderHtmlLayout'
import collapseWhitespace from './utils/collapseWhitespace'

export default class JssServer {

  constructor(config) {
    this.config = config

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

    this.jss = jss
    this.sheetsRegistry = new SheetsRegistry()
  }

  render(App, props) {
    return (
      <JssProvider registry={this.sheetsRegistry} jss={this.jss}>
        <App {...props} />
      </JssProvider>
    )
  }

  postRender({ head, body, content, scripts, store }) {
    // Grab the CSS from our sheetsRegistry.
    const css = collapseWhitespace(this.sheetsRegistry.toString())

    return renderHtmlLayout(head, [body, scripts], css, store.getState())
  }

}
