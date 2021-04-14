import useSWR from 'swr'
import Client from '@helium/http'

const client = new Client()

export const getHotspotRewardsBuckets = async (
  address,
  numBack,
  bucketType,
) => {
  const list = await client.hotspot(address).rewards.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const rewards = await list.take(100000)
  return rewards.reverse()
}

export const useHotspotRewards = (
  address,
  numBack = 30,
  bucketType = 'day',
) => {
  const key = `rewards/hotspots/${address}/${numBack}/${bucketType}`
  const fetcher = (address, numBack, bucketType) => () =>
    getHotspotRewardsBuckets(address, numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 1000 * 60 * 10,
  })

  return {
    rewards: data,
    isLoading: !error && !data,
    isError: error,
  }
}
