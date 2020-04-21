import React from 'react'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA'

const Map = ({ lat, lng }) => (
  <img
    style={{ width: '100%' }}
    src={`https://api.mapbox.com/styles/v1/mapbox/streets-v10/static/pin-m(${lng},${lat})/${lng},${lat},11/400x300?access_token=${MAPBOX_TOKEN}`}
  />
)

export default Map
