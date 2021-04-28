import useSWR from 'swr'
import client, { TAKE_MAX } from './client'

export const fetchLatestBeacons = (count = 100) => async () => {
  const beacons = await (await client.challenges.list()).take(count)

  return JSON.parse(JSON.stringify(beacons))
}

export const fetchBeacon = async (hash) => {
  const beacon = await client.transactions.get(hash)

  return JSON.parse(JSON.stringify(beacon))
}

export const useLatestBeacons = (initialData, count = 100) => {
  const { data, error } = useSWR('latestBeacons', fetchLatestBeacons(count), {
    initialData,
    refreshInterval: 10000,
  })
  return {
    latestBeacons: data,
    isLoading: !error && !data,
    isError: error,
  }
}

const fetchHotspotBeaconSums = async (address, numBack, bucketType) => {
  const list = await client.hotspot(address).challenges.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const witnesses = await list.take(TAKE_MAX)
  return witnesses.reverse()
}

export const useHotspotBeaconSums = (
  address,
  numBack = 30,
  bucketType = 'day',
) => {
  const key = `beacons/hotspots/${address}/${numBack}/${bucketType}`
  const fetcher = (address, numBack, bucketType) => () =>
    fetchHotspotBeaconSums(address, numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 1000 * 60 * 10,
  })

  return {
    beaconSums: data,
    isLoading: !error && !data,
    isError: error,
  }
}
