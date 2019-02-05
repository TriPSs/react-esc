import React from 'react'

import renderHtmlLayout from './renderHtmlLayout'

export default class ServerRender {

  constructor(config) {
    this.config = config
  }

  render(App, props) {
    return (
      <App {...props} />
    )
  }

  postRender({ head, body, scripts, store }) {
    return renderHtmlLayout(head, [body, scripts], store.getState())
  }

}
