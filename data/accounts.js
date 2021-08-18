import Balance, { CurrencyType } from '@helium/currency'
import camelcaseKeys from 'camelcase-keys'
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

export const fetchRichestAccounts = async () => {
  const accounts = await (await client.accounts.listRich()).take(100)
  const stats = await client.stats.get()

  const richAccounts = accounts.map((a, i) => {
    return {
      ...a,
      rank: i + 1,
      hntPercent:
        (a.balance.plus(a.stakedBalance).floatBalance / stats.tokenSupply) *
        100,
      hstPercent: (a.secBalance.floatBalance / 10000) * 100,
    }
  })

  return richAccounts
}

export const useRichestAccounts = () => {
  const key = 'accounts/richest'

  const { data, error } = useSWR(key, fetchRichestAccounts, {
    refreshInterval: 1000 * 60,
  })

  return {
    accounts: data,
    isLoading: !error && !data,
    isError: error,
  }
}
