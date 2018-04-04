import React from 'react'
import PropTypes from 'prop-types'

export default class MainContainer extends React.Component {

  static propTypes = {
    children: PropTypes.oneOf([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
  }

  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side')

    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    return this.props.children
  }

}
