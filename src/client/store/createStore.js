import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

export default (initialState = {}, history, config) => {

  const { reducers, middlewares, custom_enhancers } = config

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk
  ]

  // Check if the logger middleware is enabled in the config
  if (middlewares.logger && middlewares.logger.enabled) {
    const loggerOptions = middlewares.logger.options || {}
    const createLogger  = require('redux-logger')
    const logger        = createLogger(loggerOptions)

    middleware.push(logger)
  }

  // ======================================================
  // Add all custom middlewares
  // ======================================================
  // Add from the folder if enabled
  if (middlewares.byFolder) {
    const customMiddlewares = require('store/middleware').default()

    customMiddlewares.forEach(customMiddleware => {
      middleware.push(customMiddleware)
    })
  }

  // Add from the collection if there are any
  if (middlewares.collection && middlewares.collection.length > 0) {
    middlewares.collection.forEach(customMiddleware => {
      middleware.push(customMiddleware)
    })
  }

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEBUG__ && typeof window !== 'undefined' && window) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // Add the custom enhancers
  if (custom_enhancers.length > 0) {
    custom_enhancers.forEach(enhancer => {
      enhancers.push(enhancer)
    })
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('store/reducers', () => {
      const reducers = require('store/reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
