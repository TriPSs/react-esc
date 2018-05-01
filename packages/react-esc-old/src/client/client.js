import React from 'react'
import ReactDOM from 'react-dom'
import deepMerge from 'deepmerge'
import { hot } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { CookiesProvider, cookies } from 'react-cookie'
import { Resolver } from 'react-esc-resolver'

import createStore from './store/createStore'
import defaultConfig from '../config/default.client'

export default new (class Client {

  config = defaultConfig

  setRenderMethod = method => this.renderMethod = method(this.config)

  setup = config => this.config = deepMerge(this.config, config)

  renderMethod = config => (App, ...props) => <App {...props} />

  renderWithRedBox = (App, ...props) => {
    const renderApp = this.renderMethod(this.config)

    let render = renderApp

    // Enable HMR and catch runtime errors in RedBox
    // This code is excluded from production bundle
    if (__DEV__ && module.hot) {
      const renderError = (error) => {
        const RedBox = require('redbox-react').default

        ReactDOM.render(
          <RedBox error={error} />,
          this.config.app.mountPoint.id,
        )
      }

      render = (hotApp, ...hotProps) => {
        try {
          renderApp(hotApp, ...hotProps)

        } catch (error) {
          renderError(error)
        }
      }
    }

    render(App, ...props)
  }

  render = (App) => {
    const layout = { ...(window.___LAYOUT__ || {}) }

    const store = createStore(this.config, cookies)

    Resolver.renderClient(hot(module)(() => (
        <Provider {...{ store }}>
          <Router>
            <CookiesProvider>

              {this.renderWithRedBox(App, store, layout)}

            </CookiesProvider>
          </Router>
        </Provider>
      )),
      this.config.app.mountPoint.id,
    )
  }

})()
