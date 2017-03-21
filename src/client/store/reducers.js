import { combineReducers } from 'redux'

// Fix: "React-Redux: Combining reducers: Unexpected Keys"
// http://stackoverflow.com/a/33678198/789076
const initialReducers = {}

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    // Add sync reducers here
    ...initialReducers,
    ...asyncReducers
  })
}

export default makeRootReducer
