import { useEffect, useState } from 'react'
import client from '../data/client'

const useChallengeIssuer = () => {
  const [challengeIssuer, setChallengeIssuer] = useState('hotspot')

  useEffect(() => {
    const fetchVar = async () => {
      const { pocChallengerType: type } = await client.vars.get([
        'poc_challenger_type',
      ])
      setChallengeIssuer(type)
    }
    fetchVar()
  }, [])

  return {
    challengeIssuer,
  }
}

export default useChallengeIssuer
