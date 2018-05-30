import React from 'react'
import { Route, Switch } from 'react-router'

export const AppContainer = () => (
  <div>
    APPS
    <Route component={() => <div>APP</div>} />
  </div>
)

export default AppContainer
