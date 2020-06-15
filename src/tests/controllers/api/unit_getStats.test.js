const getStatsController = require('../../../controllers/api/getStats.js')
const statsServices = require('../../../services/stats.js')
const {
  createRequest,
  createResponse,
  createNext
} = require('../../mocks/express.js')

jest.mock('../../../services/stats.js')

describe('Unit::controllers/api/getFaq', function () {
  beforeEach(function () {
    statsServices.getTotalGuilds.mockReset()
    statsServices.getArticleDeliveryCount.mockReset()
    statsServices.getFeedCount.mockReset()
  })
  it('returns the stats', async function () {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    const articlesDelivered = 100
    const feedCount = 9423
    const totalGuilds = 235
    statsServices.getTotalGuilds.mockReturnValue(totalGuilds)
    statsServices.getArticleDeliveryCount.mockResolvedValue(articlesDelivered)
    statsServices.getFeedCount.mockResolvedValue(feedCount)
    await getStatsController(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({
      articlesDelivered,
      feedCount,
      totalGuilds
    })
  })
  it('calls next if error', async () => {
    const req = createRequest()
    const res = createResponse()
    const next = createNext()
    const error = new Error('saedwryt')
    statsServices.getArticleDeliveryCount.mockRejectedValue(error)
    await getStatsController(req, res, next)
    expect(next).toHaveBeenCalledWith(error)
    expect(res.json).not.toHaveBeenCalled()
  })
})
