const algoliasearch = require('algoliasearch')
const { Client } = require('@helium/http')

const algolia = algoliasearch('ZS8YIZ4JYF', process.env.ALGOLIA_API_KEY)
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
    }
  })

  await index.saveObjects(hotspotJSON)
}

syncHotspots()
