import { canUseDom, hasOwnProperty } from '../../../shared'

export default class LocalStorage {

  error = () => {
    console.warn(`"localStorage" is not available on a server!`)

    return null
  }

  get = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return localStorage.getItem(name)
  }

  set = (name, givenValue, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return localStorage.setItem(name, givenValue)
  }

  remove = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return localStorage.removeItem(name)
  }

  has = (name, options = {}) => {
    if (!this.available()) {
      return this.error()
    }

    return hasOwnProperty(localStorage, name)
  }

  available = () => canUseDom() && hasOwnProperty(window, 'localStorage') && typeof localStorage !== 'undefined'

}
