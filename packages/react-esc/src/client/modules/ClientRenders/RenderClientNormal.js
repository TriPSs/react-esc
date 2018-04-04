import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

export const renderNormal = ({ Component, store, layout }) => () => (
  <AppContainer>
    <Provider {...{ store }}>
      <Router>
        <Component {...{
          store,
          layout,
        }} />
      </Router>
    </Provider>
  </AppContainer>
)

export default renderNormal
