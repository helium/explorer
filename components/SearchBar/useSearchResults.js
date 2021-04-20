import { useEffect, useRef, useState } from 'react'
import Client from '@helium/http'
import { debounce } from 'lodash'

const client = new Client()

const useSearchResults = () => {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])

  const searchHotspot = useRef(
    debounce(
      async (term) => {
        try {
          const list = await client.hotspots.search(term)
          const hotspots = await list.take(20)
          setResults(hotspots)
        } catch {
          setResults([])
        }
      },
      500,
      { trailing: true },
    ),
  )

  useEffect(() => {
    if (term === '') {
      setResults([])
      return
    }

    searchHotspot.current(term)
  }, [term])

  return { term, setTerm, results }
}

export default useSearchResults
