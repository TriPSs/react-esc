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
  // Store Instantiation and HMR Setup
  // ======================================================
  const reducers = require(store.reducersLoc).default
  return createStore(
    reducers(),
    (typeof window !== 'undefined' ? window.___INITIAL_STATE__ : {}),
    compose(
      applyMiddleware(...middleware),
    ),
  )
}
