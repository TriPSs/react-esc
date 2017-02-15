/**
 * Created by tycho on 14/02/2017.
 */
import CookieStorage from './CookieStorage'

export const COOKIE  = 'cookie'
export const LOCAL   = 'local'
export const SESSION = 'session'

export const check = () => {
  if (!global.hasOwnProperty('cookie')) {
    global.cookie = new CookieStorage(document.cookie, true)
  }
}

export const get = (storageType, name, options = {}) => {
  let get = null

  if (storageType === COOKIE) {
    if (global.hasOwnProperty('cookie')) {
      get = global.cookie.get(name, options)
    }
  } else if (supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
    get = window[`${storageType}Storage`][name]
  }

  if (get)
    return JSON.parse(get)

  return get
}

export const set = (storageType, name, value, options = {}) => {
  let stringValue = JSON.stringify(value)

  if (storageType === COOKIE) {
    if (global.hasOwnProperty('cookie')) {
      return global.cookie.set(name, stringValue, options)
    }

  } else if (supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
    window[`${storageType}Storage`][name] = stringValue
  }
}

export const supportsStorage = () => {
  return typeof (Storage) !== 'undefined'
}
