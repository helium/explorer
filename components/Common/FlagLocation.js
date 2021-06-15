import ReactCountryFlag from 'react-country-flag'
import { formatLocation } from '../Hotspots/utils'
import camelcaseKeys from 'camelcase-keys'
import classNames from 'classnames'

const FlagLocation = ({
  geocode,
  showLocationName = true,
  shortenedLocationName,
  condensedView = false,
}) => {
  const geocodeInfo = camelcaseKeys(geocode)
  const shortCountry = geocodeInfo?.shortCountry
  const locationName = formatLocation(geocodeInfo, shortenedLocationName)

  const Flag = ({ className }) =>
    shortCountry ? (
      <span
        className={classNames(
          'flex flex-row items-center justify-start',
          className,
        )}
      >
        <ReactCountryFlag countryCode={shortCountry} svg />
      </span>
    ) : null

  if (condensedView)
    return (
      <span className="flex flex-row items-center justify-start">
        {showLocationName && geocodeInfo.shortCity}
        <Flag className="ml-1" />
      </span>
    )

  return (
    <span className="flex flex-row items-center justify-start">
      <Flag className="mr-2" />
      {showLocationName && locationName}
    </span>
  )
}

export default FlagLocation
