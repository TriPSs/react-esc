import React from 'react'
import { Route, Switch } from 'react-router'
import withStyles from 'react-jss'

export const styles = {

  root: {
    backgroundColor: 'black',
  },

}

export const AppContainer = ({ classes }) => (
  <div className={classes.root}>
    APPS sads
  </div>
)

export default withStyles(styles)(AppContainer)
