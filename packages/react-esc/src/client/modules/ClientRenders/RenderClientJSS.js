import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { jss, JssProvider } from 'react-jss'
import { CookiesProvider } from 'react-cookie'

import createGenerateClassName from '../JSS/createGenerateClassName'
import MainContainer from '../../containers/MainContainer'

export default ({ Component, store, layout, config }) => () => {
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

  return (
    <AppContainer>
      <Provider {...{ store }}>
        <Router>
          <MainContainer>
            <JssProvider jss={jss}>
              <CookiesProvider>
                <Component {...{
                  store,
                  layout,
                }} />
              </CookiesProvider>
            </JssProvider>
          </MainContainer>
        </Router>
      </Provider>
    </AppContainer>
  )
}
