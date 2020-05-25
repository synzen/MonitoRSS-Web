const faq = require('../constants/faq.js')
const FAQHits = require('../models/FAQHits.js')

async function getHits () {
  const hits = await FAQHits.Model.find().lean().exec()
  const hitsMap = new Map()
  for (const hit of hits) {
    hitsMap.set(hit._id, hit.hits)
  }
  const docs = faq.documents
  for (const doc of docs) {
    hitsMap.set(doc.q, 0)
  }
  return hitsMap
}

async function get () {
  const hits = await module.exports.getHits()
  const docs = [...faq.documents]
  docs.sort((a, b) => {
    const aHits = hits.get(a.q)
    const bHits = hits.get(b.q)
    if (aHits === bHits) {
      return 0
    } else if (aHits < bHits) {
      return 1
    } else {
      return -1
    }
  })
  return docs
}

function search (term) {
  const results = faq.search(term)
  return results
}

module.exports = {
  getHits,
  get,
  search
}
