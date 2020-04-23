const Discord = require('discord.js')
const Base = require('./Base.js')
const promisify = require('util').promisify

class User extends Base {
  constructor (id, keysToFetch) {
    super(id, keysToFetch)
    this.username = ''
    this.displayAvatarURL = ''
    this.discriminator = ''
  }

  async retrieve (redisClient) {
    const data = await User.utils.get(redisClient, this.id)
    this._fetched = true
    if (!data) return
    this.exists = true
    this.username = data.username
    this.displayAvatarURL = data.displayAvatarURL
    this.discriminator = data.discriminator
  }

  static get utils () {
    return {
      REDIS_KEYS: {
        user: userId => { // This is a HASH. Users with their data that have been cached.
          if (!userId) throw new TypeError('User ID must be provided')
          return `drss_user_${userId}`
        }
      },
      JSON_KEYS: ['username', 'displayAvatarURL', 'discriminator', 'id'],
      recognize: async (redisClient, user) => {
        if (!(user instanceof Discord.User)) throw new TypeError('User is not instance of Discord.User')
        const toStore = {}
        this.utils.JSON_KEYS.forEach(key => {
          // MUST be a flat structure
          if (key === 'displayAvatarURL') {
            toStore[key] = user[key]({
              format: 'png'
            }) || ''
          } else {
            toStore[key] = user[key] || ''
          }
        })
        return promisify(redisClient.hmset).bind(redisClient)(this.utils.REDIS_KEYS.user(user.id), toStore)
      },
      update: async (redisClient, oldUser, newUser) => {
        if (!(oldUser instanceof Discord.User) || !(newUser instanceof Discord.User)) throw new TypeError('User is not instance of Discord.User')
        const exists = await promisify(redisClient.exists).bind(redisClient)(this.utils.REDIS_KEYS.user(newUser.id))
        if (!exists) return User.utils.recognize(redisClient, newUser)
        const toStore = {}
        this.utils.JSON_KEYS.forEach(key => {
          if (key === 'displayAvatarURL') {
            const oldAvatar = oldUser[key]({
              format: 'png'
            })
            const newAvatar = newUser[key]({
              format: 'png'
            })
            if (oldAvatar !== newAvatar) {
              toStore[key] = newAvatar
            }
          } else if (newUser[key] !== oldUser[key]) {
            toStore[key] = newUser[key]
          }
        })
        if (Object.keys(toStore).length === 0) {
          return 0
        }
        const promises = []
        for (const key in toStore) {
          const val = toStore[key]
          promises.push(promisify(redisClient.hset).bind(redisClient)(this.utils.REDIS_KEYS.user(newUser.id), key, val))
        }
        await Promise.all(promises)
      },
      get: async (redisClient, userId) => {
        if (!userId || typeof userId !== 'string') throw new TypeError('userId not a valid string')
        return promisify(redisClient.hgetall).bind(redisClient)(this.utils.REDIS_KEYS.user(userId))
      },
      getValue: async (redisClient, userId, key) => {
        if (!this.utils.JSON_KEYS.includes(key)) throw new Error('Unknown key for role:', key)
        if (!userId || !key) throw new TypeError('userId or key is undefined')
        return promisify(redisClient.hget).bind(redisClient)(this.utils.REDIS_KEYS.user(userId), key)
      }
    }
  }
}

module.exports = User
