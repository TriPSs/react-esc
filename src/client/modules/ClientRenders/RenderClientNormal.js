import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

export default ({ Component, store, layout }) => () => (
  <Provider {...{ store }}>
    <Router>
      <AppContainer>
        <Component {...{
          store,
          layout
        }} />
      </AppContainer>
    </Router>
  </Provider>
)
