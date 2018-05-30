import React from 'react'

export default class ClientRender {

  constructor(config) {
    this.config = config
  }

  render = (App, { ...props }) => (
    <App {...props} />
  )

}

