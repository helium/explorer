import { useEffect, useState } from 'react'
import client from '../data/client'

const useChallengeIssuer = () => {
  const [challengeIssuer, setChallengeIssuer] = useState('hotspot')
  const [challengeIssuerLoading, setChallengeIssuerLoading] = useState(true)

  useEffect(() => {
    const fetchVar = async () => {
      setChallengeIssuerLoading(true)
      const { pocChallengerType: type } = await client.vars.get([
        'poc_challenger_type',
      ])
      if (type !== undefined) {
        setChallengeIssuer(type)
      }
      setChallengeIssuerLoading(false)
    }
    fetchVar()
  }, [])

  return {
    challengeIssuer,
    challengeIssuerLoading,
  }
}

export default useChallengeIssuer
