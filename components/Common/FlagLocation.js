import { formatLocation } from '../Hotspots/utils'
import camelcaseKeys from 'camelcase-keys'
import Flag from './Flag'

const FlagLocation = ({
  geocode,
  showLocationName = true,
  shortenedLocationName,
  condensedView = false,
}) => {
  const geocodeInfo = camelcaseKeys(geocode)
  const shortCountry = geocodeInfo?.shortCountry
  const locationName = formatLocation(geocodeInfo, shortenedLocationName)

  if (condensedView)
    return (
      <span className="flex flex-row items-center justify-start">
        <Flag className="mr-1" countryCode={shortCountry} />
        {showLocationName && geocodeInfo?.shortCity}
      </span>
    )

  return (
    <span className="flex flex-row items-center justify-start">
      <Flag className="mr-1" countryCode={shortCountry} />
      {showLocationName && locationName}
    </span>
  )
}

export default FlagLocation
