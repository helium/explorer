import { getUnixTime } from 'date-fns'
import useSWR from 'swr'
import { fetchAll } from '../utils/pagination'
import client, { TAKE_MAX } from './client'

const TARGET_PRODUCTION = {
  [getUnixTime(new Date('2019-08-01'))]: 5000000,
  [getUnixTime(new Date('2021-08-01'))]: 5000000 / 2,
}

const getTargetProduction = (timestamp) => {}

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
  const rewards = await list.take(TAKE_MAX)
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

export const getNetworkRewardsBuckets = async (numBack, bucketType) => {
  const rewards = await fetchAll('/rewards/sum', {
    min_time: `-${numBack} ${bucketType}`,
    bucket: bucketType,
  })
  const rewardsWithTarget = rewards.map((r) => ({
    ...r,
    target: (5000000 * 12) / 365,
  }))
  console.log('fetch results rewards', rewardsWithTarget)
  return rewardsWithTarget.reverse()
}

export const useNetworkRewards = (numBack = 30, bucketType = 'day') => {
  const key = `rewards/network/${numBack}/${bucketType}`
  const fetcher = (numBack, bucketType) => () =>
    getNetworkRewardsBuckets(numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(numBack, bucketType), {
    refreshInterval: 1000 * 60 * 10,
  })

  return {
    rewards: data,
    isLoading: !error && !data,
    isError: error,
  }
}
