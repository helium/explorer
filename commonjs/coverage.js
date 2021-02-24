const { Client } = require('@helium/http')
const geoJSON = require('geojson')

const toGeoJSON = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

const getCoverage = async () => {
  const client = new Client()
  const hotspots = await client.hotspots.list()
  const result = {
    unset: 0,
    online: [],
    offline: [],
  }

  for await (const { data } of hotspots) {
    const hotspot = {
      ...data,
      location: [data.geocode.longCity, data.geocode.shortState]
        .filter(Boolean)
        .join(', '),
      status: data.status.online,
    }

    if (!hotspot.lng || !hotspot.lat) {
      result.unset++
      continue
    }

    const isOnline = hotspot.status === 'online'
    result[isOnline ? 'online' : 'offline'].push(hotspot)
  }

  return {
    ...result,
    online: toGeoJSON(result.online),
    offline: toGeoJSON(result.offline),
  }
}

module.exports = { getCoverage }
