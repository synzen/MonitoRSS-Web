const DiscordRSS = require('discord.rss')
const guildServices = require('../../../../services/guild.js')
const feedServices = require('../../../../services/feed.js')
const createError = require('../../../../util/createError.js')
const FeedParserError = DiscordRSS.errors.FeedParserError
const RequestError = DiscordRSS.errors.RequestError

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createFeed (req, res, next) {
  const guildID = req.params.guildID
  const data = {
    guild: guildID,
    channel: req.body.channel,
    url: req.body.url,
    title: req.body.title
  }
  try {
    const info = await guildServices.getGuildLimitInfo(guildID)
    if (info.exceeded) {
      const createdError = createError(403, `Reached or exceeded feed limit (${info.limit})`)
      return res.status(403).json(createdError)
    }
    const created = await feedServices.createFeed(data)
    res.status(201).json(created)
  } catch (err) {
    const message = err.message
    if (message.includes('this channel')) {
      const createdError = createError(400, err.message)
      res.status(400).json(createdError)
    } else if (err instanceof FeedParserError || err instanceof RequestError) {
      const createdError = createError(500, err.message)
      res.status(500).json(createdError)
    } else {
      next(err)
    }
  }
}

module.exports = createFeed
