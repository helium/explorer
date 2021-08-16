import useSWR from 'swr'
import Client, { Network } from '@helium/http'
import client, { TAKE_MAX } from './client'

export const fetchElections = (network = 'production') => async () => {
  const clientNetwork =
    network === 'production' ? Network.production : Network.testnet
  const client = new Client(clientNetwork)
  const list = await client.elections.list()
  const elections = await list.take(20)

  const url =
    network === 'production'
      ? 'https://api.helium.io/v1/validators/elected'
      : 'https://testnet-api.helium.wtf/v1/validators/elected'

  // TODO: convert this to helium-js
  const res = await fetch(url)
  const currentConsensusGroup = await res.json()

  return {
    recentElections: elections,
    currentElection: currentConsensusGroup.data,
  }
}

export const useElections = (initialData, network = 'production') => {
  const { data, error } = useSWR(
    `consensusGroups/${network}`,
    fetchElections(network),
    {
      initialData,
      refreshInterval: 10000,
    },
  )
  return {
    consensusGroups: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchElected = async () => {
  const list = await client.validators.elected()
  const validators = await list.take(TAKE_MAX)
  return validators
}

export const useConsensusGroup = (initialData) => {
  const { data, error } = useSWR(
    'consensusGroup',
    fetchElected,
    {
      initialData,
      refreshInterval: 10000,
    },
  )
  return {
    consensusGroup: data,
    isLoading: !error && !data,
    isError: error,
  }
}
