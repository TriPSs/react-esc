import { canUseDom, hasOwnProperty } from '../../../shared'

export default class SessionStorage {

  error = () => {
    console.warn(`"sessionStorage" is not available on a server!`)

    return null
  }

  get = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return sessionStorage.getItem(name)
  }

  set = (name, givenValue, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return sessionStorage.setItem(name, givenValue)
  }

  remove = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return sessionStorage.removeItem(name)
  }

  has = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return hasOwnProperty(sessionStorage, name)
  }

  available = () => canUseDom() && hasOwnProperty(window, 'sessionStorage') && typeof sessionStorage !== 'undefined'

}
