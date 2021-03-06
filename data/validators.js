import useSWR from 'swr'
import Balance, { CurrencyType } from '@helium/currency'
import { API_BASE } from '../hooks/useApi'
import client from './client'
import camelcaseKeys from 'camelcase-keys'

export const fetchValidator = async (address) => {
  const response = await fetch(`${API_BASE}/validators/${address}`)
  const validator = await response.json()
  const stake = new Balance(validator.stake, CurrencyType.networkToken)
  return { ...camelcaseKeys(validator), stake }
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
  const response = await fetch(`${API_BASE}/accounts/${address}/validators`)
  const validators = await response.json()
  return validators.map((v) => ({
    ...camelcaseKeys(v),
    stake: new Balance(v.stake, CurrencyType.networkToken),
  }))
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
