const faqServices = require('../../services/faq.js')
const faq = require('../../constants/faq.js')
const FAQHits = require('../../models/FAQHits.js')

jest.mock('../../constants/faq.js')
jest.mock('../../models/FAQHits.js')

describe('services/faq', () => {
  let FAQHitsExec = jest.fn()
  beforeEach(() => {
    jest.restoreAllMocks()
    faq.documents = []
    faq.search = jest.fn()
    FAQHitsExec = jest.fn()
    FAQHits.Model = {
      find: () => ({
        lean: () => ({
          exec: FAQHitsExec
        })
      })
    }
  })
  describe('get', () => {
    beforeEach(() => {
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
      faq.documents = docs
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
      const docs = []
      faq.documents = docs
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
      faq.documents = docs
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
      faq.documents = docs
      FAQHitsExec.mockResolvedValue(hits)
      const hitsMap = await faqServices.getHits()
      expect(hitsMap).toEqual(new Map([
        ['a', 10],
        ['abc', 0]
      ]))
    })
  })
  describe('search', () => {
    it('returns the search results', () => {
      const searchResults = [{
        a: 'b'
      }, {
        c: 'd'
      }]
      faq.search.mockReturnValue(searchResults)
      expect(faqServices.search()).toEqual(searchResults)
    })
  })
})
