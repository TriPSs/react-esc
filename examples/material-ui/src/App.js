import React from 'react'
import Helmet from 'react-helmet'
import { CssBaseline, MuiThemeProvider, createMuiTheme, colors, Button } from '@material-ui/core'

// Create a theme instance.
const muiTheme = createMuiTheme({
  palette: {
    primary: colors.green,
    accent : colors.red,
    type   : 'light',
  },
})

export const App = ({ layout }) => (
  <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>

    <Helmet {...layout} />

    <CssBaseline />

    <div>
      <Button variant="contained" color="primary">
        Example
      </Button>
    </div>

  </MuiThemeProvider>
)

export default App
