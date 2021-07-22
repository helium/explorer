import Balance, { CurrencyType } from '@helium/currency'
import { useEffect, useMemo, useState } from 'react'
import useApi from '../hooks/useApi'

export const useMakers = () => {
  const { data: makersData } = useApi('/makers')

  const makers = useMemo(() => {
    if (!makersData) return []

    return makersData.map((m) => ({
      ...m,
      dcBalance: new Balance(
        m.balanceInfo.dcBalance.integerBalance,
        CurrencyType.dataCredit,
      ),
      burnedHNT: new Balance(
        m.txns.tokenBurnAmountInBones,
        CurrencyType.networkToken,
      ),
      assertsRemaining: Math.floor(
        m.balanceInfo.dcBalance.integerBalance / 5000000,
      ),
    }))
  }, [makersData])

  return { makers }
}

export const useMaker = (address) => {
  const { makers } = useMakers()
  const [maker, setMaker] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!makers) return
    setIsLoading(false)
    const maker = makers.find((m) => m.address === address)
    if (!maker) return
    setMaker(maker)
  }, [address, makers])

  return { maker, isLoading }
}
