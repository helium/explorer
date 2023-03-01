import { format, getUnixTime, sub } from 'date-fns'
import useSWR from 'swr'
import client, { TAKE_MAX } from './client'
import { fetchApi } from '../hooks/useApi'
import qs from 'qs'

const NETWORK_DATES = [
  getUnixTime(new Date('2019-08-01')),
  getUnixTime(new Date('2021-08-01')),
]

const TARGET_PRODUCTION = {
  [NETWORK_DATES[0]]: 5000000,
  [NETWORK_DATES[1]]: 5000000 / 2,
}

const getUTCTimeStamp = (date) => {
  const year = date.getUTCFullYear()
  const month = (date.getUTCMonth() + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  const day = date.getUTCDate().toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
  return `${year}-${month}-${day}`
}

const getTargetProduction = (timestamp) => {
  const unixTimestamp = getUnixTime(new Date(timestamp))
  if (unixTimestamp >= NETWORK_DATES[1]) {
    return TARGET_PRODUCTION[NETWORK_DATES[1]]
  }

  return TARGET_PRODUCTION[NETWORK_DATES[0]]
}

const getRewardsSumParams = ({ bucket, numBack }) => {
  const maxTime = new Date()
  if (bucket === 'day') {
    maxTime.setUTCHours(0, 0, 0, 0)
  } else {
    maxTime.setUTCMinutes(0, 0, 0)
  }
  return {
    minTime: `-${numBack} ${bucket}`,
    maxTime,
    bucket,
  }
}

export const getHotspotRewardsBuckets = async (address, numBack, bucket) => {
  if (!address) return

  const params = getRewardsSumParams({ bucket, numBack })
  const list = await client.hotspot(address).rewards.sum.list(params)
  const rewards = await list.take(TAKE_MAX)
  return rewards.reverse()
}

export const getHotspotRadioRewardsBuckets = async (address, numBack) => {
  if (!address) return

  // set base time back 2 hours for reward processing time
  const baseTime = sub(new Date(), { hours: 2 })
  const start = sub(baseTime, { days: 1 })
  const end = sub(baseTime, { days: numBack })

  const rewards = await fetchApi('v1')(
    `/cell/hotspots/${address}/rewards?` +
      qs.stringify({
        max_date: getUTCTimeStamp(start),
        min_date: getUTCTimeStamp(end),
      }),
  )
  return rewards.reverse()
}

export const getRadioRewardsBuckets = async (
  address,
  radioAddress,
  numBack,
) => {
  if (!address || !radioAddress) return

  // set base time back 2 hours for reward processing time
  const baseTime = sub(new Date(), { hours: 2 })
  const start = sub(baseTime, { days: 1 })
  const end = sub(baseTime, { days: numBack })

  const rewards = await fetchApi('v1')(
    `/cell/hotspots/${address}/cells/${radioAddress}/rewards?` +
      qs.stringify({
        max_date: getUTCTimeStamp(start),
        min_date: getUTCTimeStamp(end),
      }),
  )
  return rewards.reverse()
}

export const fetchHotspotRewardsSum = async (address, numBack, bucketType) => {
  const { total } = await client
    .hotspot(address)
    .rewards.sum.get(`-${numBack} ${bucketType}`)
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

export const getNetworkRewardsBuckets = async (numBack, bucket) => {
  const params = getRewardsSumParams({ bucket, numBack })
  const rewards = await (await client.rewards.sum.list(params)).take(TAKE_MAX)
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
    refreshInterval: 1000 * 60 * 60,
  })

  return {
    rewards: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getValidatorRewardsBuckets = async (address, numBack, bucket) => {
  if (!address) return

  const params = getRewardsSumParams({ bucket, numBack })

  const list = await client.validator(address).rewards.sum.list(params)
  const rewards = await list.take(TAKE_MAX)
  return rewards.reverse()
}

export const getAccountRewardsBuckets = async (address, numBack, bucket) => {
  if (!address) return

  const params = getRewardsSumParams({ bucket, numBack })
  const list = await client.account(address).rewards.sum.list(params)
  const rewards = await list.take(TAKE_MAX)
  return rewards.reverse()
}

export const useRewardBuckets = (
  address,
  type,
  numBack = 30,
  bucketType = 'day',
  radioAddress,
) => {
  const key = `rewards/${type}s/${address}/${numBack}/${bucketType}/${radioAddress}`

  const fetcher = (address, numBack, bucketType, radioAddress) => () => {
    switch (type) {
      case 'account':
        return getAccountRewardsBuckets(address, numBack, bucketType)

      case 'hotspot':
        return getHotspotRewardsBuckets(address, numBack, bucketType)

      case 'validator':
        return getValidatorRewardsBuckets(address, numBack, bucketType)

      case 'hotspotRadios':
        return getHotspotRadioRewardsBuckets(address, numBack)

      case 'radio':
        return getRadioRewardsBuckets(address, radioAddress, numBack)

      default:
        throw new Error('Invalid reward type')
    }
  }

  const { data, error } = useSWR(
    key,
    fetcher(address, numBack, bucketType, radioAddress),
    {
      refreshInterval: 1000 * 60 * 10,
    },
  )

  return {
    rewards: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchValidatorRewardsSum = async (
  address,
  numBack,
  bucketType,
) => {
  const { total } = await client
    .validator(address)
    .rewards.sum.get(`-${numBack} ${bucketType}`)
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
