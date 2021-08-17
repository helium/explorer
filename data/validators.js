import useSWR from 'swr'
import client, { TAKE_MAX } from './client'
import { useCallback, useState } from 'react'
import { useAsync } from 'react-async-hook'

export const fetchValidator = async (address) => {
  return client.validators.get(address)
}

export const useValidator = (address) => {
  const key = `validators/${address}`
  const fetcher = (address) => () => fetchValidator(address)

  const { data, error } = useSWR(key, fetcher(address), {
    refreshInterval: 1000 * 60,
  })

  return {
    validator: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchAccountValidators = async (address) => {
  return (await client.account(address).validators.list()).take(TAKE_MAX)
}

export const useAccountValidators = (address) => {
  const key = `account/${address}/validators`
  const fetcher = (address) => () => fetchAccountValidators(address)

  const { data, error } = useSWR(key, fetcher(address), {
    refreshInterval: 1000 * 60,
  })

  return {
    validators: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchValidatorStats = async () => {
  return client.validators.stats.get()
}

export const useValidatorStats = () => {
  const key = 'validators/stats'
  const fetcher = () => fetchValidatorStats()

  const { data, error } = useSWR(key, fetcher, {
    refreshInterval: 1000 * 60,
  })

  return {
    stats: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const useValidators = (context, address, pageSize = 20) => {
  const [list, setList] = useState()
  const [validators, setValidators] = useState([])
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const makeList = () => {
    if (!context || !address) {
      return client.validators.list()
    }

    if (context === 'account') {
      return client.account(address).validators.list()
    }
  }

  useAsync(async () => {
    const newList = await makeList()
    setList(newList)
  }, [])

  useAsync(async () => {
    if (!list) return
    setIsLoadingMore(true)
    const newValidators = await list.take(pageSize)
    setValidators(newValidators)
    setIsLoadingMore(false)
    setIsLoadingInitial(false)
    if (newValidators.length < pageSize) {
      setHasMore(false)
    }
  }, [list])

  const fetchMore = useCallback(async () => {
    const newValidators = await list.take(pageSize)
    setValidators([...validators, ...newValidators])
  }, [list, pageSize, validators])

  return { validators, fetchMore, isLoadingInitial, isLoadingMore, hasMore }
}
