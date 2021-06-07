import ReactCountryFlag from 'react-country-flag'

const ValidatorFlagLocation = ({ geo }) => {
  if (!geo?.country_code) {
    return (
      <span className="flex items-center text-gray-800">
        <span role="img" className="text-xl">
          🏴‍☠️
        </span>
        ‍️ Unknown Location
      </span>
    )
  }
  return (
    <span className="flex flex-row items-center justify-start">
      <span className="mr-2 flex flex-row items-center justify-start text-gray-800">
        <ReactCountryFlag countryCode={geo.country_code} svg />
      </span>
      {[geo.city, geo.region_code, geo.country_code]
        .filter((g) => !!g)
        .join(', ')}
    </span>
  )
}

export default ValidatorFlagLocation
