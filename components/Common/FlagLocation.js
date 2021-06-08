import ReactCountryFlag from 'react-country-flag'
import { formatLocation } from '../Hotspots/utils'
import camelcaseKeys from 'camelcase-keys'

const FlagLocation = ({
  geocode,
  showLocationName = true,
  shortenedLocationName,
}) => {
  const geocodeInfo = camelcaseKeys(geocode)
  const shortCountry = geocodeInfo?.shortCountry
  const locationName = formatLocation(geocodeInfo, shortenedLocationName)

  return (
    <span className="flex flex-row items-center justify-start">
      {shortCountry && (
        <span className="mr-2 flex flex-row items-center justify-start">
          <ReactCountryFlag countryCode={shortCountry} svg />
        </span>
      )}
      {showLocationName && locationName}
    </span>
  )
}

export default FlagLocation
