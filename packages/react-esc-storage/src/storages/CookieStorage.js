// @flow
export default class CookieStorage {

  cookies = null
  isString = false

  defaultOptions = {
    path    : '/',
    secure  : false,
    httpOnly: false,
    domain  : null,
    expires : null,
  }

  constructor(cookies, isString = false) {
    this.isString = isString

    if (!isString) {
      this.cookies = cookies

    } else {
      this.cookies = this.parseCookieString(cookies)
    }
  }

  get = (name, givenOptions = {}) => {
    if (!this.isString) {
      return this.cookies.get(name, givenOptions)

    } else {
      return this.cookies[name]
    }
  }

  set = (name, value, givenOptions = {}) => {
    if (!this.isString) {
      this.cookies.set(name, value, { ...this.defaultOptions, ...givenOptions })

    } else if (typeof (document) !== 'undefined') {
      const options = { ...this.defaultOptions, ...givenOptions }
      let cookie = `${name}=${value}`

      if (options.path) {
        cookie += '; path=' + options.path
      }

      if (options.expires) {
        cookie += '; expires=' + options.expires.toUTCString()
      }

      if (options.domain) {
        cookie += '; domain=' + options.domain
      }

      if (options.secure) {
        cookie += '; secure'
      }

      if (options.httpOnly) {
        cookie += '; httponly'
      }

      document.cookie = cookie
    }
  }

  remove = (name, givenOptions = {}) => {
    const options = { ...this.defaultOptions, ...givenOptions, ...{ expires: new Date(1970, 1, 1) } }

    this.set(name, null, options)

    if (this.cookies[name]) {
      delete this.cookies[name]
    }
  }

  has = (name, givenOptions = {}) => typeof this.get(name, givenOptions) !== 'undefined'

  parseCookieString = (cookieString) => {
    const cookies = cookieString.split(';')

    let cookieObject = {}

    cookies.forEach(cookie => {
      const getNameValue = cookie.split('=')

      if (getNameValue.length > 1) {
        const name = getNameValue[0].trim()
        cookieObject[name] = getNameValue[1].trim()
      }
    })

    return cookieObject
  }
}
