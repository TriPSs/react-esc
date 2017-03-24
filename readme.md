# React-ESC ![https://img.shields.io/npm/v/react-esc.svg](https://img.shields.io/npm/v/react-esc.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dt/react-esc.svg?maxAge=2592000&style=flat-square)](https://npm-stat.com/charts.html?package=react-esc) [![](https://img.shields.io/github/issues-raw/tripss/react-esc.svg?style=flat-square)](https://github.com/tripss/react-esc/issues) [![](https://img.shields.io/david/tripss/react-esc.svg?style=flat-square)](https://david-dm.org/tripss/react-esc#info=dependencies)

> Easy to use Server and Client configuration

React ESC is a easy to use client and server configuration.
See [this repo](https://github.com/TriPSs/react-esc-example) on how to use React-ESC.

## Development

If you'd like to contribute to this project, you need to do is clone
[this repo](https://github.com/TriPSs/react-esc-example) and this project in the same directory and change following files:

**bin/server.js**
```js
import Server from 'react-esc/server'

// TO

import Server from '../../react-esc/src/server'
```

**src/client.js**
```js
import Client from 'react-esc/client'

// TO

import Client from '../../react-esc/src/client'
```

Or use `npm link`, example
- Go to `react-esc` directory and execute command `npm link`
- Go to `react-esc-example` directory and execute command `npm link react-esc`

## [License](https://github.com/tripss/react-esc/blob/master/LICENSE)

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

If you have questions or issues, please [open an issue](https://github.com/TriPSs/react-esc/issues)!