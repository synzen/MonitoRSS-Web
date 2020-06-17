const guildServices = require('../services/guild.js')
const userServices = require('../services/user.js')
const createError = require('../util/createError.js')

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function checkUserGuildPermission (req, res, next) {
  const redisClient = req.app.get('redisClient')
  const config = req.app.get('config')
  const requestHandler = req.app.get('webClientManager').requestHandler
  try {
    var guildID = req.params.guildID
    var userID = req.session.identity.id
    const [guild, guildData, hasPermissiveRoles] = await Promise.all([
      guildServices.getCachedGuild(guildID, redisClient),
      guildServices.getAppData(guildID),
      userServices.isManagerOfGuildByRoles(userID, guildID, config, redisClient, requestHandler)
    ])
    if (!guild) {
      const error = createError(404, 'Unknown guild')
      return res.status(404).json(error)
    }
    if (guild.ownerID !== userID && !hasPermissiveRoles) {
      const error = createError(403, 'Missing MANAGE_CHANNEL permissions of this guild')
      return res.status(403).json(error)
    }
    req.guild = guild
    req.guildData = guildData
    return next()
  } catch (err) {
    next(err)
  }
}

module.exports = checkUserGuildPermission
