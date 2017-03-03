import React from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'

const HAS_RESOLVED = 'ReactResolver.HAS_RESOLVED'
const IS_CLIENT    = 'ReactResolver.IS_CLIENT'

export default class Resolver extends React.Component {

  static childContextTypes = {
    // resolver: React.PropTypes.instanceOf(Resolver)
    resolver: React.PropTypes.object
  }

  static contextTypes = {
    // resolver: React.PropTypes.instanceOf(Resolver)
    resolver: React.PropTypes.object
  }

  static defaultProps = {
    props  : {},
    resolve: {},
  }

  static displayName = 'Resolver'

  static propTypes = {
    children: React.PropTypes.func.isRequired,
    props   : React.PropTypes.object,
    resolve : React.PropTypes.object
  }

  static renderClient = function (render, node) {
    ReactDOM.render((
      <Resolver>
        {render}
      </Resolver>
    ), node)
  }

  static renderServer = function (render, initialData = {}) {
    const queue = []

    renderToStaticMarkup(
      <Resolver onResolve={(promise) => {
        queue.push(promise)

        return Promise.resolve(true)
      }}>
        {render}
      </Resolver>
    )

    return Promise.all(queue).then((results) => {
      const formatResults = {}
      results.forEach(item => {
        return Object.keys(item).forEach(key => {
          formatResults[key] = item[key]
        })
      })

      const data = { ...initialData, ...formatResults }

      if (Object.keys(initialData).length < Object.keys(data).length)
        return Resolver.renderServer(render, data)

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

  constructor(props, context) {
    super(props, context)

    // Internal tracking variables
    this[HAS_RESOLVED] = false
    this[IS_CLIENT]    = false

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
      if (props.hasOwnProperty(resolve))
        return props[resolve]

      else if (this.context.resolver)
        return this.context.resolver.cached(resolve)
    }

    return null
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
      resolved: { ...this.state.resolved, ...resolved },
    }

    this.setAtomicState(nextState)
  }

  computeState(thisProps, nextState) {
    const { resolve, props } = thisProps

    Object.keys(resolve).forEach(name => {
      const cached = this.cached(name)

      if (!nextState.resolved.hasOwnProperty(name) && !nextState.pending.hasOwnProperty(name) && !cached) {
        const factory           = resolve[name]
        nextState.pending[name] = factory(props)

      } else if (cached)
        nextState.resolved[name] = cached

    })

    return nextState
  }

  getChildContext() {
    return { resolver: this }
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
    if (this.props.onResolve)
      return this.props.onResolve(state)

    else if (this.context.resolver)
      return this.context.resolver.onResolve(state)

    else
      return state
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
      ...this.state.resolved,
      ...this.props.props,
      props: this.props.props
    })
  }

  resolve(state) {
    const pending = Object.keys(state.pending).map(name => {
      const promise = state.pending[name]

      return { name, promise }
    })

    const promises = pending.map(({ promise }) => promise)

    let resolving = Promise.all(promises).then((values) => {
      return values.reduce((resolved, value, i) => {
        const { name } = pending[i]

        resolved[name] = value

        return resolved
      }, {})
    })

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
      this.resolve(nextState)

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
