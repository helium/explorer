import React from 'react'
import capitalize from 'lodash/capitalize'
import ReactCountryFlag from 'react-country-flag'
import StatusCircle from './StatusCircle'

const SearchResultHotspot = ({ name, geocode, status }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}
  >
    <span>
      <StatusCircle online={status.online === 'online'} />
      {name.split('-').map(capitalize).join(' ')}
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
