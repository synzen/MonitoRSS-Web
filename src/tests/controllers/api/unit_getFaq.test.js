process.env.TEST_ENV = true
const getFaqController = require('../../../controllers/api/getFaq.js')
const faqServices = require('../../../services/faq.js')
const {
  createRequest,
  createResponse,
  createNext
} = require('../../mocks/express.js')

jest.mock('../../../services/faq.js')

describe('Unit::controllers/api/getFaq', function () {
  beforeEach(function () {
    faqServices.search.mockReset()
    faqServices.get.mockReset()
  })
  it('returns the search results if there is a search query', async function () {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    req.query.search = 'bloooah'
    const searchResults = [{
      q: 'b'
    }]
    faqServices.search.mockReturnValue(searchResults)
    await getFaqController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(searchResults)
  })
  it('returns the full faq if no search query', async () => {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    req.query.bloop = 'bloooah'
    const fullFaq = [{
      q: 'fgj'
    }]
    faqServices.get.mockReturnValue(fullFaq)
    await getFaqController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(fullFaq)
  })
  it('calls next if error', async () => {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    const error = new Error('saedwryt')
    faqServices.get.mockRejectedValue(error)
    faqServices.search.mockRejectedValue(error)
    await getFaqController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.json).not.toHaveBeenCalled()
  })
})
