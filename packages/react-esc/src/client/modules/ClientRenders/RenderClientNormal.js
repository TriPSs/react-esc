import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'

export const renderNormal = ({ Component, store, layout }) => () => (
  <AppContainer>
    <Provider {...{ store }}>
      <Router>
        <CookiesProvider>
          <Component {...{
            store,
            layout,
          }} />
        </CookiesProvider>
      </Router>
    </Provider>
  </AppContainer>
)

export default renderNormal
