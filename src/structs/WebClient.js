const Discord = require('discord.js')
const getConfig = require('../config.js').get
const connectDatabases = require('../util/connectDatabases.js')
const createLogger = require('../util/logger/create.js')

class WebClient {
  constructor () {
    this.log = createLogger('-')
    this.config = getConfig()
    /**
     * @type {import('redis').RedisClient}
     */
    this.redisClient = null
  }
  async login (token) {
    try {
      this.redisClient = await connectDatabases(this.config, '-')
      const client = new Discord.Client()
      await client.login(token)
      this.log = createLogger(client.shard.ids[0])
      this.registerListeners()
      await this.initialize()
      client.shard.send('complete')
    } catch (err) {
      throw err
    }
  }

  registerListeners () {

  }

  async initialize () {

  }
}

module.exports = WebClient
