import { useCallback } from 'react'
import Image from 'next/image'
import FlagLocation from '../Common/FlagLocation'
import { formatHotspotName } from '../Hotspots/utils'
import useSearchResults from './useSearchResults'
import { Link } from 'react-router-dom'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'

const SearchBar = () => {
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

  return (
    <div className="relative">
      <div className="relative bg-white rounded-full w-60 h-8 flex overflow-hidden">
        <div className="absolute flex left-2 h-full pointer-events-none">
          <Image src="/images/search.svg" width={16} height={16} />
        </div>
        <input
          type="search"
          onChange={handleChange}
          className="w-full pl-8 border-none outline-none"
          value={term}
        />
      </div>
      {results.length > 0 && (
        <div className="absolute bg-white max-h-72 w-80 right-0 top-12 rounded-lg divide-y divide-gray-400 overflow-y-scroll">
          {results.map((r) => (
            <div
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
