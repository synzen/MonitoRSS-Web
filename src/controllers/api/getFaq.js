const faqServices = require('../../services/faq.js')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getFaq (req, res, next) {
  const query = req.query.search
  try {
    if (query) {
      const topResult = faqServices.search(query)
      res.json(topResult)
    } else {
      const faq = await faqServices.get()
      res.json(faq)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = getFaq
