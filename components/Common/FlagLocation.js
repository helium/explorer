import ReactCountryFlag from 'react-country-flag'
import { formatLocation } from '../Hotspots/utils'

const FlagLocation = ({
  geocode,
  showLocationName = true,
  shortenedLocationName,
}) => {
  const locationName = formatLocation(geocode, shortenedLocationName)
  const shortCountry = geocode?.shortCountry

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
