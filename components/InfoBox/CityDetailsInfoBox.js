import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import classNames from 'classnames'
import useSelectedCity from '../../hooks/useSelectedCity'
import ReactCountryFlag from 'react-country-flag'

const CityDetailsInfoBox = () => {
  const { cityid } = useParams()
  const { selectedCity, selectCity, clearSelectedCity } = useSelectedCity()

  useEffect(() => {
    if (!selectedCity) {
      // TODO: get city info from city ID. Associated API GH issue: https://github.com/helium/blockchain-http/issues/312
      // selectCity needs the full city geocode object, which is not easily retrievable from the API right now
      // selectCity(cityid)
    }
  }, [cityid, clearSelectedCity, selectCity, selectedCity])

  useEffect(() => {
    return () => {
      clearSelectedCity()
    }
  }, [clearSelectedCity])

  const generateTitle = (city) => {
    if (!city) return 'Loading city...'
    return (
      <span className="flex items-start justify-start">
        <span className="ml-3">{city}</span>
      </span>
    )
  }

  const generateBreadcrumbs = () => {
    return [
      {
        title: 'Hotspots',
        path: '/hotspots/latest',
      },
      {
        title: 'Cities',
        path: '/hotspots/cities',
      },
    ]
  }

  const generateSubtitles = (city) => {
    if (!city)
      return [
        {
          iconPath: '/images/location-blue.svg',
          loading: true,
        },
      ]
    return [
      {
        title: selectedCity.longCountry,
        icon: <ReactCountryFlag countryCode={selectedCity.shortCountry} />,
      },
    ]
  }

  return (
    <InfoBox
      title={generateTitle(selectedCity?.longCity)}
      metaTitle={selectedCity?.longCity}
      breadcrumbs={generateBreadcrumbs(selectedCity)}
      subtitles={generateSubtitles(selectedCity)}
    >
      <div
        className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
          'overflow-y-scroll': selectedCity,
          'overflow-y-hidden': !selectedCity,
        })}
      >
        {/* TODO: add city stat widgets here: hotspot count, etc. */}
      </div>
    </InfoBox>
  )
}

export default CityDetailsInfoBox
