import classNames from 'classnames'
import { useMemo } from 'react'
import Currency from '../Common/Currency'
import Skeleton from '../Common/Skeleton'

const MakerAccountBalanceWidget = ({ account }) => {
  const totalBalance = useMemo(() => {
    return account?.balance?.plus(account?.stakedBalance)
  }, [account])

  return (
    <div className="bg-gray-200 p-3 rounded-lg col-span-2">
      <div className="flex space-x-1 text-gray-600 text-sm whitespace-nowrap">
        <img src="/images/dc.svg" />
        <span>DC Balance</span>
      </div>

      <div className="my-1.5">
        <div className="text-3xl font-medium text-black tracking-tight w-full break-all">
          {!account ? (
            <Skeleton className="w-1/2 my-2.5" />
          ) : (
            <span>{account?.dcBalance?.toString(0)}</span>
          )}
        </div>

        <div className="text-base text-gray-600 tracking-tight w-full break-all">
          {!account ? (
            <Skeleton className="w-1/3 my-2" />
          ) : (
            <Currency value={account?.dcBalance?.toUsd().floatBalance} />
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/hnt.svg" className="w-4" />
          {!account ? (
            <Skeleton className="w-10 my-1" />
          ) : (
            <span
              className={classNames('text-sm whitespace-nowrap', {
                'text-gray-600': totalBalance?.integerBalance === 0,
              })}
            >
              {totalBalance?.toString(2)}
            </span>
          )}
        </div>
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/hst.svg" className="w-4" />
          {!account ? (
            <Skeleton className="w-10 my-1" />
          ) : (
            <span
              className={classNames('text-sm whitespace-nowrap', {
                'text-gray-600': account?.secBalance?.integerBalance === 0,
              })}
            >
              {account?.secBalance?.toString(2, { showTicker: true })}
            </span>
          )}
        </div>
        <div className="flex space-x-1 align-middle">
          <img alt="" src="/images/validator.svg" />
          {!account ? (
            <Skeleton className="w-16 my-1" />
          ) : (
            <span
              className={classNames('text-sm whitespace-nowrap', {
                'text-gray-600': account?.stakedBalance?.integerBalance === 0,
              })}
            >
              {account?.stakedBalance?.toString(2, { showTicker: true })} staked
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MakerAccountBalanceWidget
