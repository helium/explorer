import useSWR from 'swr'
import client, { TAKE_MAX } from './client'

export const fetchElections = () => async () => {
  const elections = await (await client.elections.list()).take(20)
  const currentConsensusGroup = await (await client.validators.elected()).take(TAKE_MAX)

  return {
    recentElections: elections,
    currentElection: currentConsensusGroup,
  }
}

export const useElections = (initialData) => {
  const { data, error } = useSWR(
    `consensusGroups`,
    fetchElections(),
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
