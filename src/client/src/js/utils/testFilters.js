import Filter from './Filter'
import FilterRegex from './FilterRegex'
import FilterResults from './FilterResults'

export default function testFilters (filters, article) {
  const referenceOverrides = {
    description: article._fullDescription,
    summary: article._fullSummary,
    title: article._fullTitle
  }
  let passed = false
  let negated = false
  const filterResults = new FilterResults()
  if (Object.keys(filters).length === 0) {
    passed = true
  } else {
    for (const filterTypeName in filters) {
      const userFilters = filters[filterTypeName]
      const trimmedName = filterTypeName.replace('other:', '')
      const reference = referenceOverrides[trimmedName] || article[trimmedName]
      if (!reference) {
        continue
      }
      const invertedMatches = []
      const matches = []

      // Filters can either be an array of words or a string (regex)
      if (Array.isArray(userFilters)) {
        console.log(userFilters)
        // Array
        for (const word of userFilters) {
          const filter = new Filter(word)
          const filterPassed = filter.passes(reference)
          if (filter.inverted) {
            invertedMatches.push(word)
            if (!filterPassed) {
              negated = true
            }
          } else {
            matches.push(word)
          }
          // If a inverted filter does not pass, always block regardless of any other filter
          passed = negated ? false : passed || filterPassed
        }
      } else {
        // String
        const filter = new FilterRegex(userFilters)
        const filterPassed = filter.passes(reference)
        passed = passed || filterPassed
        if (filterPassed) {
          matches.push(userFilters)
        } else {
          invertedMatches.push(userFilters)
        }
      }
      if (matches.length > 0) {
        filterResults.add(filterTypeName, matches, false)
      }
      if (invertedMatches.length > 0) {
        filterResults.add(filterTypeName, invertedMatches, true)
      }
    }
  }
  filterResults.passed = passed
  return filterResults
}
