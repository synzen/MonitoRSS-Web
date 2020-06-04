const BearerRequestHandler = require('../util/BearerRequestHandler.js')
const roleServices = require('./role.js')
const RedisUser = require('../bot/structs/User.js')
const RedisGuildMember = require('../bot/structs/GuildMember.js')
const WebCache = require('../models/WebCache.js')
const getConfig = require('../config.js').get
const createLogger = (base) => require('../util/logger/create.js')(undefined, base)
const MANAGE_CHANNEL_PERMISSION = 16
const requestHandler = new BearerRequestHandler()

async function getCachedUser (id) {
  const cachedUser = await WebCache.Model.findOne({
    id,
    type: 'user'
  }).lean().exec()
  const log = createLogger({
    function: 'getCachedUser',
    userID: id,
    cachedUser
  })
  log.trace('Fetched Mongo-cached user')
  return cachedUser
}

async function getCachedUserGuilds (id) {
  const cachedGuilds = await WebCache.Model.findOne({
    id,
    type: 'guilds'
  }).lean().exec()
  const log = createLogger({
    function: 'getCachedUserGuilds',
    userID: id,
    cachedGuilds
  })
  log.trace('Fetched Mongo-cached guilds of user')
  return cachedGuilds
}

async function storeCachedUser (id, data) {
  const cached = new WebCache.Model({
    id,
    type: 'user',
    data
  })
  await cached.save()
  const log = createLogger({
    function: 'storeCachedUser',
    userID: id,
    cachedUser: cached
  })
  log.trace('Stored user in Mongo cache')
  return cached
}

async function storeCachedUserGuilds (id, data) {
  const cached = new WebCache.Model({
    id,
    type: 'guilds',
    data
  })
  const log = createLogger({
    function: 'storeCachedUser',
    userID: id,
    cachedGuilds: cached
  })
  log.trace('Stored guilds of user in Mongo cache')
  await cached.save()
  return cached
}

/**
 * @param {string} userID
 * @param {string} guildID
 * @param {import('redis').RedisClient} redisClient
 */
async function getMemberOfGuild (userID, guildID, redisClient) {
  const cachedMember = await RedisGuildMember.fetch(redisClient, {
    id: userID,
    guildID
  })
  const log = createLogger({
    function: 'getMemberOfGuild',
    userID,
    guildID,
    cachedMember
  })
  log.trace('Fetched cached member from Redis')
  return cachedMember ? cachedMember.toJSON() : null
}

async function getUser (userID, redisClient) {
  const cachedUser = await RedisUser.fetch(redisClient, userID)
  const log = createLogger({
    function: 'getMemberOfGuild',
    userID,
    cachedUser
  })
  log.trace('Fetched cached user from Redis')
  return cachedUser ? cachedUser.toJSON() : null
}

async function getUserByAPI (id, accessToken, skipCache) {
  const userLog = createLogger({
    function: 'getUserByAPI',
    userID: id
  })
  const cachedUser = id && !skipCache ? await getCachedUser(id) : null
  if (cachedUser) {
    userLog.debug({
      cachedUser
    }, 'Cached user was found, no need to fetch from Discord API')
    return cachedUser.data
  }
  userLog.debug('No cached user found, fetching from Discord HTTP API')
  userLog.info('[1 DISCORD API REQUEST] [USER] GET /api/users/@me')
  const data = await requestHandler.getWithBearer('/users/@me', accessToken)
  userLog.debug({
    response: data
  }, 'Got Discord HTTP API Resonse for user. Caching response into Mongo.')
  await storeCachedUser(data.id, data)
  return data
}

async function getGuildsByAPI (id, accessToken, skipCache) {
  const userLog = createLogger({
    function: 'getGuildsByAPI',
    userID: id
  })
  const cachedUserGuilds = !skipCache ? await getCachedUserGuilds(id) : null
  if (cachedUserGuilds) {
    userLog.debug({
      cachedGuilds: cachedUserGuilds
    }, 'Cached guilds were found, no need to fetch from Discord API')
    return cachedUserGuilds.data
  }
  userLog.debug('No cached guilds found, fetching from Discord HTTP API')
  userLog.info('[1 DISCORD API REQUEST] [USER] GET /api/users/@me/guilds')
  const data = await requestHandler.getWithBearer('/users/@me/guilds', accessToken)
  userLog.debug({
    response: data
  }, 'Discord HTTP API Response for user guilds. Caching response into Mongo.')
  await storeCachedUserGuilds(id, data)
  return data
}

/**
 * @param {Object<string, any>} guild - User guild data from API
 * @param {import('redis').RedisClient} redisClient
 * @returns {Promise<boolean>}
 */
async function hasGuildPermission (guild, config, redisClient) {
  const guildLog = createLogger({
    function: 'hasGuildPermission',
    guildID: guild.id
  })
  // User permission
  const isOwner = guild.owner
  const managesChannel = (guild.permissions & MANAGE_CHANNEL_PERMISSION) === MANAGE_CHANNEL_PERMISSION
  if (!isOwner && !managesChannel) {
    guildLog.debug(`Fetched user has insufficient permissions (${guild.permissions}). owner: ${isOwner}, manages channel: ${managesChannel}`)
    return false
  }
  // Bot permission - just has to be in guild
  guildLog.debug('Fetching bot member from Redis to determine bot permissions')
  const member = await getMemberOfGuild(config.bot.clientID, guild.id, redisClient)
  if (!member) {
    guildLog.debug(`Fetched user has sufficient permissions (${guild.permissions}), but bot has insufficient permissions (not in guild).`)
    return false
  }
  guildLog.debug(`Both user and bot has sufficient permissions (${guild.permissions}) for guild`)
  return true
}

/**
 * @param {string} userID
 * @param {string} guildID
 * @param {Object<string, any>} config
 * @param {import('redis').RedisClient} redisClient
 */
async function isManagerOfGuild (userID, guildID, config, redisClient) {
  const log = createLogger({
    function: 'isManagerOfGuild',
    userID,
    guildID
  })
  log.debug('Determining if user is manager of guild via Redis cache check')
  const member = await getMemberOfGuild(userID, guildID, redisClient)
  const isAdmin = config.adminIDs.includes(userID)
  const isManager = member && member.isManager
  if (isAdmin || isManager) {
    log.debug(`User is manager. bot admin: ${isAdmin}, is manager: ${isManager}`)
    return true
  }
  if (member) {
    log.debug('User is not a manager, but is a member')
    return false
  }
  // At this point, the member is not cached - so check the API
  log.debug('Unable to determine if user is manager of guild via Redis, they are not stored')
  return isManagerOfGuildByAPI(userID, guildID, redisClient)
}

/**
 * @param {string} userID
 * @param {string} guildID
 * @param {import('redis').RedisClient}
 */
async function isManagerOfGuildByAPI (userID, guildID, redisClient) {
  const log = createLogger({
    function: 'isManagerOfGuildByAPI',
    userID,
    guildID
  })
  log.debug('Determing if user is manager of guild via Discord API')
  log.info('[1 DISCORD API REQUEST] [BOT] MIDDLEWARE /api/guilds/:guildId/members/:userId')
  const config = getConfig()
  try {
    const user = await requestHandler.getWithBot(`guilds/${guildID}/members/${userID}`, config.bot.token)
    log.debug({
      response: user
    }, 'Fetched member from Discord API')
    const roles = user.roles
    for (const id of roles) {
      log.debug(`Checking permissions of role ${id}`)
      const isManager = await roleServices.isManagerOfGuild(id, guildID, redisClient)
      if (isManager) {
        log.debug('User is manager of guild. Caching manager in redis.')
        // Store the user as manager member
        await RedisGuildMember.utils.recognizeManagerManual(redisClient, userID, guildID)
        return true
      }
    }
    log.debug('User is a non-manager, but member of guild. Caching member in redis.')
    // Store the user as member
    await RedisGuildMember.utils.recognizeManual(redisClient, userID, guildID)
    return false
  } catch (err) {
    const res = err.response
    if (!res) {
      throw err
    }
    if (res.status === 403 || res.status === 401) {
      log.debug(`User is not a member of guild via Discord API (got Discord ${res.status} status code). Caching as non-member.`)
      // Store the user as non-member
      await RedisGuildMember.utils.recognizeNonMember(redisClient, userID, guildID)
      return false
    } else {
      throw new Error(`Bad Discord status code (${res.status})`)
    }
  }
}

module.exports = {
  getUserByAPI,
  getUser,
  getGuildsByAPI,
  isManagerOfGuild,
  isManagerOfGuildByAPI,
  getMemberOfGuild,
  hasGuildPermission,
  requestHandler
}
