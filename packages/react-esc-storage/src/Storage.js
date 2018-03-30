// @flow
import { hasOwnProperty } from '../../shared'
import CookieStorage from './storages/CookieStorage'
import EmptyStorage from './storages/EmptyStorage'

export default new (class Storage {

  COOKIE = 'cookie'
  LOCAL = 'local'
  SESSION = 'session'

  check = () => {
    if (!hasOwnProperty(global, 'cookie')) {
      global.cookie = new CookieStorage(document.cookie, true)

      return true
    }

    return false
  }

  getStorage = (storageType) => {
    if (storageType === this.cookie && hasOwnProperty(global, 'cookie')) {
      return global.cookie
    }

    return new EmptyStorage(storageType)
  }

  get = (storageType, name, options = {}) => {
    let get = null

    if (storageType === this.COOKIE) {
      if (hasOwnProperty(global, 'cookie')) {
        get = global.cookie.get(name, options)
      }

    } else if (this.supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
      get = window[`${storageType}Storage`].getItem(name)
    }

    if (get) {
      try {
        return JSON.parse(get)
      } catch (e) {
        return get
      }
    }

    return get
  }

  set = (storageType, name, value, options = {}) => {
    let stringValue = JSON.stringify(value)

    if (storageType === this.COOKIE) {
      if (global.hasOwnProperty('cookie')) {
        global.cookie.set(name, stringValue, options)
      }

    } else if (this.supportsStorage() && global.hasOwnProperty(`${storageType}Storage`)) {
      window[`${storageType}Storage`].setItem(name, stringValue)
    }
  }

  remove = (storageType, name, options = {}) => {
    if (storageType === this.COOKIE) {
      if (global.hasOwnProperty('cookie')) {
        return global.cookie.remove(name, options)
      }

    } else if (this.supportsStorage() && global.hasOwnProperty(`${storageType}Storage`)) {
      window[`${storageType}Storage`].removeItem(name)
    }
  }

  has = (storageType, name, options = {}) => {
    if (storageType === this.COOKIE) {
      if (global.hasOwnProperty('cookie')) {
        return global.cookie.has(name, options)
      }

    } else if (this.supportsStorage() && window.hasOwnProperty(`${storageType}Storage`)) {
      return window[`${storageType}Storage`].hasOwnProperty(name)
    }

    return false
  }

  supportsStorage = () => {
    return typeof localStorage !== 'undefined' && typeof sessionStorage !== 'undefined'
  }

})()
