const faqServices = require('../../services/faq.js')
const createError = require('../../util/createError.js')
const requestIp = require('request-ip')

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function hitFaq (req, res, next) {
  const question = req.body.question
  const ip = requestIp.getClientIp(req)
  try {
    if (!faqServices.isQuestion(question)) {
      const error = createError(400, 'Invalid question')
      return res.status(400).json(error)
    }
    if (faqServices.recentlyClickedQuestion(ip, question)) {
      return res.end()
    }
    faqServices.registerNewQuestionHit(ip, question)
    await faqServices.hit(question)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

module.exports = hitFaq
