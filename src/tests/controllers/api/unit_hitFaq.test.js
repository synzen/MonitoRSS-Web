process.env.TEST_ENV = true
const hitFaqController = require('../../../controllers/api/hitFaq.js')
const faqServices = require('../../../services/faq.js')
const createError = require('../../../util/createError.js')
const {
  createRequest,
  createResponse,
  createNext
} = require('../../mocks/express.js')

jest.mock('../../../services/faq.js')
jest.mock('../../../util/createError.js')

describe('Unit::controllers/api/getFaq', function () {
  beforeEach(function () {
    faqServices.isQuestion.mockReset()
    faqServices.recentlyClickedQuestion.mockReset()
    faqServices.registerNewQuestionHit.mockReset()
    faqServices.hit.mockReset()
    createError.mockReset()
  })
  it('returns 400 if invalid question', async function () {
    const req = createRequest()
    const json = jest.fn()
    const status = jest.fn()
      .mockReturnValue({
        json
      })
    const res = {
      status
    }
    const next = createNext()
    faqServices.isQuestion.mockReturnValue(false)
    const createdError = {
      foo: 'bar'
    }
    createError.mockReturnValue(createdError)
    await hitFaqController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith(createdError)
  })
  it('calls end if recently clicked', async function () {
    const req = createRequest()
    const res = {
      end: jest.fn()
    }
    const next = createNext()
    faqServices.isQuestion.mockReturnValue(true)
    faqServices.recentlyClickedQuestion.mockReturnValue(true)
    await hitFaqController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.end).toHaveBeenCalledWith()
  })
  it('returns 204 when question is hit', async function () {
    const req = createRequest()
    const end = jest.fn()
    const status = jest.fn()
      .mockReturnValue({ end })
    const res = {
      status
    }
    const next = createNext()
    faqServices.isQuestion.mockReturnValue(true)
    faqServices.recentlyClickedQuestion.mockReturnValue(false)
    await hitFaqController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(status).toHaveBeenCalledWith(204)
    expect(end).toHaveBeenCalled()
    expect(faqServices.hit).toHaveBeenCalledTimes(1)
    expect(faqServices.registerNewQuestionHit).toHaveBeenCalledTimes(1)
  })
})
