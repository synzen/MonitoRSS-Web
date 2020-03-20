class Base {
  constructor (data = '', keysToFetch = []) {
    if (typeof data === 'string') {
      if (!data) throw new Error('ID must be defined')
      this.id = data
    } else if (typeof data === 'object') {
      this.id = data.id
    }

    this.exists = false
    this._fetched = false
    this._toFetch = keysToFetch
    this._fetchAll = keysToFetch.length === 0
  }

  async retrieve () {
    throw new Error('fetch must be implemented in subclasses')
  }

  toJSON () {
    if (!this.constructor.utils || !this.constructor.utils.JSON_KEYS) throw new Error('toJSON is unimplemented for subclass without utils.STORED_KEYS')
    const obj = {}
    for (const key of this.constructor.utils.JSON_KEYS) {
      obj[key] = this[key]
    }
    obj.id = this.id
    return obj
  }

  static async fetch (redisClient, data) {
    const subclass = new this(data)
    await subclass.retrieve(redisClient)
    if (!subclass._fetched) throw new Error('fetched field was not set to true after retrieve function called')
    return subclass.exists ? subclass : null
  }
}

module.exports = Base
