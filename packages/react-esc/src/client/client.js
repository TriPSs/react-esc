// @remove-file-on-eject
import React from 'react'
import ReactDOM from 'react-dom'
import { Resolver } from 'react-esc-resolver'

import renderMethods from './modules/ClientRenders'
import createStore from './store/createStore'
import Storage from 'react-esc-storage'
import defaultConfig from '../config/default.client'

export default (givenConfig) => {
  const config = { ...defaultConfig, ...givenConfig }

  const { defaultLayout } = config
  const Root              = require('containers/AppContainer').default
  const store             = createStore(config)

  // ========================================================
  // Render Setup
  // ========================================================
  const MOUNT_NODE   = document.getElementById('root')
  const renderMethod = config.compiler_render

  let render = (Component) => {
    // Set global that the client is rendering
    global.isServer = false
    global.isClient = true

    // Checks if the Cookie storage is available, if not it will create it
    Storage.check()

    const layout = { ...defaultLayout, ...(window.___LAYOUT__ || {}) }
    
    Resolver.renderClient(
      renderMethods[renderMethod]({ Component, store, layout, config }),
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