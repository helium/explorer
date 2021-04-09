const { Client, Network } = require('@helium/http')
const geoJSON = require('geojson')

const MAX_HOTSPOTS_TO_FETCH = 200000

const toGeoJSON = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

const toGeoJSONv2 = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status', 'blockAdded'],
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

const getCoverageV2 = async () => {
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

  return toGeoJSONv2(hotspotsWithLocation)
}

const emptyCoverage = () => {
  return toGeoJSON([])
}

module.exports = { getCoverage, getCoverageV2, emptyCoverage }
