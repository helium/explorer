const { Client } = require('@helium/http')
const geoJSON = require('geojson')
const fs = require('fs').promises

const API_KEY = process.env.MAPBOX_SECRET_DATASET_KEY

const generateCoverage = async () => {
  if (!API_KEY) {
    console.error('Mapbox API key required')
    return
  }

  console.log('generating coverage data...')

  const client = new Client()
  const list = await client.hotspots.list()
  const hotspotsList = await list.take(100000)

  const hotspots = hotspotsList
    .map((h) => ({
      location: h.geocode.longCity + ', ' + h.geocode.shortState,
      address: h.address,
      owner: h.owner,
      lat: h.lat,
      lng: h.lng,
    }))
    .filter((h) => !!h.lat && !!h.lng)

  const coverageData = geoJSON.parse(hotspots, { Point: ['lat', 'lng'] })

  await fs.writeFile('hotspots.geojson', JSON.stringify(coverageData))

  console.log('finished generating coverage data')
}

generateCoverage()
