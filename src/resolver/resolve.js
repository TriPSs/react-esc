import React from 'react'
import Resolver from './Resolver'

const capitalize = (word) => {
  return word.replace(/^./, (letter) => letter.toUpperCase());
};

export default function resolve(prop, promise) {

  const asyncProps = (arguments.length === 1) ? prop : { [prop]: promise };
  const asyncNames = Object.keys(asyncProps).map(capitalize).join("");

  return function resolveDecorator(Component) {
    return class PropResolver extends React.Component {

      static displayName = `${asyncNames}Resolver`

      render() {
        return (
          <Resolver props={this.props} resolve={asyncProps}>
            {(resolved) => <Component {...this.props} {...resolved} />}
          </Resolver>
        )
      }
    }
  }
}
