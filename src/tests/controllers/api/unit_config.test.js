process.env.TEST_ENV = true
const configController = require('../../../controllers/api/config.js')
const {
  createRequest,
  createResponse
} = require('../../mocks/express.js')

describe('Unit::controllers/api/config', function () {
  it('returns the feed config', function () {
    const req = createRequest()
    const res = createResponse()
    const feedsConfig = {
      abc: 111,
      foo: 2
    }
    req.app.get.mockReturnValue({
      feeds: feedsConfig
    })
    configController(req, res)
    expect(res.json).toHaveBeenCalledWith(feedsConfig)
  })
})
