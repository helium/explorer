import InfoBox from './InfoBox'
import { useParams } from 'react-router'
import { useEffect } from 'react'
import useSelectedCity from '../../hooks/useSelectedCity'
import ReactCountryFlag from 'react-country-flag'
import { useAsync } from 'react-async-hook'
// import client from '../../data/client'
import camelcaseKeys from 'camelcase-keys'
import { fetchApi } from '../../hooks/useApi'
import qs from 'qs'
import SkeletonWidgets from './Common/SkeletonWidgets'
import { useState } from 'react'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import CityStatisticsPane from './CityDetails/CityStatisticsPane'
import HotspotsList from '../Lists/HotspotsList'
import SkeletonList from '../Lists/SkeletonList'

const CityDetailsInfoBox = () => {
  const { cityid } = useParams()
  const { selectedCity, selectCity, clearSelectedCity } = useSelectedCity()
  const [isLoading, setIsLoading] = useState(true)

  useAsync(async () => {
    if (!selectedCity) {
      setIsLoading(true)

      const { data: cityFetched } = await fetch(
        `https://api.helium.io/v1/cities/${cityid}`,
      ).then((res) => res.json())
      const city = camelcaseKeys(cityFetched)
      // TODO: use new .cities.get('city-id') function in helium-js once published (https://github.com/helium/helium-js/pull/224)
      // will replace above with:
      // const city = await client.cities.get(cityid)

      const geometry = await fetchApi(
        '/cities/search?' +
          qs.stringify({
            term: [city.longCity, city.longState, city.longCountry].join(', '),
          }),
      )

      selectCity({ ...city, geometry })
      setIsLoading(false)
    }
  }, [cityid, clearSelectedCity, selectCity, selectedCity])

  useEffect(() => {
    return () => {
      clearSelectedCity()
    }
  }, [clearSelectedCity])

  const generateTitle = (city) => {
    if (!city) return 'Loading city...'
    return <span className="flex items-start justify-start">{city}</span>
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
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          {isLoading ? (
            <SkeletonWidgets />
          ) : (
            <CityStatisticsPane city={selectedCity} />
          )}
        </TabPane>
        <TabPane title="Hotspots" path="activity" key="hotspots">
          {isLoading ? <SkeletonList /> : <HotspotsList hotspots={[]} />}
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default CityDetailsInfoBox
