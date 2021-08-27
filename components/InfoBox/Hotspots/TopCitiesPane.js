import classNames from 'classnames'
import { useCallback } from 'react'
import BaseList from '../../Lists/BaseList'
import HotspotSimpleIcon from '../../Icons/HotspotSimple'
import { useFetchCities } from '../../../data/cities'

import CountryFlag from '../../Common/FlagCountry'

const TopCitiesPane = () => {
  const {
    results: cities,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useFetchCities()

  const keyExtractor = useCallback((city) => city.cityId, [])

  const linkExtractor = useCallback(
    (city) => `/hotspots/cities/${city.cityId}`,
    [],
  )

  const renderItem = useCallback((city) => {
    const cityTitle = city?.longCity ? city.longCity : city.longState

    return (
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex flex-row items-center justify-start">
            <span className="text-navy-400 font-bold text-base pr-1">
              {city.index + 1}
            </span>
            <span className="text-black text-base font-semibold">
              {cityTitle}
            </span>
          </div>
          <div>
            <div className="my-1 flex items-center justify-start font-normal text-gray-600 text-sm">
              <CountryFlag
                geocode={{
                  shortCountry: city.shortCountry,
                  longCity: city.longCity,
                  longCountry: city.longCountry,
                  longState: city.longState,
                }}
              />
            </div>
            <div className="my-1 flex items-center justify-start space-x-2 font-normal text-gray-600 text-sm">
              <span className="flex items-center space-x-1">
                <HotspotSimpleIcon className="text-green-500 w-3 h-auto" />
                <span className="">
                  {city.hotspotCount.toLocaleString()} hotspots deployed
                </span>
              </span>
              <span className="text-xs flex items-end">
                (
                {((city.onlineCount / city.hotspotCount) * 100).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 2 },
                )}
                % online)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <img alt="" src="/images/details-arrow.svg" />
        </div>
      </div>
    )
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !!cities,
        'overflow-y-hidden': !cities,
      })}
    >
      <BaseList
        items={cities}
        keyExtractor={keyExtractor}
        linkExtractor={linkExtractor}
        isLoading={!cities || isLoadingInitial}
        renderItem={renderItem}
        fetchMore={fetchMore}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        render
      />
    </div>
  )
}

export default TopCitiesPane
