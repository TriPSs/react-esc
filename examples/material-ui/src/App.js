import React from 'react'
import withStyles from 'react-jss'

export const styles = {

  root: {
    backgroundColor: 'black',
    color          : 'white',
  },

}

export const App = ({ classes }) => (
  <div className={classes.root}>
    APPS
  </div>
)

export default withStyles(styles)(App)
