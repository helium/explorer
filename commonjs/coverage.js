const { Client, Network } = require('@helium/http')
const geoJSON = require('geojson')

const MAX_HOTSPOTS_TO_FETCH = 200000

const toGeoJSON = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

const getCoverage = async () => {
  // TODO switch back to prod API when things are better
  const client = new Client(Network.staging)
  const list = await client.hotspots.list()
  const hotspots = await list.takeJSON(MAX_HOTSPOTS_TO_FETCH)
  const hotspotsWithLocation = hotspots
    .filter((h) => !!h.lat && !!h.lng)
    .map((h) => ({
      ...h,
      location: [h.geocode.longCity, h.geocode.shortState]
        .filter(Boolean)
        .join(', '),
      status: h.status.online,
    }))
  const onlineHotspots = hotspotsWithLocation.filter(
    (h) => h.status === 'online',
  )
  const offlineHotspots = hotspotsWithLocation.filter(
    (h) => h.status !== 'online',
  )

  // TODO don't split these into separate feature collections, just use conditional
  // mapbox styles based on the included attributes
  return {
    online: toGeoJSON(onlineHotspots),
    offline: toGeoJSON(offlineHotspots),
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

const emptyCoverage = () => {
  return toGeoJSON([])
}

module.exports = { getCoverage, getCoverageFromBounds, emptyCoverage }
