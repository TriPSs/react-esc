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

## [License](https://github.com/tripss/react-esc-resolver/blob/master/LICENSE)

> Internet Systems Consortium license
> ===================================
>
> The MIT License (MIT)
>  
> Copyright (c) 2015 David Zukowski
>  
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>  
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>  
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

## Collaboration

If you have questions or issues, please [open an issue](https://github.com/TriPSs/react-esc-resolver/issues)!