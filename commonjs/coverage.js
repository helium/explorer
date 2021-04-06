const { Client, Network } = require('@helium/http')
const geoJSON = require('geojson')

const MAX_HOTSPOTS_TO_FETCH = 200000

const toGeoJSON = (hotspots) =>
  geoJSON.parse(hotspots, {
    Point: ['lat', 'lng'],
    include: ['address', 'owner', 'location', 'status'],
  })

const getCoverage = async () => {
  const client = new Client(Network.staging)
  const list = await client.hotspots.list()
  const hotspots = await list.takeJSON(MAX_HOTSPOTS_TO_FETCH)
  const hotspotsWithLocation = hotspots.filter((h) => !!h.lat && !!h.lng)
  const onlineHotspots = hotspotsWithLocation.filter(
    (h) => h.status.online === 'online',
  )
  const offlineHotspots = hotspotsWithLocation.filter(
    (h) => h.status.online !== 'online',
  )

  // TODO don't split these into separate feature collections, just use conditional
  // mapbox styles based on the included attributes
  return {
    online: toGeoJSON(onlineHotspots),
    offline: toGeoJSON(offlineHotspots),
  }
}

module.exports = { getCoverage }
