import { useMemo } from 'react'
import { useMarket } from '../../data/market'

const AccountBalanceWidget = ({ account }) => {
  const { market } = useMarket()

  const totalBalance = useMemo(() => {
    return account?.balance?.plus(account?.stakedBalance)
  }, [account])

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="text-gray-600 text-sm whitespace-nowrap">
        Total HNT Balance
      </div>

      <div className="my-1.5">
        <div className="text-2xl font-medium text-black tracking-tight w-full break-all">
          {maybeShowNone(totalBalance?.toString(2, { showTicker: false }))}
        </div>

        <div className="text-base text-gray-600 tracking-tight w-full break-all">
          $
          {totalBalance
            ?.times(market?.price)
            .toString(2, { showTicker: false })}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/dc.svg" />
          <span className="text-sm whitespace-nowrap">
            {account?.dcBalance?.toString(0, { showTicker: true })}
          </span>
        </div>
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/hst.svg" />
          <span className="text-sm whitespace-nowrap">
            {account?.secBalance?.toString(2, { showTicker: true })}
          </span>
        </div>
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/validator.svg" />
          <span className="text-sm whitespace-nowrap">
            {account?.stakedBalance?.toString(2, { showTicker: true })} staked
          </span>
        </div>
      </div>
    </div>
  )
}

const maybeShowNone = (value) => {
  if (value === '0') return <NoneValue />
  return value
}

const NoneValue = () => {
  return <span className="text-3xl text-gray-500">none</span>
}

export default AccountBalanceWidget
