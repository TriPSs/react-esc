import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import defaultConfig from '../config/default.client'
import { useRouterHistory, match } from 'react-router'
import createStore from './store/createStore'
import { Resolver } from '../resolver'
import Storage from 'react-esc-storage'
import { Provider } from 'react-redux'

export default (givenConfig) => {
  const config = { ...defaultConfig, ...givenConfig }

  const { defaultLayout } = config

  const AppContainer = require('containers/AppContainer').default

  // ========================================================
  // Store and History Instantiation
  // ========================================================
  // Create redux store and sync with react-router-redux. We have installed the
  // react-router-redux reducer under the routerKey "router" in src/routes/index.js,
  // so we need to provide a custom `selectLocationState` to inform
  // react-router-redux of its location.
  const store = createStore(config)

  // ========================================================
  // Render Setup
  // ========================================================
  const MOUNT_NODE = document.getElementById('root')

  let render = (routerKey = null) => {
    // Set global that the client is rendering
    global.isServer = false
    global.isClient = true

    // Checks if the Cookie storage is available, if not it will create it
    Storage.check()

    const layout = { ...defaultLayout, ...(window.___LAYOUT__ || {}) }

    Resolver.renderClient(
      () => (
        <Provider store={store}>
          <BrowserRouter>
            <AppContainer
              {...{
                store,
                layout
              }} />
          </BrowserRouter>
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

    render = () => {
      try {
        renderApp(Math.random())
      } catch (error) {
        renderError(error)
      }
    }

    module.hot.accept(['routes'], () => render())
  }

  render()
}
