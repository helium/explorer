import { useCallback, useState } from 'react'
import { useAsync } from 'react-async-hook'
import client from './client'

export const useFetchCities = (pageSize = 20, order = 'hotspotCount') => {
  const [list, setList] = useState()
  const [results, setResults] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useAsync(async () => {
    const newList = await client.cities.list({ order })
    setList(newList)
    setIsLoadingInitial(false)
  }, [])

  useAsync(async () => {
    if (!list) return
    setIsLoadingMore(true)
    const newResults = await list.take(pageSize)
    const newResultsWithRank = newResults.map((c, i) => ({ ...c, index: i }))
    setResults(newResultsWithRank)
    setIsLoadingMore(false)
    if (newResults.length < pageSize) {
      setHasMore(false)
    }
  }, [list])

  const fetchMore = useCallback(async () => {
    const newResults = await list.take(pageSize)
    const newResultsWithRank = newResults.map((c, i) => ({
      ...c,
      index: results.length + i,
    }))

    setResults([...results, ...newResultsWithRank])
  }, [list, pageSize, results])

  return { results, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}
