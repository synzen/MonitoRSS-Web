const Base = require('./Base.js')
const Channel = require('./Channel.js')
const Guild = require('./Guild.js')
const GuildMember = require('./GuildMember.js')
const Role = require('./Role.js')
const User = require('./User.js')
const promisify = require('util').promisify

const flushDatabase = async (redisClient) => {
  const keys = await promisify(redisClient.keys).bind(redisClient)('drss*')
  const multi = redisClient.multi()
  if (keys && keys.length > 0) {
    for (const key of keys) {
      multi.del(key)
    }
    return new Promise((resolve, reject) => multi.exec((err, res) => err ? reject(err) : resolve(res)))
  }
}

module.exports = {
  Base,
  Channel,
  Guild,
  GuildMember,
  Role,
  User,
  flushDatabase
}
