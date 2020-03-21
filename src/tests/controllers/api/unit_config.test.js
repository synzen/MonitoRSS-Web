process.env.TEST_ENV = true
const configController = require('../../../controllers/api/config.js')
const configServices = require('../../../services/config.js')
const {
  createRequest,
  createResponse,
  createNext
} = require('../../mocks/express.js')

jest.mock('../../../services/config.js')

describe('Unit::controllers/api/config', function () {
  beforeEach(function () {
    configServices.getFeedConfig.mockReset()
  })
  it('returns the feed config', async function () {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    const feedsConfig = {
      abc: 111,
      foo: 2
    }
    configServices.getFeedConfig.mockResolvedValue(feedsConfig)
    await configController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(feedsConfig)
  })
})
