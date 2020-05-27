const faq = require('../constants/faq.js')
const FAQHits = require('../models/FAQHits.js')
const shuffleArray = require('../util/shuffleArray.js')
const createLogger = require('../util/logger/create.js')
const faqHits = {}

async function hit (question) {
  const log = createLogger()
  await FAQHits.Model.updateOne({
    _id: question
  }, {
    $inc: {
      hits: 1
    }
  }, {
    upsert: true
  })
  log.debug({
    question
  }, 'FAQ hit')
}

async function getHits () {
  const hits = await FAQHits.Model.find().lean().exec()
  const hitsMap = new Map()
  const docs = faq.get()
  for (const doc of docs) {
    hitsMap.set(doc.q, 0)
  }
  for (const hit of hits) {
    hitsMap.set(hit._id, hit.hits)
  }
  return hitsMap
}

async function get () {
  const hits = await module.exports.getHits()
  const docs = [...shuffleArray(faq.get())]
  return docs.sort((a, b) => {
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
}

function search (term) {
  const results = faq.search(term)
  return results
}

function registerNewQuestionHit (ip, question) {
  const log = createLogger()
  const hits = module.exports.faqHits
  if (!hits[ip]) {
    hits[ip] = {}
  }
  log.debug({
    ip,
    question
  }, 'Marked new question for ip')
  hits[ip][question] = new Date()
  setTimeout(() => {
    delete hits[ip][question]
  }, 600000)
}

function recentlyClickedQuestion (ip, question) {
  const hits = module.exports.faqHits
  return !!(hits[ip] && hits[ip][question])
}

function isQuestion (question) {
  return !!faq.documents.find(doc => doc.q === question)
}

module.exports = {
  faqHits,
  getHits,
  get,
  search,
  hit,
  recentlyClickedQuestion,
  registerNewQuestionHit,
  isQuestion
}
