import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'

export default ({ store }, cookies) => {

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument({
      cookies,
    }),
  ]

  // ======================================================
  // Add all custom middlewares
  // ======================================================
  // Add from the folder if enabled
  if (store.middleware.byFolder) {
    // Also give cookies with the function so middelwares can also use cookiesun
    require('store/middleware').default({
      cookies,
    }).forEach(mw => middleware.push(mw))
  }

  // Add from the collection if there are any
  if (store.middleware.collection && store.middleware.collection.length > 0) {
    store.middleware.collection.forEach(mw => middleware.push(mw))
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
  if (store.enhancers.length > 0) {
    store.enhancers.forEach(enh => enhancers.push(enh))
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const reducers = require('store/reducers').default
  const reduxStore = createStore(
    reducers(),
    (typeof window !== 'undefined' ? window.___INITIAL_STATE__ : {}),
    compose(
      applyMiddleware(...middleware),
      ...enhancers,
    ),
  )

  reduxStore.asyncReducers = {}
  if (module.hot) {
    module.hot.accept('store/reducers', () => {
      const hotReducers = require('store/reducers').default
      reduxStore.replaceReducer(hotReducers(reduxStore.asyncReducers))
    })
  }

  return reduxStore
}
