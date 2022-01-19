import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { clamp } from 'lodash'
import { CloseCircleFilled } from '@ant-design/icons'
import useSearchResults from './useSearchResults'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useKeydown from '../../hooks/useKeydown'
import SearchResult from './SearchResult'
import BaseSearchResult from './BaseSearchResult'
import { useHistory } from 'react-router'
import useSelectedTxn from '../../hooks/useSelectedTxn'
import useSelectedCity from '../../hooks/useSelectedCity'
import useSelectedHex from '../../hooks/useSelectedHex'
import classNames from 'classnames'
import { useContext } from 'react'
import BannerContext from '../Common/Banner/BannerContext'

const Results = ({
  resultsLoading,
  results,
  handleSelectResult,
  selectedResultIndex,
}) => {
  //  show that results are loading once you start typing
  if (resultsLoading) {
    return (
      <BaseSearchResult
        title="Loading results..."
        subtitle="Talking to the API..."
      />
    )
  }
  // if nothing comes back from the API, show "No results" instead of nothing
  if (results.length === 0) {
    return (
      <BaseSearchResult title="No results found" subtitle="Try another query" />
    )
  }
  return results.map((r, i) => (
    <SearchResult
      key={r.key}
      result={r}
      onSelect={handleSelectResult}
      selected={selectedResultIndex === i}
    />
  ))
}

const SearchBar = () => {
  const input = useRef()
  const scroll = useRef()
  const {
    term,
    setTerm,
    results,
    resultsLoading,
    searchFocused,
    setSearchFocused,
  } = useSearchResults()
  const [selectedResultIndex, setSelectedResultIndex] = useState(0)
  const { selectHotspot } = useSelectedHotspot()
  const { selectTxn } = useSelectedTxn()
  const { selectCity } = useSelectedCity()
  const { selectHex } = useSelectedHex()
  const { showBanner } = useContext(BannerContext)

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
        if (!resultsLoading) {
          input?.current?.blur()
          setSearchFocused(false)
          handleSelectResult(results[selectedResultIndex])
        }
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
    <div className="">
      <div
        className={classNames(
          'relative bg-white transition-all rounded-full duration-200 h-8 flex overflow-hidden',
          { 'w-full md:w-96': searchFocused, 'w-60': !searchFocused },
        )}
      >
        <div className="absolute flex left-2 h-full pointer-events-none">
          <Image src="/images/search.svg" width={16} height={16} />
        </div>
        <input
          ref={input}
          type="search"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          value={term}
          onChange={handleChange}
          className={classNames(
            'w-full border-none outline-none text-base font-sans placeholder-gray-525 z-40 pl-4 pr-7',
            {
              'placeholder-gray-700': searchFocused,
            },
          )}
          placeholder={
            searchFocused
              ? 'Search a hotspot, city, address, maker, etc.'
              : 'Search...'
          }
        />
        {term.length > 0 && (
          <div
            className="absolute flex items-center right-2 h-full text-gray-550 cursor-pointer z-40"
            onClick={clearSearch}
          >
            <CloseCircleFilled />
          </div>
        )}
      </div>
      {term.length > 0 && (
        <>
          <div
            ref={scroll}
            className={classNames(
              'absolute bg-white max-h-96 md:max-h-72 md:w-96 left-2 md:left-auto right-2 lg:right-4 rounded-lg divide-y divide-gray-400 overflow-y-scroll no-scrollbar shadow-md z-40',
              {
                'top-14': !showBanner,
                'top-20': showBanner,
              },
            )}
          >
            <Results
              resultsLoading={resultsLoading}
              results={results}
              handleSelectResult={handleSelectResult}
              selectedResultIndex={selectedResultIndex}
            />
          </div>
          <div
            className={classNames(
              'md:hidden absolute transition-all duration-500 ease-in-out top-0 z-30 left-0 h-screen w-screen mobilenav-blur',
              {
                'opacity-0':
                  (results.length === 0 || term.length === 0) &&
                  !searchFocused &&
                  !resultsLoading,
                'opacity-100':
                  searchFocused ||
                  results.length > 0 ||
                  term.length > 0 ||
                  resultsLoading,
              },
            )}
          />
        </>
      )}
    </div>
  )
}
export default SearchBar
