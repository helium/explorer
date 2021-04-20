import ReactCountryFlag from 'react-country-flag'

const ValidatorFlagLocation = ({ geo }) => {
  if (!geo.country_code) {
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
    <span className="text-gray-800">
      <ReactCountryFlag
        countryCode={geo.country_code}
        style={{
          fontSize: '1.5em',
          marginRight: '6px',
          lineHeight: '1.5em',
        }}
      />
      {[geo.city, geo.region_code, geo.country_code]
        .filter((g) => !!g)
        .join(', ')}
    </span>
  )
}

export default ValidatorFlagLocation
