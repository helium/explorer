import useSWR from 'swr'
import client, { TAKE_MAX } from './client'

const fetchHotspotWitnessSums = async (address, numBack, bucketType) => {
  const list = await client.hotspot(address).witnesses.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const witnesses = await list.take(TAKE_MAX)
  return witnesses.reverse()
}

export const useHotspotWitnessSums = (
  address,
  numBack = 30,
  bucketType = 'day',
) => {
  const key = `witnesses/hotspots/${address}/${numBack}/${bucketType}`
  const fetcher = (address, numBack, bucketType) => () =>
    fetchHotspotWitnessSums(address, numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 1000 * 60 * 10,
  })

  return {
    witnesses: data,
    isLoading: !error && !data,
    isError: error,
  }
}
