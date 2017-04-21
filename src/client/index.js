import React from 'react'
import ReactDOM from 'react-dom'
import defaultConfig from '../config/default.client'
import createBrowserHistory from 'react-router/lib/browserHistory'
import { browserHistory, match } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import createStore from './store/createStore'
import { Resolver } from 'react-esc-resolver'
import Storage from 'react-esc-storage'

export default (givenConfig) => {
  const config = { ...defaultConfig, ...givenConfig }

  const { defaultLayout } = config

  let { AppContainer, loadFile, fallback }    = config

  if (!AppContainer) {
    if (loadFile.AppContainer) {
      AppContainer = require('containers/AppContainer').default

    } else {
      AppContainer = fallback.AppContainer
    }
  }

  // ========================================================
  // Browser History Setup
  // ========================================================
  /*const browserHistory = useRouterHistory(createBrowserHistory)({
    basename: __BASENAME__
  })*/

  // ========================================================
  // Store and History Instantiation
  // ========================================================
  // Create redux store and sync with react-router-redux. We have installed the
  // react-router-redux reducer under the routerKey "router" in src/routes/index.js,
  // so we need to provide a custom `selectLocationState` to inform
  // react-router-redux of its location.
  const initialState = window.___INITIAL_STATE__
  const store        = createStore(initialState, browserHistory, config)
  /*const history      = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.router
  })*/

  // ========================================================
  // Render Setup
  // ========================================================
  const MOUNT_NODE = document.getElementById('root')

  let render = (routerKey = null) => {
    const routes = require('routes').default(store)

    match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
      // TODO:: Error handling should be improved
      if (error) {
        console.log(error)
        return
      }

      // Set global that the client is rendering
      global.isServer = false
      global.isClient = true

      // Checks if the Cookie storage is available, if not it will create it
      Storage.check()

      const layout = { ...defaultLayout, ...(window.___LAYOUT__ || {}) }
      Resolver.renderClient(
        () => <AppContainer
          {...renderProps}
          store={store}
          history={browserHistory}
          routes={routes}
          routerKey={routerKey}
          layout={layout}
        />,
        MOUNT_NODE
      )

    })
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
