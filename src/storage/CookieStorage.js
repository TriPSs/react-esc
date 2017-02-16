/**
 * Created by tycho on 14/02/2017.
 */
export class CookieStorage {

  cookies  = null
  isString = false

  defaultOptions = {
    path    : '/',
    secure  : false,
    httpOnly: false,
    domain  : null,
    expires : null
  }

  constructor(cookies, isString = false) {
    this.isString = isString

    if (!isString) {
      this.cookies  = cookies
    } else {
      this.cookies = this.parseCookieString(cookies)
    }
  }

  get = (name, options) => {
    if (!this.isString)
      return this.cookies.get(name, options)

    else
      return this.cookies[name]

  }

  set = (name, value, options = {}) => {
    if (!this.isString) {
      this.cookies.set(name, value, { ...this.defaultOptions, ...options })

    } else if (typeof (document) !== 'undefined') {
      const options = { ...this.defaultOptions, ...options }
      let cookie    = `${name}=${value}`

      if (options.path)
        cookie += '; path=' + this.path

      if (options.expires)
        cookie += '; expires=' + this.expires.toUTCString()

      if (options.domain)
        cookie += '; domain=' + this.domain

      if (options.secure)
        cookie += '; secure'

      if (options.httpOnly)
        cookie += '; httponly'

      document.cookie = cookie
    }
  }

  has = (name, options) => {
    return typeof this.get(name, options) !== 'undefined'
  }

  refreshCookies = () => {
    // Only do this when whe are a string
    if (this.isString && typeof document != 'undefined') {
      this.cookies = this.parseCookieString(document.cookie)
    }
  }

  parseCookieString = (cookieString) => {
    const cookies = cookieString.split(';')

    let cookieObject = {}

    cookies.forEach(cookie => {
      const getNameValue = cookie.split('=')
      const name         = getNameValue[0].trim()

      cookieObject[name] = getNameValue[1].trim()
    })

    return cookieObject
  }
}

export default CookieStorage