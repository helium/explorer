import React from 'react'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_KEY

const Map = ({ coords }) => {
  let url =
    'https://api.mapbox.com/styles/v1/petermain/ck9edce300f8z1iqsmguy9v3b/static/'
  coords.map((c) => {
    url += `pin-l+EF4C60(${c.lng},${c.lat}),`
  })
  url = url.substring(0, url.length - 1)
  let center = Math.floor(coords.length / 2)
  url += `/${coords[center].lng},${coords[center].lat},11/850x400@2x?access_token=${MAPBOX_TOKEN}`
  return <img style={{ width: '100%' }} src={url} />
}

export default Map
