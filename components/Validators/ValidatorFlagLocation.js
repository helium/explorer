import ReactCountryFlag from 'react-country-flag'
import { Tooltip } from 'antd'

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
    <Tooltip
      title={[geo.city, geo.region_code, geo.country_code]
        .filter((g) => !!g)
        .join(', ')}
    >
      <span className="flex flex-row items-center justify-start">
        <span className="mr-2 flex flex-row items-center justify-start text-gray-800">
          <ReactCountryFlag countryCode={geo.country_code} svg />
        </span>
        {[geo.region_code, geo.country_code].filter((g) => !!g).join(', ')}
      </span>
    </Tooltip>
  )
}

export default ValidatorFlagLocation
