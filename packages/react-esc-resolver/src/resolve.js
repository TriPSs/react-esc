import React from 'react'
import Resolver from './Resolver'
import { capitalize } from '../../shared'

export default (prop, promise, cache = true, cacheValid = null) => {

  const asyncProps = (typeof prop === 'object')
    ? prop
    : { [prop]: promise }

  const asyncNames = Object.keys(asyncProps).map(capitalize).join('')

  const cacheEnabled = (typeof prop === 'object' && typeof promise === 'boolean')
    ? promise
    : (
      typeof cache === 'function'
        ? true
        : cache
    )

  const cacheValidator = (typeof cache === 'function')
    ? cache
    : cacheValid

  return Component => class extends React.Component {

    static displayName = `${asyncNames}Resolver`

    render() {
      return (
        <Resolver
          props={this.props}
          resolve={asyncProps}
          cache={cacheEnabled}
          cacheValidator={cacheValidator}>
          {(resolved) => <Component {...resolved} />}
        </Resolver>
      )
    }

  }

}
