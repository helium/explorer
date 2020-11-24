const { Client } = require('@helium/http')
const fetch = require('node-fetch')
const geoJSON = require('geojson')
const keyBy = require('lodash/keyBy')
const difference = require('lodash/difference')
const mbxDatasets = require('@mapbox/mapbox-sdk/services/datasets')

const API_KEY = process.env.MAPBOX_SECRET_DATASET_KEY
const DATASET_ID = process.env.MAPBOX_COVERAGE_DATASET_ID
const TILESET_ID = process.env.MAPBOX_COVERAGE_TILESET_ID

const datasetClient = mbxDatasets({ accessToken: API_KEY })

const fetchDataset = () => {
  console.log('fetching Mapbox dataset...')

  if (!API_KEY) {
    console.error('Mapbox API key required')
    return
  }

  let dataset = []
  let count = 0

  return new Promise((resolve, reject) => {
    datasetClient
      .listFeatures({ datasetId: DATASET_ID })
      .eachPage((error, response, next) => {
        count += 1
        console.log('fetching page', count)

        if (error) {
          console.error(error)
          reject(error)
        }

        if (response.body && response.body.features) {
          dataset = [...dataset, ...response.body.features]
        }

        if (!response.hasNextPage()) {
          resolve(dataset)
        }

        next()
      })
  })
}

const fetchHotspots = async () => {
  console.log('fetching hotspots...')

  const client = new Client()
  const list = await client.hotspots.list()
  const hotspotsList = await list.take(100000)

  return hotspotsList
    .map((h) => ({
      location: h.geocode.longCity + ', ' + h.geocode.shortState,
      address: h.address,
      owner: h.owner,
      lat: h.lat,
      lng: h.lng,
    }))
    .filter((h) => !!h.lat && !!h.lng)
}

const insertHotspot = (hotspot) => {
  console.log('inserting hotspot', hotspot.address, 'as a new feature')
  const feature = geoJSON.parse(hotspot, { Point: ['lat', 'lng'] })
  return new Promise((resolve, reject) => {
    datasetClient
      .putFeature({
        datasetId: DATASET_ID,
        featureId: hotspot.address,
        feature,
      })
      .send()
      .then((response) => {
        resolve(response.body)
      })
      .catch((reason) => {
        console.error(reason)
        reject(reason)
      })
  })
}

const publishTileset = async () => {
  console.log('Publishing tileset...')

  // have to do this with fetch because something is broken in their sdk
  // https://github.com/mapbox/mapbox-sdk-js/issues/392
  const response = await fetch(
    `https://api.mapbox.com/uploads/v1/petermain?access_token=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        tileset: TILESET_ID,
        url: `mapbox://datasets/petermain/${DATASET_ID}`,
        name: 'hotspots',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    },
  )
  const body = await response.json()
  console.log(body)
}

const syncCoverage = async () => {
  const dataset = await fetchDataset()
  const hotspots = await fetchHotspots()

  // Insert new hotspots into dataset
  const datasetAddresses = dataset.map(({ properties }) => properties.address)
  const hotspotLookup = keyBy(hotspots, 'address')
  const hotspotAddresses = Object.keys(hotspotLookup)

  const newHotspotAddresses = difference(hotspotAddresses, datasetAddresses)
  await newHotspotAddresses.reduce(async (previousPromise, nextAddress) => {
    await previousPromise
    return insertHotspot(hotspotLookup[nextAddress])
  }, Promise.resolve())

  // TODO Update hotspots that have changed location

  // Publish Mapbox tileset with updated dataset
  await publishTileset()

  console.log('finished syncing coverage')
}

syncCoverage()
