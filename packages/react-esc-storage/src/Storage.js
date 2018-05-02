import { hasOwnProperty, canUseDom } from '../../shared'
import CookieStorage from './storages/CookieStorage'
import SessionStorage from './storages/SessionStorage'
import LocalStorage from './storages/LocalStorage'
import EmptyStorage from './storages/EmptyStorage'

export default new (class Storage {

  COOKIE = 'cookie'
  LOCAL = 'local'
  SESSION = 'session'

  cookieStorage = null

  setCookieStorage = (storage) => {
    this.cookieStorage = storage
  }

  getStorage = (storageType) => {
    switch (storageType) {

      case this.COOKIE:
        if (this.cookieStorage !== null) {
          return this.cookieStorage

        } else if (canUseDom()) {
          return new CookieStorage(document.cookie, true)
        }

      case this.SESSION:
        return new SessionStorage()

      case this.LOCAL:
        return new LocalStorage()

      default:
        return new EmptyStorage(storageType)
    }
  }

  get = (storageType, name, options = {}) => {
    const storage = this.getStorage(storageType)
    const value = storage.get(name, options)

    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  set = (storageType, name, givenValue, options = {}) => {
    const storage = this.getStorage(storageType)
    const value = JSON.stringify(givenValue)

    storage.set(name, value, options)
  }

  remove = (storageType, name, options = {}) => this.getStorage(storageType).remove(name, options)

  has = (storageType, name, options = {}) => this.getStorage(storageType).has(name, options)

})()
