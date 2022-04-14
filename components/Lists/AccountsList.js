import { useCallback } from 'react'
import BaseList from './BaseList'
import AccountAddress from '../AccountAddress'
import LargeBalance from '../Common/LargeBalance'
import AccountIcon from '../AccountIcon'

const AccountsList = ({ accounts }) => {
  const keyExtractor = useCallback((a) => a.address, [])

  const linkExtractor = useCallback((a) => `/accounts/${a.address}`, [])

  const renderTitle = useCallback((a) => {
    return (
      <div className="flex items-center justify-start space-x-1">
        <AccountIcon address={a.address} size={18} />
        <AccountAddress address={a.address} truncate />
      </div>
    )
  }, [])

  const renderSubtitle = useCallback((a) => {
    return (
      <div className="flex items-center space-x-2 w-full mt-2">
        <BalanceContainer title="Total Balance">
          <img src="/images/hnt.svg" className="w-3 mr-0.5" alt="" />
          <LargeBalance
            value={a.balance.floatBalance + a.stakedBalance.floatBalance}
            precision={2}
          />
        </BalanceContainer>
        <BalanceContainer title="Staked Balance">
          {a.stakedBalance.floatBalance === 0 ? (
            <span className="text-gray-550">none</span>
          ) : (
            <>
              <img src="/images/hnt.svg" className="w-3 mr-0.5" alt="" />
              <LargeBalance
                value={a.stakedBalance.floatBalance}
                precision={2}
              />
            </>
          )}
        </BalanceContainer>
        <BalanceContainer title="HST Balance">
          {a.secBalance.floatBalance === 0 ? (
            <span className="text-gray-550">none</span>
          ) : (
            <>
              <img src="/images/hst.svg" className="w-3 mr-0.5" alt="" />
              <LargeBalance value={a.secBalance.floatBalance} precision={2} />
            </>
          )}
        </BalanceContainer>
      </div>
    )
  }, [])

  const renderDetails = useCallback((a) => {
    return <span>#{a.rank}</span>
  }, [])

  const renderItem = useCallback(
    (item) => {
      return (
        <>
          <div className="w-full">
            <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
              {renderTitle(item)}
            </div>
            <div className="flex items-center space-x-4 h-10 text-gray-525 text-xs md:text-sm whitespace-nowrap">
              {renderSubtitle(item)}
            </div>
          </div>
          <div className="flex items-center px-4 text-xs md:text-sm font-sans text-gray-525">
            {renderDetails(item)}
          </div>
          <div className="flex items-center">
            <img src="/images/details-arrow.svg" alt="" />
          </div>
        </>
      )
    },
    [renderDetails, renderSubtitle, renderTitle],
  )

  return (
    <BaseList
      items={accounts}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      isLoading={false}
      renderItem={renderItem}
      blankTitle="No accounts"
    />
  )
}

const BalanceContainer = ({ title, children }) => (
  <div className="w-1/3 flex flex-col">
    <span className="text-xs uppercase tracking-wider">{title}</span>
    <span className="flex space-x-0.5 text-black">{children}</span>
  </div>
)

export default AccountsList
