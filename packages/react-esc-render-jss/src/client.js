import React from 'react'
import { jss, JssProvider } from 'react-jss'

import createGenerateClassName from './utils/createGenerateClassName'
import MainContainer from './utils/MainContainer'

export default ({ config }) => () => {
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
    <MainContainer>
      <JssProvider jss={jss}>
        <App {...props} />
      </JssProvider>
    </MainContainer>
  )
}
