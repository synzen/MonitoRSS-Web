const feedServices = require('../../../../services/feed.js')
const createError = require('../../../../util/createError.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function sendMessage (req, res, next) {
  const requestHandler = req.app.get('webClientManager').requestHandler
  const feed = req.feed
  const { article, channel } = req.body
  let articleMessage
  try {
    articleMessage = await feedServices.createArticleMessage(feed, article, channel)
  } catch (err) {
    const createdError = createError(400, 'Invalid article')
    return res.status(400).json(createdError)
  }

  try {
    if (feed.webhook) {
      await feedServices.sendWebhookMessage(requestHandler, articleMessage)
    } else {
      await feedServices.sendMessage(requestHandler, articleMessage)
    }
    res.status(201).end()
  } catch (err) {
    next(err)
  }
}

module.exports = sendMessage
