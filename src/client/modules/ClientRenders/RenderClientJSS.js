import React from 'react'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import MainContainer from '../../containers/MainContainer'

export const renderNormal = ({ Component, store, layout }) => () => (
  <Provider {...{ store }}>
    <Router>
      <AppContainer>
        <MainContainer>
          <Component {...{
            store,
            layout
          }} />
        </MainContainer>
      </AppContainer>
    </Router>
  </Provider>
)

export default renderNormal