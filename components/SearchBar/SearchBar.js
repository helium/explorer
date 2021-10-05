import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { clamp } from 'lodash'
import { CloseCircleFilled } from '@ant-design/icons'
import useSearchResults from './useSearchResults'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useKeydown from '../../hooks/useKeydown'
import SearchResult from './SearchResult'
import { useHistory } from 'react-router'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import useSelectedCity from '../../hooks/useSelectedCity'
import useSelectedHex from '../../hooks/useSelectedHex'

const SearchBar = () => {
  const input = useRef()
  const scroll = useRef()
  const { term, setTerm, results } = useSearchResults()
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const { selectHotspot } = useSelectedHotspot()
  const { selectTxn } = useSelectedTxn()
  const { selectCity } = useSelectedCity()
  const { selectHex } = useSelectedHex()
  const history = useHistory()

  const handleChange = useCallback(
    (e) => {
      setTerm(e.target.value)
      setSelectedResultIndex(0)
    },
    [setTerm],
  )

  const handleSelectResult = useCallback(
    (result) => {
      setTerm('')
      if (result.type === 'hotspot' || result.type === 'dataonly') {
        selectHotspot(result.item.address)
        history.push(`/hotspots/${result.item.address}`)
      }
      if (result.type === 'validator') {
        history.push(`/validators/${result.item.address}`)
      }
      if (result.type === 'account' || result.type === 'maker') {
        history.push(`/accounts/${result.item.address}`)
      }
      if (result.type === 'block') {
        history.push(`/blocks/${result.item.height}`)
      }
      if (result.type === 'transaction') {
        selectTxn(result.item.hash)
        history.push(`/txns/${result.item.hash}`)
      }
      if (result.type === 'city') {
        selectCity(result.item)
      }
      if (result.type === 'hex') {
        selectHex(result.item.index)
      }
    },
    [history, selectCity, selectHex, selectHotspot, selectTxn, setTerm],
  )

  const clearSearch = useCallback(() => {
    setTerm('')
  }, [setTerm])

  useKeydown({
    '/': () => {
      input.current.focus()
    },
  })

  useKeydown(
    {
      ArrowDown: () => {
        if (results.length === 0) return
        setSelectedResultIndex(
          clamp(selectedResultIndex + 1, 0, results.length - 1),
        )
      },
      ArrowUp: () => {
        if (results.length === 0) return
        setSelectedResultIndex(
          clamp(selectedResultIndex - 1, 0, results.length - 1),
        )
      },
      Enter: () => {
        handleSelectResult(results[selectedResultIndex])
      },
    },
    input,
  )

  useEffect(() => {
    if (!scroll?.current?.children?.[selectedResultIndex]) return

    scroll.current.children[selectedResultIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [selectedResultIndex])

  return (
    <div className="relative">
      <div className="relative bg-white rounded-full w-60 h-8 flex overflow-hidden">
        <div className="absolute flex left-2 h-full pointer-events-none">
          <Image src="/images/search.svg" width={16} height={16} />
        </div>
        <input
          ref={input}
          type="search"
          value={term}
          onChange={handleChange}
          className="w-full pl-8 border-none outline-none text-base font-sans"
          placeholder="Search..."
        />
        {term.length > 0 && (
          <div
            className="absolute flex items-center right-2 h-full text-gray-550 cursor-pointer"
            onClick={clearSearch}
          >
            <CloseCircleFilled />
          </div>
        )}
      </div>
      {results.length > 0 && (
        <div
          ref={scroll}
          className="absolute bg-white max-h-72 md:w-96 -left-12 md:left-auto -right-12 md:right-0 top-12 rounded-lg divide-y divide-gray-400 overflow-y-scroll no-scrollbar shadow-md"
        >
          {results.map((r, i) => (
            <SearchResult
              key={r.key}
              result={r}
              onSelect={handleSelectResult}
              selected={selectedResultIndex === i}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
