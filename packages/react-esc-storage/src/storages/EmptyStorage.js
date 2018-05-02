export default class EmptyStorage {

  constructor(storageType) {
    this.storageType = storageType
  }

  error = () => {
    console.warn(`"${this.storageType}" is not an valid storage provider! Or provider is not found`)

    return null
  }

  get = this.error

  set = this.error

  remove = this.error

  has = this.error

}
