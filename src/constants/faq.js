const keywordExtractor = require('keyword-extractor')
const stemmer = require('stemmer')
const documents = require('./faq.json')
const removeMarkdown = require('remove-markdown')
const extractorOptions = {
  remove_digits: true,
  remove_duplicates: false,
  return_changed_case: true
}
const invertedIndexes = {}
const TAG_POINTS = 5
const QUESTION_POINTS = 3
const ANSWER_POINTS = 1

function addWordsToIndex (invertedIndex, keywords, docIndex, points) {
  for (const word of keywords) {
    if (!invertedIndex[word]) {
      invertedIndex[word] = []
      invertedIndex[word][docIndex] = [docIndex, points]
    } else if (!invertedIndex[word][docIndex]) {
      invertedIndex[word][docIndex] = [docIndex, points]
    } else {
      invertedIndex[word][docIndex][1] += points
    }
  }
}

documents.forEach((document, documentIndex) => {
  // Question
  const question = document.q.replace(/[{}?()]/g, '')
  const questionKeywords = keywordExtractor
    .extract(question, extractorOptions)
    .map(stemmer)
  addWordsToIndex(invertedIndexes, questionKeywords, documentIndex, QUESTION_POINTS)

  // Answer
  const answer = removeMarkdown(document.a).replace(/[{}?()]/g, '')
  const answerKeywords = keywordExtractor
    .extract(answer, extractorOptions)
    .map(stemmer)
  addWordsToIndex(invertedIndexes, answerKeywords, documentIndex, ANSWER_POINTS)

  // Tags. Give half points for each word if it's a multi-word tag
  const halfTags = []
  const tags = []
  document.t.forEach(tag => {
    tags.push(stemmer(tag))
    const splat = tag.split(' ')
    if (splat.length > 1) {
      splat.forEach(halfTag => halfTags.push(stemmer(halfTag)))
    }
  })
  addWordsToIndex(invertedIndexes, halfTags, documentIndex, TAG_POINTS / 2)
  addWordsToIndex(invertedIndexes, tags, documentIndex, TAG_POINTS)

  // Encoded questions for directing user to question via URL route
  document.qe = document.q.replace(/\s/g, '-').replace(/\?/g, '')
})

// Remove all the undefined indexes where the word didn't occur
for (const word in invertedIndexes) {
  const invertedIndex = invertedIndexes[word]
  invertedIndexes[word] = invertedIndex.filter(document => document)
}

function search (searchTerm) {
  const terms = searchTerm
    .split(' ')
    .map(stemmer)
  const termsSet = new Set(terms)
  const numberOfTerms = termsSet.size
  if (numberOfTerms === 0) {
    return documents
  }
  const documentPoints = {}
  for (const term of termsSet) {
    const occurrences = invertedIndexes[term]
    if (!occurrences) {
      continue
    }
    for (var i = occurrences.length - 1; i >= 0; --i) {
      const occurence = occurrences[i]
      const documentIndex = occurence[0]
      const points = occurence[1]
      if (!documentPoints[documentIndex]) {
        documentPoints[documentIndex] = points
      } else {
        documentPoints[documentIndex] += points
      }
    }
  }

  const sorted = Array.from(Object.entries(documentPoints))
    .sort((a, b) => b[1] - a[1])
    .map(([docIndex]) => documents[docIndex])

  return sorted
}

function get () {
  return [...documents]
}

module.exports = {
  search,
  get
}
