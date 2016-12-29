import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import makeRootReducer from './reducers'

export default (initialState = {}, history, reducers) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, routerMiddleware(history)]


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
