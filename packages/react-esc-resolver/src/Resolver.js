import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import { hasOwnProperty } from './utils'

const HAS_RESOLVED = 'ReactResolver.HAS_RESOLVED'
const IS_CLIENT = 'ReactResolver.IS_CLIENT'

export default class Resolver extends React.Component {

  static childContextTypes = {
    resolver: PropTypes.object,
  }

  static contextTypes = {
    resolver: PropTypes.object,
  }

  static defaultProps = {
    props  : {},
    resolve: {},
  }

  static displayName = 'Resolver'

  static propTypes = {
    children: PropTypes.func.isRequired,
    props   : PropTypes.object,
    resolve : PropTypes.object,
  }

  static renderClient = (render, node) => {
    ReactDOM.hydrate((
      <Resolver>
        {render}
      </Resolver>
    ), node)
  }

  static renderServer = (render, initialData = {}) => {
    const queue = []

    renderToStaticMarkup(
      <Resolver onResolve={(promise) => {
        queue.push(promise)

        return Promise.resolve(true)
      }}>
        {render}
      </Resolver>,
    )

    return Promise.all(queue).then((results) => {
      const formatResults = {}
      results.forEach(item => {
        return Object.keys(item).forEach(key => {
          formatResults[key] = item[key]
        })
      })

      const data = { ...initialData, ...formatResults }

      if (Object.keys(initialData).length < Object.keys(data).length) {
        return Resolver.renderServer(render, data)
      }

      class Resolved extends React.Component {

        static displayName = 'Resolved'

        render() {
          return (
            <Resolver>
              {render}
            </Resolver>
          )
        }
      }

      return Resolved
    })
  }

  unMounted = true

  constructor(props, context) {
    super(props, context)

    // Internal tracking variables
    this[HAS_RESOLVED] = false
    this[IS_CLIENT] = false

    this.state = this.computeState(this.props, {
      pending : {},
      resolved: {},
    })

    if (this.isPending(this.state)) {
      this.resolve(this.state)
      this[HAS_RESOLVED] = false

    } else {
      this[HAS_RESOLVED] = true
    }
  }

  cached(resolve) {
    const { props, cache } = this.props

    if (cache || isServer) {
      if (hasOwnProperty(props, resolve)) {
        return props[resolve]

      } else if (this.context.resolver) {
        return this.context.resolver.cached(resolve)
      }
    }

    return null
  }

  componentWillMount() {
    this.unMounted = false
  }

  componentDidMount() {
    this[IS_CLIENT] = true
  }

  componentWillUnmount() {
    this.unMounted = true
  }

  componentWillReceiveProps(nextProps) {
    const { pending, resolved } = this.computeState(nextProps, this.state)

    // Next state will resolve async props again, but update existing sync props
    const nextState = {
      pending,
      resolved,
    }

    this.setAtomicState(nextState)
  }

  computeState(thisProps, state) {
    const { resolve } = thisProps
    let nextState = state

    Object.keys(resolve).forEach((name) => {
      const cached = this.cached(name)

      if (!hasOwnProperty(state.resolved, name) && !hasOwnProperty(state.pending, name) && !this.isValidCache(cached)) {
        nextState.pending[name] = resolve[name]

      } else if (cached) {
        nextState.resolved[name] = true
      }
    })

    return nextState
  }

  getChildContext() {
    return { resolver: this }
  }

  isValidCache(cache) {
    return (cache !== null) &&
           (typeof cache !== 'undefined') &&
           (typeof cache !== 'object' || Object.keys(cache).length > 0) &&
           (!Array.isArray(cache) || cache.length > 0)
  }

  isPending(state = this.state) {
    return Object.keys(state.pending).length > 0
  }

  isParentPending() {
    const { resolver } = this.context

    if (resolver) {
      return resolver.isPending() || resolver.isParentPending()
    }

    return false
  }

  onResolve(state) {
    if (this.props.onResolve) {
      return this.props.onResolve(state)

    } else if (this.context.resolver) {
      return this.context.resolver.onResolve(state)

    } else {
      return state
    }
  }

  render() {
    // Avoid rendering until ready
    if (!this[HAS_RESOLVED]) {
      return false
    }

    // If render is called again (e.g. hot-reloading), re-resolve
    if (this.isPending(this.state)) {
      this.resolve(this.state)
    }

    // Both those props provided by parent & dynamically resolved
    return this.props.children({
      ...this.props.props,
    })
  }

  resolve(state) {
    const { props } = this.props

    const pending = Object.keys(state.pending).map((name) => {
      const func = state.pending[name]

      return { name, func }
    })

    const promises = pending.map(({ func }) => func(props))

    let resolving = Promise.all(promises).then((values) => values.reduce((resolved, value, i) => {
      resolved[pending[i].name] = true

      return resolved
    }, {}))

    // Resolve listeners get the current resolved
    resolving = this.onResolve(resolving)

    // Update current component (on client)
    resolving.then((resolved) => {
      this[HAS_RESOLVED] = true

      if (!this[IS_CLIENT]) {
        return false
      }

      const nextState = {
        pending : {},
        resolved: { ...state.resolved, ...resolved },
      }

      this.setAtomicState(nextState)
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent updating when parent is changing values
    if (this.isParentPending()) {
      return false
    }

    // Prevent rendering until pending values are resolved
    if (this.isPending(nextState)) {
      return false
    }

    // Update if we have resolved successfully
    return this[HAS_RESOLVED]
  }

  setAtomicState(nextState) {
    if (this.unMounted) {
      return
    }

    this.setState(nextState)
  }

}
