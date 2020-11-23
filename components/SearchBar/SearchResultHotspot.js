import React from 'react'
import ReactCountryFlag from 'react-country-flag'
import { formatHotspotName } from '../Hotspots/utils'
import { StatusCircle } from '../Hotspots'

const SearchResultHotspot = ({ name, geocode, status }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}
  >
    <span>
      <StatusCircle status={status} />
      {formatHotspotName(name)}
    </span>
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {geocode.shortCountry && (
        <>
          {[geocode.longCity, geocode.shortState, geocode.shortCountry].join(
            ', ',
          )}
          <ReactCountryFlag
            countryCode={geocode.shortCountry}
            style={{
              fontSize: '1.3em',
              marginLeft: '6px',
              lineHeight: '1.3em',
            }}
          />
        </>
      )}
    </span>
  </div>
)

export default SearchResultHotspot
