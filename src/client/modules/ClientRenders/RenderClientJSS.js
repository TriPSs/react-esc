import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { JssProvider, SheetsRegistry, jss } from 'react-jss'

import createGenerateClassName from '../JSS/createGenerateClassName'
import MainContainer from '../../containers/MainContainer'

export default ({ Component, store, layout, config }) => () => {
  // Create a sheetsRegistry instance.
  const sheetsRegistry = new SheetsRegistry()

  let options = {
    createGenerateClassName,
  }

  if (config.jss && config.jss.options) {
    options = {
      ...options,
      ...config.jss.options
    }
  }

  jss.setup(options)

  return (
    <Provider {...{ store }}>
      <Router>
        <AppContainer>
          <MainContainer>
            <JssProvider registry={sheetsRegistry} jss={jss}>
              <Component {...{
                store,
                layout,
              }} />
            </JssProvider>
          </MainContainer>
        </AppContainer>
      </Router>
    </Provider>
  )
}