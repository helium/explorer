import { useCallback, useRef } from 'react'
import Image from 'next/image'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import useSearchResults from './useSearchResults'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import useKeydown from '../../hooks/useKeydown'

const SearchBar = () => {
  const input = useRef()
  const { term, setTerm, results } = useSearchResults()
  const { selectHotspot } = useSelectedHotspot()

  const handleChange = useCallback(
    (e) => {
      setTerm(e.target.value)
    },
    [setTerm],
  )

  const handleSelectResult = useCallback(
    (result) => () => {
      setTerm('')
      selectHotspot(result.address)
    },
    [selectHotspot, setTerm],
  )

  useKeydown({
    '/': () => {
      input.current.focus()
    },
  })

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
          className="w-full pl-8 border-none outline-none"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute bg-white max-h-72 w-80 right-0 top-12 rounded-lg divide-y divide-gray-400 overflow-y-scroll no-scrollbar">
          {results.map((r) => (
            <div
              key={r.address}
              className="border-solid py-2 px-4 flex hover:bg-gray-100 cursor-pointer"
              onClick={handleSelectResult(r)}
            >
              <div className="w-full">
                <div className="font-medium text-base text-navy-1000">
                  {formatHotspotName(r.name)}
                </div>
                <div className="text-gray-700 text-sm">
                  <FlagLocation geocode={r.geocode} />
                </div>
              </div>
              <div className="flex">
                <Image src="/images/details-arrow.svg" width={10} height={10} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
