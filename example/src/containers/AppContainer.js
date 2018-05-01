import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'react-jss'
import Helmet from 'react-helmet'

const theme = {
  colorPrimary: 'rgb(25, 200, 25)',
}

export const AppContainer = ({ layout }) => (
  <ThemeProvider theme={theme}>
    <div style={{ height: '100%' }}>
      <Helmet {...layout} />

      TEST

    </div>
  </ThemeProvider>
)

AppContainer.propTypes = {
  layout: PropTypes.object.isRequired,
  store : PropTypes.object.isRequired,
}


export default AppContainer
