import { combineReducers } from 'redux'

export const makeRootReducer = asyncReducers => combineReducers({
  // Add sync reducers here
  ...asyncReducers,
})

export default makeRootReducer
