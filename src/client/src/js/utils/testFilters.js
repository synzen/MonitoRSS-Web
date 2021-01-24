import Filter from './Filter'
import FilterRegex from './FilterRegex'
import FilterResults from './FilterResults'

/**
   * @param {string[]} userFilters
   * @param {string} reference
   */
function testArrayNegatedFilters (userFilters, reference, findBlocks) {
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

  return {
    ...returnData,
    passed: true
  }
}

/**
   * @param {string[]} userFilters
   * @param {string} reference
   */
function testArrayRegularFilters (userFilters, reference) {
  // Deal with inverted first
  const filters = userFilters.map(word => new Filter(word))
  const invertedFilters = filters.filter(filter => filter.inverted)
  const regularFilters = filters.filter(filter => !filter.inverted)
  const returnData = {
    inverted: invertedFilters.map(f => f.content),
    regular: regularFilters.map(f => f.content)
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
  return (referenceOverrides[trimmedType] || article[trimmedType])?.toLowerCase()
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
  if (!everyReferenceExists) {
    return filterResults
  }

  let hasOneBlock = false
  // First check if any filters block this article
  for (const filterTypeName in filters) {
    const userFilters = filters[filterTypeName]
    const reference = getFilterReference(article, filterTypeName)
    if (!reference) {
      continue
    }
    // Filters can either be an array of words or a string (regex)
    let results
    if (Array.isArray(userFilters)) {
      results = testArrayNegatedFilters(userFilters, reference)
    } else {
      results = testRegexFilter(userFilters, reference)
    }
    const invertedFilters = results.inverted
    const regularFilters = results.regular
    if (regularFilters.length > 0) {
      filterResults.add(filterTypeName, regularFilters, false)
    }
    if (invertedFilters.length > 0) {
      filterResults.add(filterTypeName, invertedFilters, true)
    }
    if (!results.passed) {
      hasOneBlock = true
    }
  }
  if (hasOneBlock) {
    filterResults.passed = false
    return filterResults
  }
  // Then do regular filters
  let passed = false
  let hasRegularFilters = false
  for (const filterTypeName in filters) {
    const userFilters = filters[filterTypeName]
    const reference = getFilterReference(article, filterTypeName)
    if (!reference) {
      continue
    }

    // Filters can either be an array of words or a string (regex)
    let results
    if (Array.isArray(userFilters)) {
      results = testArrayRegularFilters(userFilters, reference)
    } else {
      results = testRegexFilter(userFilters, reference)
    }
    if (results.regular.length > 0) {
      hasRegularFilters = true
    }
    passed = results.passed || passed
  }
  // If there are no regular filters, then it should pass
  filterResults.passed = hasRegularFilters ? passed : true
  return filterResults
}
