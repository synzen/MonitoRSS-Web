const feedServices = require('../../../../services/feed.js')
const createError = require('../../../../util/createError.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getFeedArticles (req, res) {
  /** @type {import('../../../../../structs/db/Feed.js')} */
  const feed = req.feed
  try {
    const failed = await feedServices.feedURLHasFailed(feed.url)
    if (failed) {
      const error = createError(403, `Feed URL ${feed.url} has reached connection failure limit`)
      return res.status(403).json(error)
    }
    const data = await feedServices.getFeedArticles(feed)
    res.json(data)
  } catch (err) {
    const resError = createError(500, err.message)
    return res.status(500).json(resError)
  }
}

module.exports = getFeedArticles
