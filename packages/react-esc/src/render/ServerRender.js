import React from 'react'
import Helmet from 'react-helmet'

import renderHtmlLayout from './renderHtmlLayout'

export default class ServerRender {

  constructor(config) {
    this.config = config
  }

  render(App, ...props) {
    return (
      <App {...{
        props,
      }} />
    )
  }

  postRender({ content, scripts, store }) {
    const head = Helmet.rewind()
    const body = <div key={'body'} {...this.config.app_mount_point} dangerouslySetInnerHTML={{ __html: content }} />

    return renderHtmlLayout(head, [body, scripts], css, store.getState())
  }

}
