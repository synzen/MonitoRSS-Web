import Filter from './Filter'
import FilterRegex from './FilterRegex'
import FilterResults from './FilterResults'

/**
 * @param {string[]} userFilters
 * @param {string} reference
 */
function testArrayFilters (userFilters, reference) {
  // Deal with inverted first
  const filters = userFilters.map(word => new Filter(word))
  const invertedFilters = filters.filter(filter => filter.inverted)
  const regularFilters = filters.filter(filter => !filter.inverted)
  const blocked = invertedFilters.find(filter => !filter.passes(reference))
  const returnData = {
    inverted: invertedFilters.map(f => f.content),
    regular: regularFilters.map(f => f.content)
  }
  if (blocked) {
    return {
      ...returnData,
      passed: false
    }
  }

  if (regularFilters.length === 0) {
    return {
      ...returnData,
      passed: true
    }
  }
  const passed = !!regularFilters.find(filter => filter.passes(reference))
  return {
    ...returnData,
    passed
  }
}

/**
 * @param {string} userFilter
 * @param {string} reference
 */
function testRegexFilter (userFilter, reference) {
  const filter = new FilterRegex(userFilter)
  const filterPassed = filter.passes(reference)
  if (filterPassed) {
    return {
      inverted: [],
      regular: [userFilter],
      passed: true
    }
  } else {
    return {
      inverted: [userFilter],
      regular: [],
      passed: false
    }
  }
}

/**
 * @param {Object<string, any>} article
 * @param {string} type
 */
function getFilterReference (article, type) {
  const referenceOverrides = {
    description: article.fullDescription,
    summary: article.fullSummary,
    title: article.fullTitle
  }
  const trimmedType = type.startsWith('other:') ? type.replace('other:', '') : type
  return referenceOverrides[trimmedType] || article[trimmedType]
}

export default function testFilters (filters, article) {
  const filterResults = new FilterResults()
  if (Object.keys(filters).length === 0) {
    filterResults.passed = true
    return filterResults
  }
  const everyReferenceExists = Object.keys(filters).every(type => !!getFilterReference(article, type))
  filterResults.passed = everyReferenceExists
  // If not every key in filters exists on the articles, auto-block it
  console.log(everyReferenceExists)
  if (!everyReferenceExists) {
    return filterResults
  }
  let passed = false
  for (const filterTypeName in filters) {
    const userFilters = filters[filterTypeName]
    const reference = getFilterReference(article, filterTypeName)
    if (!reference) {
      continue
    }
    let invertedFilters = []
    let regularFilters = []

    // Filters can either be an array of words or a string (regex)
    let results
    if (Array.isArray(userFilters)) {
      results = testArrayFilters(userFilters, reference)
    } else {
      results = testRegexFilter(userFilters, reference)
    }
    passed = results.passed || passed
    invertedFilters = invertedFilters.concat(results.inverted)
    regularFilters = regularFilters.concat(results.regular)
    if (regularFilters.length > 0) {
      filterResults.add(filterTypeName, regularFilters, false)
    }
    if (invertedFilters.length > 0) {
      filterResults.add(filterTypeName, invertedFilters, true)
    }
  }
  console.log(passed)
  filterResults.passed = passed
  return filterResults
}
