/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function getConfig (req, res) {
  const config = req.app.get('config')
  res.json(config.feeds)
}

module.exports = getConfig
