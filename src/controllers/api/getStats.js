const statsServices = require('../../services/stats.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStats (req, res, next) {
  const webClientManager = req.app.get('webClientManager')
  try {
    const totalGuilds = statsServices.getTotalGuilds(webClientManager)
    const [
      articlesSent,
      feedCount
    ] = await Promise.all([
      statsServices.getArticleDeliveryCount(),
      statsServices.getFeedCount()
    ])
    res.json({
      articlesSent,
      feedCount,
      totalGuilds
    })
  } catch (err) {
    next(err)
  }
}

module.exports = getStats
