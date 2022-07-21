import Balance, { CurrencyType } from '@helium/currency'
import { memo, useCallback, useMemo } from 'react'

export const TokenType = {
  hnt: 0,
  hst: 1,
  mobile: 2,
  iot: 3
}

const SubnetworkRewardSummary = ({ txn, address }) => {
  const currencyType = useMemo(() => txn.token_type === undefined || txn.token_type === null
    ? CurrencyType.mobile
    : CurrencyType.fromTokenType(txn.token_type), [txn.token_type])

  const rewardsAmount = useMemo(() => txn.rewards
    ?.filter((subnetItem) => subnetItem.account === address)
    ?.reduce(
      (sum, current) =>
        sum.plus(new Balance(current.amount.integerBalance, currencyType)),
      new Balance(0, currencyType),
    ) || new Balance(0, currencyType), [address, currencyType, txn.rewards])

  const Icon = useCallback(() => {
    switch (txn.token_type) {
      case TokenType.mobile:
        return <img alt="" src="/images/mobile.svg" className="w-4 mr-1" />
      default:
        return null
    }
  }, [txn.token_type])

  return (
    <span className="flex items-center">
      <Icon />
      <span className="text-xs font-sans font-light tracking-tight">
        +{rewardsAmount.toString()}
      </span>
    </span>
  )
}
export default memo(SubnetworkRewardSummary)
