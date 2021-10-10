const fetch = require('node-fetch')
const feedServices = require('../../../services/feed.js')
const createError = require('../../../util/createError.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getFeed (req, res) {
  const feedUrl = req.params.url
  let allPlaceholders = []
  let xmlStr = ''
  try {
    allPlaceholders = await feedServices.getAnonymousFeedPlaceholders(feedUrl)
  } catch (err) {
    if (err.message.includes('valid feed')) {
      const resError = createError(40002, err.message)
      return res.status(400).json(resError)
    } else {
      const resError = createError(500, err.message)
      return res.status(500).json(resError)
    }
  }
  try {
    const feedResponse = await fetch(feedUrl)
    if (feedResponse.status !== 200) {
      const resError = createError(500, `Bad status code (${feedResponse.status})`)
      return res.status(500).json(resError)
    }
    xmlStr = await feedResponse.text()
  } catch (err) {
    const resError = createError(500, err.message)
    return res.status(500).json(resError)
  }

  res.json({
    articles: allPlaceholders,
    xml: xmlStr
  })
}

module.exports = getFeed
