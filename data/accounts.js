import useSWR from 'swr'
import client from './client'

export const fetchAccount = async (address) => {
  return client.accounts.get(address)
}

export const useAccount = (address) => {
  const key = `accounts/${address}`
  const fetcher = (address) => () => fetchAccount(address)

  const { data, error } = useSWR(key, fetcher(address), {
    refreshInterval: 1000 * 60,
  })

  return {
    account: data,
    isLoading: !error && !data,
    isError: error,
  }
}
