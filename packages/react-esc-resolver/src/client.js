import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, hasOwnProperty, canUseDom } from '../../shared'

import Resolver from './Resolver'

export default (prop, Loader, promise = null) => {

  const loadProps = (typeof prop === 'string') ? [prop] : prop
  const names = loadProps.map(capitalize).join('')

  return Component => class extends React.Component {

    static displayName = `${names}ClientResolver`

    static contextTypes = {
      resolver: PropTypes.instanceOf(Resolver),
    }

    constructor(props, context) {
      super(props, context)

      this.queue = []
      this.state = {
        bypass: (!canUseDom() && !promise) || process.env.NODE_ENV === 'test',
        loaded: this.isLoaded(props),
      }
    }

    componentDidMount() {
      if (promise) {
        promise(this.props)
      }
    }

    enqueue = (promise) => {
      this.queue.push(promise)

      return promise
    }

    isLoaded = () => {
      let loaded = true

      loadProps.forEach((prop) => {
        if (!hasOwnProperty(this.props, prop) || !this.props[prop]) {
          loaded = false
        }
      })

      return loaded
    }

    render() {
      const { bypass } = this.state

      if (bypass || this.isLoaded()) {
        return <Component {...this.props} />
      }

      return (
        <React.Fragment>

          <Loader />

          {!promise && (
            <div style={{ display: 'none' }}>
              <Resolver onResolve={this.enqueue}>
                {(resolved) => <Component {...this.props} {...resolved} />}
              </Resolver>
            </div>
          )}

        </React.Fragment>
      )
    }
  }
}
