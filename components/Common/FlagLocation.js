import camelcaseKeys from 'camelcase-keys'
import ReactCountryFlag from 'react-country-flag'

const FlagLocation = ({ geocode, country = 'short' }) => {
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
    <span>
      <span className="pr-1">
        <ReactCountryFlag countryCode={shortCountry} />
      </span>
      {locationTerms.join(', ')}
    </span>
  )
}

export default FlagLocation
