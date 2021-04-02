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

const fetchMore = async (bounds, cursor) => {
  const { boundsNELat, boundsNELon, boundsSWLat, boundsSWLon } = bounds

  const hotspotsResponse = await fetch(
    `https://api.helium.io/v1/hotspots/location/box?nelat=${boundsNELat}&nelon=${boundsNELon}&swlat=${boundsSWLat}&swlon=${boundsSWLon}&cursor=${cursor}`,
  )
  const moreHotspots = await hotspotsResponse.json()
  return moreHotspots
}

const getCoverageFromBounds = async (bounds) => {
  const { boundsNELat, boundsNELon, boundsSWLat, boundsSWLon } = bounds

  const hotspotsResponse = await fetch(
    `https://api.helium.io/v1/hotspots/location/box?nelat=${boundsNELat}&nelon=${boundsNELon}&swlat=${boundsSWLat}&swlon=${boundsSWLon}`,
  )
  const hotspots = await hotspotsResponse.json()
  let cursor = hotspots.cursor
  while (cursor !== undefined) {
    // if API returns a cursor, there are more than 500 hotspots and a cursor for the next set, so fetch the rest of them
    const moreHotspots = await fetchMore(bounds, cursor)
    // very important to update the cursor to the one returned by the next request so we don't cause an infinite loop
    cursor = moreHotspots.cursor
    hotspots.data.push(...moreHotspots.data)
  }

  hotspots.data.map((data) => {
    const hotspot = {
      ...data,
      location: [data.geocode.long_city, data.geocode.short_state]
        .filter(Boolean)
        .join(', '),
      status: data.status.online,
    }
    return hotspot
  })

  return hotspots
}

module.exports = { getCoverage, getCoverageFromBounds }
