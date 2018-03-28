import React from 'react'

export default class MainContainer extends React.Component {

  static displayName = 'MainContainer'

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
