// @remove-file-on-eject
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader';

import createStore from './store/createStore'
import { Resolver } from 'react-esc-resolver'
import Storage from 'react-esc-storage'
import { Provider } from 'react-redux'
import defaultConfig from '../config/default.client'

export default (givenConfig) => {
  const config = { ...defaultConfig, ...givenConfig }

  const { defaultLayout } = config
  const Root              = require('containers/AppContainer').default
  const store             = createStore(config)

  // ========================================================
  // Render Setup
  // ========================================================
  const MOUNT_NODE = document.getElementById('root')

  let render = (Component) => {
    // Set global that the client is rendering
    global.isServer = false
    global.isClient = true

    // Checks if the Cookie storage is available, if not it will create it
    Storage.check()

    const layout = { ...defaultLayout, ...(window.___LAYOUT__ || {}) }

    Resolver.renderClient(
      () => (
        <Provider {...{ store }}>
          <Router>
            <AppContainer>
              <Component {...{
                store,
                layout
              }} />
            </AppContainer>
          </Router>
        </Provider>
      ),
      MOUNT_NODE
    )
  }

  // Enable HMR and catch runtime errors in RedBox
  // This code is excluded from production bundle
  if (__DEV__ && module.hot) {
    const renderApp   = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = (Root) => {
      try {
        renderApp(Root)
      } catch (error) {
        renderError(error)
      }
    }

    module.hot.accept('containers/AppContainer', () => {
      const NextRoot = require('containers/AppContainer').default;

      render(NextRoot)
    })
  }

  render(Root)
}
