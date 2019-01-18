# React-ESC-Resolver 
![https://img.shields.io/npm/v/react-esc-resolver.svg](https://img.shields.io/npm/v/react-esc-resolver.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dt/react-esc-resolver.svg?maxAge=2592000&style=flat-square)](https://npm-stat.com/charts.html?package=react-esc-resolver) [![](https://img.shields.io/github/issues-raw/tripss/react-esc-resolver.svg?style=flat-square)](https://github.com/tripss/react-esc-resolver/issues) [![](https://img.shields.io/david/tripss/react-esc-resolver.svg?style=flat-square)](https://david-dm.org/tripss/react-esc-resolver#info=dependencies)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tripss/react-esc-resolver.svg)](http://isitmaintained.com/project/tripss/react-esc-resolver "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/tripss/react-esc-resolver.svg)](http://isitmaintained.com/project/tripss/react-esc-resolver "Percentage of issues still open")

> Async-rendering & data-fetching for universal React applications.

###### This project is based on [react-resolver](https://github.com/ericclemmons/react-resolver)
React ESC Resolver lets you **define data requirements _per-component_**
and will **handle the nested, async rendering on both the server & client for you.**

For example, the following will load & provide `this.props.user` for the
`UserProfile` component:

```js
import { resolve } from 'react-esc-resolver';

@resolve('user', function(props) {
  return http.get(`/api/users/${props.params.userId}`);
})
class UserProfile extends React.Component {
  render() {
    const { user } = this.props;
    ...
  }
}
```

This is the equivalent to asynchronously loading `user` and providing it to
the component as if it were provided directly:

```xml
<UserProfile user={user} />
```

This makes components _pure_, _stateless_, and _easy to test_ as a result.


### Installation
```shell
$ npm install --save react-esc-resolver
```

## Development

If you'd like to contribute to this project, all you need to do is clone
this project and run:

```shell
$ npm install
```
You can use `npm link` to use your development version in your own project:
- Go to `react-esc-resolver` directory and execute command `npm link`
- Go to your project directory and execute command `npm link react-esc-resolver`

## [License](https://github.com/tripss/react-esc/blob/master/LICENSE)

React ESC is [MIT licensed](./LICENSE).

## Collaboration

If you have questions or [issues](https://github.com/TriPSs/react-esc/issues), please [open an issue](https://github.com/TriPSs/react-esc/issues/new?title=[Resolver])!
