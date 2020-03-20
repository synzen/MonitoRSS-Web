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
  const config = req.app.get('config')
  try {
    var guildID = req.params.guildID
    var userID = req.session.identity.id
    const [ guild, guildData, isManager ] = await Promise.all([
      guildServices.getCachedGuild(guildID),
      guildServices.getAppData(guildID),
      userServices.isManagerOfGuild(userID, guildID, config)
    ])
    if (!guild) {
      const error = createError(404, 'Unknown guild')
      return res.status(404).json(error)
    }
    if (!isManager) {
      const error = createError(403, 'No permission')
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
