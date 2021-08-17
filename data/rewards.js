import { getUnixTime } from 'date-fns'
import useSWR from 'swr'
import { fetchAll } from '../utils/pagination'
import client, { TAKE_MAX } from './client'

const NETWORK_DATES = [
  getUnixTime(new Date('2019-08-01')),
  getUnixTime(new Date('2021-08-01')),
]

const TARGET_PRODUCTION = {
  [NETWORK_DATES[0]]: 5000000,
  [NETWORK_DATES[1]]: 5000000 / 2,
}

const getTargetProduction = (timestamp) => {
  const unixTimestamp = getUnixTime(new Date(timestamp))
  if (unixTimestamp >= NETWORK_DATES[1]) {
    return TARGET_PRODUCTION[NETWORK_DATES[1]]
  }

  return TARGET_PRODUCTION[NETWORK_DATES[0]]
}

export const getHotspotRewardsBuckets = async (
  address,
  numBack,
  bucketType,
) => {
  if (!address) return
  const list = await client.hotspot(address).rewards.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const rewards = await list.take(TAKE_MAX)
  return rewards.reverse()
}

export const fetchHotspotRewardsSum = async (address, numBack, bucketType) => {
  // const value = await client.hotspot(address).rewards.sum.get('-1 day')
  // TODO need to fix helium-js to take min time in this format
  const response = await fetch(
    `https://api.helium.io/v1/hotspots/${address}/rewards/sum/?min_time=-${numBack}%20${bucketType}`,
  )
  const {
    data: { total },
  } = await response.json()
  return total
}

export const useHotspotRewardsSum = (
  address,
  numBack = 1,
  bucketType = 'day',
) => {
  const key = `rewards/hotspots/${address}/sum/${numBack}/${bucketType}`
  const fetcher = (address, numBack, bucketType) => () =>
    fetchHotspotRewardsSum(address, numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 0,
    dedupingInterval: 60 * 1000 * 10,
  })

  return {
    rewardsSum: data,
    isLoading: !error && data === undefined,
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
    target: getTargetProduction(r.timestamp) / 30,
  }))
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

export const getValidatorRewardsBuckets = async (
  address,
  numBack,
  bucketType,
) => {
  if (!address) return

  // TODO add to helium-js
  const rewards = await fetchAll(`/validators/${address}/rewards/sum`, {
    min_time: `-${numBack} ${bucketType}`,
    bucket: bucketType,
  })
  return rewards.reverse()
}

export const getAccountRewardsBuckets = async (
  address,
  numBack,
  bucketType,
) => {
  if (!address) return

  const list = await client.account(address).rewards.sum.list({
    minTime: `-${numBack} ${bucketType}`,
    maxTime: new Date(),
    bucket: bucketType,
  })
  const rewards = await list.take(TAKE_MAX)
  return rewards.reverse()
}

export const useRewardBuckets = (address, type, numBack = 30, bucketType = 'day') => {
  const key = `rewards/${type}s/${address}/${numBack}/${bucketType}`

  const fetcher = (address, numBack, bucketType) => () => {
    switch (type) {
      case 'account':
        return getAccountRewardsBuckets(address, numBack, bucketType)

      case 'hotspot':
        return getHotspotRewardsBuckets(address, numBack, bucketType)

      case 'validator':
        return getValidatorRewardsBuckets(address, numBack, bucketType)
    
      default:
        throw new Error('Invalid reward type')
    }
  }

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 1000 * 60 * 10,
  })

  return {
    rewards: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchValidatorRewardsSum = async (address, numBack, bucketType) => {
  const response = await fetch(
    `https://api.helium.io/v1/validators/${address}/rewards/sum/?min_time=-${numBack}%20${bucketType}`,
  )
  const {
    data: { total },
  } = await response.json()
  return total
}

export const useValidatorRewardsSum = (
  address,
  numBack = 1,
  bucketType = 'day',
) => {
  const key = `rewards/validators/${address}/sum/${numBack}/${bucketType}`
  const fetcher = (address, numBack, bucketType) => () =>
    fetchValidatorRewardsSum(address, numBack, bucketType)

  const { data, error } = useSWR(key, fetcher(address, numBack, bucketType), {
    refreshInterval: 0,
    dedupingInterval: 60 * 1000 * 10,
  })

  return {
    rewardsSum: data,
    isLoading: !error && data === undefined,
    isError: error,
  }
}
