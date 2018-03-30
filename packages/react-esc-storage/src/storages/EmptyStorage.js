import warning from 'warning'

export default class EmptyStorage {

  constructor(storageType) {
    this.storageType = storageType
  }

  error = () => {
    warning(`"${this.storageType}" is not an valid storage provider! Or provider is not found`)
  }

  get = this.error

  set = this.error

  remove = this.error

  has = this.error

}
