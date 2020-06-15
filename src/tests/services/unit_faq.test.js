const faqServices = require('../../services/faq.js')
const faq = require('../../constants/faq.js')
const FAQHits = require('../../models/FAQHits.js')
const shuffleArray = require('../../util/shuffleArray.js')

jest.mock('../../constants/faq.js')
jest.mock('../../util/shuffleArray.js')

describe('services/faq', () => {
  let FAQHitsExec = jest.fn()
  beforeEach(() => {
    jest.restoreAllMocks()
    faq.get.mockReturnValue([])
    faq.search = jest.fn()
    FAQHitsExec = jest.fn()
    FAQHits.Model = {
      find: () => ({
        lean: () => ({
          exec: FAQHitsExec
        })
      }),
      updateOne: ({
        lean: () => ({
          exec: FAQHitsExec
        })
      })
    }
    faqServices.faqHits = {}
  })
  describe('get', () => {
    beforeEach(() => {
      shuffleArray.mockReset()
      jest.spyOn(faqServices, 'getHits')
        .mockReturnValue(new Map())
    })
    it('returns the documents sorted by hits', async () => {
      const docs = [{
        q: 'b foo'
      }, {
        q: 'c foo'
      }, {
        q: 'A foo'
      }]
      const hits = new Map([
        ['A foo', 30],
        ['b foo', 20],
        ['c foo', 10]
      ])
      shuffleArray.mockReturnValue(docs)
      jest.spyOn(faqServices, 'getHits')
        .mockResolvedValue(hits)
      const result = await faqServices.get()
      expect(result).toEqual([
        docs[2],
        docs[0],
        docs[1]
      ])
    })
  })
  describe('getHits', () => {
    it('returns the number of hits returned from the db if no questions in faq', async () => {
      const hits = [{
        _id: 'a',
        hits: 10
      }, {
        _id: 'b',
        hits: 20
      }, {
        _id: 'abc',
        hits: 5
      }]
      const docs = [{
        q: 'a'
      }]
      faq.get.mockReturnValue(docs)
      FAQHitsExec.mockResolvedValue(hits)
      const hitsMap = await faqServices.getHits()
      expect(hitsMap).toEqual(new Map([
        ['a', 10],
        ['b', 20],
        ['abc', 5]
      ]))
    })
    it('adds faq docs with 0 hits if not in database', async () => {
      const hits = []
      const docs = [{
        q: 'abc'
      }]
      faq.get.mockReturnValue(docs)
      FAQHitsExec.mockResolvedValue(hits)
      const hitsMap = await faqServices.getHits()
      expect(hitsMap).toEqual(new Map([
        ['abc', 0]
      ]))
    })
    it('combines docs and DB hits', async () => {
      const hits = [{
        _id: 'a',
        hits: 10
      }]
      const docs = [{
        q: 'abc'
      }]
      faq.get.mockReturnValue(docs)
      FAQHitsExec.mockResolvedValue(hits)
      const hitsMap = await faqServices.getHits()
      expect(hitsMap).toEqual(new Map([
        ['a', 10],
        ['abc', 0]
      ]))
    })
  })
  describe('search', () => {
    beforeEach(() => {
      jest.spyOn(faqServices, 'saveSearchQuery')
        .mockResolvedValue()
    })
    it('returns the search results', async () => {
      const searchResults = [{
        a: 'b'
      }, {
        c: 'd'
      }]
      faq.search.mockReturnValue(searchResults)
      await expect(faqServices.search())
        .resolves.toEqual(searchResults)
    })
  })
  describe('registerNewQuestionHit', () => {
    beforeAll(() => {
      jest.useFakeTimers()
    })
    afterAll(() => {
      jest.useRealTimers()
    })
    it('adds the question to session', () => {
      const ip = 'q32ewt546r'
      const question = 'aqetswr4y5'
      faqServices.registerNewQuestionHit(ip, question)
      expect(faqServices.faqHits[ip][question]).toBeDefined()
    })
    it('deletes the question from session after a while', () => {
      const ip = 'q3ew24t6ry'
      const question = 'aqetswr4y5'
      faqServices.registerNewQuestionHit(ip, question)
      jest.runAllTimers()
      expect(faqServices.faqHits[ip][question]).toBeUndefined()
    })
  })
  describe('recentlyClickedQuestion', () => {
    it('returns correctly', () => {
      const ip = 'w34rye5tuh'
      const question = 'aqetswr4y5'
      faqServices.faqHits = {
        [ip]: {
          [question]: new Date()
        }
      }
      const returned = faqServices.recentlyClickedQuestion(ip, question)
      expect(returned).toEqual(true)
      const returned2 = faqServices.recentlyClickedQuestion(ip, question + 'abc')
      expect(returned2).toEqual(false)
    })
  })
  describe('isQuestion', () => {
    it('returns correctly', () => {
      const docs = [{
        q: 'a'
      }, {
        q: 'b'
      }]
      faq.get.mockReturnValue(docs)
      expect(faqServices.isQuestion('a'))
        .toEqual(true)
      expect(faqServices.isQuestion('c'))
        .toEqual(false)
    })
  })
})
