const guildHasChannel = require('./guildHasChannel.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function guildHasChannelOptional (req, res, next) {
  const channel = req.body.channel
  if (channel) {
    return guildHasChannel(req, res, next)
  } else {
    next()
  }
}

module.exports = guildHasChannelOptional
