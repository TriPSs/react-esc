import React from 'react'
import ReactDOM from 'react-dom'
import deepMerge from 'deepmerge'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import Cookie from 'universal-cookie'
import { BrowserRouter as Router } from 'react-router-dom'
import { Resolver } from 'react-esc-resolver'
import defaultConfig from 'react-esc-config/default.client'

import ClientRender from './render/ClientRender'

import createStore from './createStore'

import givenConfig from './config'

const config = deepMerge(defaultConfig, givenConfig)
const AppContainer = require('App').default
const store = createStore(config, new Cookie())
const MOUNT_NODE = document.getElementById(config.app.mountPoint.id)

let RenderClient = null

switch (config.render) {
  case 'react-esc-render-jss':
  case 'jss':
    ({ RenderClient } = require('react-esc-render-jss'))
    break

  default:
    RenderClient = ClientRender
}

const renderClass = new RenderClient(config)

const buildApp = App => {
  const layout = { ...(window.___LAYOUT__ || {}) }
  
  return (
    <Provider store={store}>
      <Router>
        <CookiesProvider>

          {renderClass.render(App, { layout })}

        </CookiesProvider>
      </Router>
    </Provider>
  )
}

let render = (App) => {
  if (typeof config.server === 'boolean' && !config.server) {
    ReactDOM.render(buildApp(App), MOUNT_NODE)

  } else {
    Resolver.renderClient(() => buildApp(App), MOUNT_NODE)
  }
}

// Catch runtime errors in RedBox
// This code is excluded from production bundle
if (__DEV__ && module.hot) {
  const renderApp = render
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
}

render(AppContainer)
