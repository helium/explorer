import React from 'react'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoicGV0ZXJtYWluIiwiYSI6ImNqMHA5dm8xbTAwMGQycXMwa3NucGptenQifQ.iVCDWzb16acgOKWz65AckA'

const Map = ({ lat, lng }) => (
  <img
    style={{ width: '100%', height: 400 }}
    src={`https://api.mapbox.com/styles/v1/petermain/ck9edce300f8z1iqsmguy9v3b/static/pin-l(${lng},${lat})/${lng},${lat},11/850x400@2x?access_token=${MAPBOX_TOKEN}`}
  />
)

export default Map


