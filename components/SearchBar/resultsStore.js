import { useReducer } from 'react'
import Fuse from 'fuse.js'
import { castArray, orderBy, uniqBy } from 'lodash'

export const CLEAR_RESULTS = 'CLEAR_RESULTS'
export const PUSH_RESULTS = 'PUSH_RESULTS'

const resultsReducer = (results, action) => {
  switch (action.type) {
    case CLEAR_RESULTS:
      return {}

    case PUSH_RESULTS:
      return {
        ...results,
        [action.payload.term]: sortResults(
          [
            ...(results[action.payload.term] || []),
            ...castArray(action.payload.results),
          ],
          action.payload.term,
        ),
      }

    default:
      throw new Error('unknown action')
  }
}

const useResultsReducer = () => {
  return useReducer(resultsReducer, {})
}

const sortResults = (results, term) => {
  const uniqResults = uniqBy(results, 'key')
  if (uniqResults.length <= 1) return uniqResults

  const fuse = new Fuse(uniqResults, {
    includeScore: true,
    keys: ['indexed'],
    shouldSort: false,
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.5,
  })

  const fuseResults = fuse.search(term)
  const sortedResults = orderBy(
    fuseResults,
    ['score', 'item.item.hotspotCount'],
    ['asc', 'desc'],
  )
  const sortedItems = sortedResults.map((r) => r.item)
  return sortedItems
}

export default useResultsReducer
