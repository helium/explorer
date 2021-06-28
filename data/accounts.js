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
  const [accounts, stats] = await Promise.all([
    fetch('https://api.helium.io/v1/accounts/rich')
      .then((res) => res.json())
      .then(($) => $.data),
    fetch('https://api.helium.io/v1/stats')
      .then((res) => res.json())
      .then(($) => $.data),
  ])

  return accounts.map((a, i) => {
    return {
      ...camelcaseKeys(a),
      rank: i + 1,
      balance: new Balance(a.balance, CurrencyType.networkToken),
      stakedBalance: new Balance(a.staked_balance, CurrencyType.networkToken),
      secBalance: new Balance(a.sec_balance, CurrencyType.security),
      hntPercent:
        ((a.balance + a.staked_balance) / 100000000 / stats.token_supply) * 100,
      hstPercent: (a.sec_balance / 1000000000000) * 100,
    }
  })
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
