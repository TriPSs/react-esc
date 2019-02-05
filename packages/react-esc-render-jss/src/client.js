import React from 'react'
import { jss, JssProvider } from 'react-jss'

import createGenerateClassName from './utils/createGenerateClassName'
import MainContainer from './utils/MainContainer'

export default class JssClient {

  jss

  config

  constructor(config) {
    this.config = config

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

    this.jss = jss
  }

  render = (App, props) => (
    <MainContainer>
      <JssProvider jss={this.jss}>
        <App {...props} />
      </JssProvider>
    </MainContainer>
  )

}
