import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'

export default (initialState = {}, history, config) => {

  const {reducers, middlewares} = config

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk,
    routerMiddleware(history)
  ]

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
  if (middlewares.collection.length > 0) {
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

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    reducers(),
    initialState,
    compose(
      applyMiddleware(...middleware),
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
