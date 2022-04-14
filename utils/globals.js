import client from '../data/client'

export const validatorChallenges = async () => {
  const { poc_challenger_type: type } = await client.vars.get([
    'poc_challenger_type',
  ])
  return type === 'validator'
}
