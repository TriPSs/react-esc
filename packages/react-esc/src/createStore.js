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
      cookies
    }).forEach(customMiddleware => {
      middleware.push(customMiddleware)
    })
  }

  // Add from the collection if there are any
  if (store.middleware.collection && store.middleware.collection.length > 0) {
    store.middleware.collection.forEach(customMiddleware => {
      middleware.push(customMiddleware)
    })
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const reducers = require('store/reducers').default

  return createStore(
    reducers(),
    (typeof window !== 'undefined' ? window.___INITIAL_STATE__ : {}),
    compose(
      applyMiddleware(...middleware),
    ),
  )
}
