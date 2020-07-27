const guildServices = require('../services/guild.js')
const createError = require('../util/createError.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function channelBelongsToGuild (req, res, next) {
  const redisClient = req.app.get('redisClient')
  const { channel } = req.body
  const { guildID } = req.params
  const belongsToGuild = await guildServices.guildHasChannel(guildID, channel, redisClient)
  if (!belongsToGuild) {
    const createdError = createError(403, 'Unauthorized channel')
    return res.status(403).json(createdError)
  } else {
    next()
  }
}

module.exports = channelBelongsToGuild
