const channelServices = require('../../../../services/channel.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getChannels (req, res, next) {
  const redisClient = req.app.get('redisClient')
  const guildID = req.params.guildID
  try {
    const channels = await channelServices.getGuildChannels(guildID, redisClient)
    res.json(channels)
  } catch (err) {
    next(err)
  }
}

module.exports = getChannels
