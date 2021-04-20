import useSWR from 'swr'
import Client, { Network } from '@helium/http'

export const fetchElections = (network = 'production') => async () => {
  const clientNetwork =
    network === 'production' ? Network.production : Network.testnet
  console.log('client network', clientNetwork)
  console.log(Network.production)
  console.log(Network.testnet)
  const client = new Client(clientNetwork)
  const list = await client.elections.list()
  const elections = await list.take(20)

  const url =
    network === 'production'
      ? 'https://api.helium.io/v1/hotspots/elected'
      : 'https://testnet-api.helium.wtf/v1/validators/elected'

  console.log('url', url)
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
