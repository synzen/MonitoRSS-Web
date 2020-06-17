const userServices = require('../../../services/user.js')
const guildServices = require('../../../services/guild.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getMeGuilds (req, res, next) {
  const { identity, token } = req.session
  const config = req.app.get('config')
  const redisClient = req.app.get('redisClient')
  const requestHandler = req.app.get('webClientManager').requestHandler
  try {
    const userGuilds = await userServices.getGuildsByAPI(requestHandler, identity.id, token.access_token)
    const guilds = []
    const promises = userGuilds.map((guild) => (async () => {
      const hasPerm = await userServices.hasGuildPermission(guild, config, redisClient)
      if (!hasPerm) {
        return
      }
      const guildData = await guildServices.getGuild(guild.id, redisClient)
      guilds.push(guildData)
    })())
    await Promise.all(promises)
    res.json(guilds)
  } catch (err) {
    next(err)
  }
}

module.exports = getMeGuilds
