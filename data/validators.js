import useSWR from 'swr'
import Balance, { CurrencyType } from '@helium/currency'

export const fetchValidator = async (address) => {
  const response = await fetch(`/api/validators/${address}`)
  const validator = await response.json()
  const stake = new Balance(validator.stake, CurrencyType.networkToken)
  return { ...validator, stake }
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
