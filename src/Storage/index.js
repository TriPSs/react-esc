/**
 * Created by tycho on 14/02/2017.
 */
import CookieStorage from './CookieStorage'

export const check = () => {
  if (!global.hasOwnProperty('cookie')) {
    global.cookie = new CookieStorage(document.cookie, true)
  }
}

export const get = (storageType, name, options = {}) => {
  if (storageType === 'cookie') {
    if (global.hasOwnProperty('cookie')) {
      return global.cookie.get(name, options)
    }
  }

  if (supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
    return window[`${storageType}Storage`][name]
  }

  return null
}

export const set = (storageType, name, value, options = {}) => {
  if (storageType === 'cookie') {
    if (global.hasOwnProperty('cookie')) {
      return global.cookie.set(name, value, options)
    }
  }

  if (supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
    window[`${storageType}Storage`][name] = JSON.stringify(value)
  }
}

export const supportsStorage = () => {
  return typeof (Storage) !== 'undefined'
}
