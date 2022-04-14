import { formatCountryLocation } from '../Hotspots/utils'
import camelcaseKeys from 'camelcase-keys'
import Flag from './Flag'

const CountryFlag = ({
  geocode,
  showLocationName = true,
  shortenedCountryName = false,
}) => {
  const geocodeInfo = camelcaseKeys(geocode)
  const locationName = formatCountryLocation(geocodeInfo, shortenedCountryName)

  return (
    <span className="flex flex-row items-center justify-start">
      <Flag className="mr-1" countryCode={geocode?.shortCountry} />
      {showLocationName && locationName}
    </span>
  )
}

export default CountryFlag
