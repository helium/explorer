import random from 'lodash/random'
import range from 'lodash/range'
import times from 'lodash/times'
import round from 'lodash/round'
import Client from '@helium/http'

const randomToken = () => Math.random().toString(36).substring(2, 15)

const randomAddress = () => times(4, randomToken).join('')

export const generateHotspot = () => ({
  address: randomAddress(),
  score: random(0.8, 0.999, true),
  hasKey: false,
})

export const fetchHotspots = async () => {
  const client = new Client()
  const list = await client.hotspots.list()
  const hotspotsList = await list.take(15000)
  if (hotspotsList) {
    // console.log(hotspotsList)
    const hotspots = hotspotsList.map((h) => ({
      location: h.geocode.longCity + ', ' + h.geocode.shortState,
      score: Math.round(h.score * 100),
      address: h.address,
      owner: h.owner,
      lat: h.lat,
      lng: h.lng,
    }))

    return hotspots.filter(function (item) {
      return item.lat
    })
  } else {
    return []
  }
}

const hotspots = range(random(25, 25)).map(generateHotspot)

export default hotspots
