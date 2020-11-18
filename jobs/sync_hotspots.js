const algoliasearch = require('algoliasearch')
const { Client } = require('@helium/http')

const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY,
)
const index = algolia.initIndex('hotspots')

const MAX_HOTSPOTS = 100000

const syncHotspots = async () => {
  const client = new Client()

  const hotspots = await client.hotspots.list()
  const allHotspots = await hotspots.take(MAX_HOTSPOTS)

  const hotspotJSON = allHotspots.map((hotspot) => {
    const serialized = JSON.parse(JSON.stringify(hotspot))
    delete serialized['client']

    return {
      ...serialized,
      objectID: serialized.address,
      _geoloc: {
        lat: serialized.lat ? parseFloat(serialized.lat) : undefined,
        lng: serialized.lng ? parseFloat(serialized.lng) : undefined,
      },
    }
  })

  await index.saveObjects(hotspotJSON)
}

syncHotspots()
