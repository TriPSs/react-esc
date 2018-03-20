import React from 'react'
import Resolver from './Resolver'
import { capitalize } from './utils'

export default (prop, promise, cache = true) => {

  const asyncProps = (typeof prop === 'object') ? prop : { [prop]: promise }
  const asyncNames = Object.keys(asyncProps).map(capitalize).join('')
  const cacheEnabled = (typeof prop === 'object' && typeof promise === 'boolean') ? promise : cache

  return Component => class extends React.Component {

    static displayName = `${asyncNames}Resolver`

    render() {
      return (
        <Resolver props={this.props} resolve={asyncProps} cache={cacheEnabled}>
          {(resolved) => <Component {...resolved} />}
        </Resolver>
      )
    }

  }

}
