# React-ESC-Storage 
![https://img.shields.io/npm/v/react-esc-storage.svg](https://img.shields.io/npm/v/react-esc-storage.svg?style=flat-square) [![npm downloads](https://img.shields.io/npm/dt/react-esc-storage.svg?maxAge=2592000&style=flat-square)](https://npm-stat.com/charts.html?package=react-esc-storage) [![](https://img.shields.io/github/issues-raw/tripss/react-esc-storage.svg?style=flat-square)](https://github.com/tripss/react-esc-storage/issues) [![](https://img.shields.io/david/tripss/react-esc-storage.svg?style=flat-square)](https://david-dm.org/tripss/react-esc-storage#info=dependencies)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/tripss/react-esc-storage.svg)](http://isitmaintained.com/project/tripss/react-esc-storage "Average time to resolve an issue") [![Percentage of issues still open](http://isitmaintained.com/badge/open/tripss/react-esc-storage.svg)](http://isitmaintained.com/project/tripss/react-esc-storage "Percentage of issues still open")

> Storage tool for React applications

React ESC Storage let's you **get and set cookies, local and session storage** in a easy to use way for client and and server

For example, setting a cookie, session or local storage.
```js
import Storage from 'react-esc-storage'

// Setting
Storage.set(Storage.COOKIE, 'token', { cookie: 'cookie content' })
Storage.set(Storage.SESSION, 'token', 'SESSION')
Storage.set(Storage.LOCAL, 'token', { local: true })

// Getting
Storage.get(Storage.COOKIE, 'token')
Storage.get(Storage.LOCAL, 'token')
Storage.get(Storage.SESSION, 'token')

// Check if exists
Storage.has(Storage.COOKIE, 'token')
Storage.has(Storage.LOCAL, 'token')
Storage.has(Storage.SESSION, 'token')

// Remove
Storage.remove(Storage.COOKIE, 'token')
Storage.remove(Storage.LOCAL, 'token')
Storage.remove(Storage.SESSION, 'token')

```
Objects will be automatically stringified when setting and parsed back when getting. 
- - -

Making the **Cookie Storage** available on the server. [Click here for an example](https://github.com/TriPSs/react-esc/blob/master/src/client/server.js#L38)
```js
import CookieStorage from 'react-esc-storage/CookieStorage'

match({ history, routes, location: ctx.req.url }, async(err, redirect, props) => {
         
  // Add Cookie to global so we can use it in the Storage module
  global.cookie = new CookieStorage(ctx.cookies)

})
```

Making the **Storage** available on the client. [Click here for an example](https://github.com/TriPSs/react-esc/blob/master/src/client/index.js#L56)
```js
import Storage from 'react-esc-storage'

match({ history, routes }, (error, redirectLocation, renderProps) => {
  
  // Checks if the Cookie storage is available, if not it will create it
  Storage.check()
  
})
```

### Installation
```shell
$ npm install --save react-esc-storage
```

## Development

If you'd like to contribute to this project, all you need to do is clone
this project and run:

```shell
$ npm install
```

You can use `npm link` to use your development version in your own project:
- Go to `react-esc-strorage` directory and execute command `npm link`
- Go to your project directory and execute command `npm link react-esc-storage`


## [License](https://github.com/tripss/react-esc/blob/master/LICENSE)

React ESC is [MIT licensed](./LICENSE).

## Collaboration

If you have questions or [issues](https://github.com/TriPSs/react-esc/issues), please [open an issue](https://github.com/TriPSs/react-esc/issues/new?title=[Storage])!
