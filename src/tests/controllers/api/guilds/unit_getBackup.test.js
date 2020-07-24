const getBackup = require('../../../../controllers/api/guilds/getBackup.js')
const {
  createResponse,
  createNext
} = require('../../../mocks/express.js')

describe('Unit::controllers/api/guilds/getBackup', function () {
  it('returns the guild data if it exists', function () {
    const req = {
      guildData: {
        profile: 123,
        feeds: [1, 2]
      }
    }
    const res = createResponse()
    const next = createNext()
    getBackup(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(req.guildData)
  })
  it('returns an empty object if it does not exist', function () {
    const req = {}
    const res = createResponse()
    const next = createNext()
    getBackup(req, res, next)
    expect(next).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith({})
  })
})
