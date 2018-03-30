// @flow
import warning from 'warning'
import { canUseDom, hasOwnProperty } from '../../../shared'

export default class LocalStorage {

  error = () => {
    warning(`"localStorage" is not available on a server!`)
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
