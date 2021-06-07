import camelcaseKeys from 'camelcase-keys'
import ReactCountryFlag from 'react-country-flag'

const FlagLocation = ({
  geocode,
  country = 'short',
  showLocationName = true,
}) => {
  if (!geocode) {
    return <span>No location set</span>
  }

  const { longCity, shortState, shortCountry, longCountry } = camelcaseKeys(
    geocode,
  )

  if (!longCity && !shortState && !shortCountry) {
    return <span>No location set</span>
  }

  const locationTerms = [longCity]

  if (shortState !== null && shortState !== undefined) {
    locationTerms.push(shortState)
  }

  locationTerms.push(country === 'short' ? shortCountry : longCountry)

  return (
    <span className="flex flex-row items-center justify-start">
      <span className="mr-2 flex flex-row items-center justify-start">
        <ReactCountryFlag countryCode={shortCountry} svg />
      </span>
      {showLocationName && locationTerms.join(', ')}
    </span>
  )
}

export default FlagLocation
