import classNames from 'classnames'
import { memo, useCallback } from 'react'
import { useFetchBlockTxns } from '../../../data/blocks'
import { getTxnTypeColor, getTxnTypeName } from '../../../utils/txns'
import BlockTimestamp from '../../Common/BlockTimestamp'
import BaseList from '../../Lists/BaseList'
import animalHash from 'angry-purple-tiger'
import AccountIcon from '../../AccountIcon'
import AccountAddress from '../../AccountAddress'
import ChevronIcon from '../../Icons/Chevron'
import ActivityColorSlice from '../../Lists/ActivityList/ActivityColorSlice'

const BlockTransactionsList = ({ height }) => {
  const {
    results: txns,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useFetchBlockTxns(height)

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => `/txns/${txn.hash}`, [])

  const renderTxnType = useCallback((txn) => {
    return (
      <span className="text-xs text-gray-700 whitespace-nowrap">
        {getTxnTypeName(txn.type)}
      </span>
    )
  }, [])

  const renderTitle = useCallback((txn) => {
    switch (txn.type) {
      case 'poc_request_v1':
        return (
          <span className="flex items-center">
            <span className="flex items-center text-black font-sans font-medium">
              {animalHash(txn.challenger)}
            </span>
          </span>
        )
      case 'poc_receipts_v1':
        return (
          <span className="flex items-center">
            <span className="flex items-center text-black font-sans font-medium">
              {animalHash(txn.path[0].challengee)}
            </span>
          </span>
        )
      case 'add_gateway_v1':
        return (
          <span className="flex items-center text-black font-sans font-medium">
            {animalHash(txn.gateway)}
          </span>
        )
      case 'assert_location_v1':
      case 'assert_location_v2':
        return (
          <span className="flex items-center text-black font-sans font-medium">
            {animalHash(txn.gateway)}
          </span>
        )
      case 'payment_v1':
        return (
          <span className="flex items-center whitespace-nowrap">
            <span className="flex items-center text-black font-sans font-medium">
              {txn.amount.toString(2)}
            </span>
          </span>
        )
      case 'payment_v2':
        return (
          <span className="flex items-center whitespace-nowrap">
            <span className="flex items-center text-black font-sans font-medium">
              {txn.totalAmount.toString(2)}
            </span>
          </span>
        )
      case 'stake_validator_v1':
      case 'validator_heartbeat_v1':
        return (
          <span className="flex items-center">
            <span className="flex items-center text-black font-sans font-medium">
              {animalHash(txn.address)}
            </span>
          </span>
        )
      default:
        return <span className="text-black">{getTxnTypeName(txn.type)}</span>
    }
  }, [])

  const renderSubtitle = useCallback((txn) => {
    const timestamp = (
      <span className="flex items-center space-x-1">
        <img alt="" src="/images/clock.svg" className="h-3 w-auto" />
        <BlockTimestamp blockTime={txn.time} className="tracking-tight" />
      </span>
    )
    switch (txn.type) {
      case 'poc_request_v1':
        const address = txn.challengerOwner ? txn.challengerOwner : txn.owner
        return (
          <div className="flex items-center justify-end text-gray-600">
            {address ? (
              <>
                <AccountIcon size={12} address={address} />
                <span className="pl-1 ">
                  <AccountAddress
                    clickable={false}
                    address={address}
                    truncate={4}
                    mono
                  />
                </span>
              </>
            ) : (
              timestamp
            )}
          </div>
        )
      case 'add_gateway_v1':
        return (
          <div className="flex items-center justify-end text-gray-600">
            <AccountIcon size={12} address={txn.owner} />
            <span className="pl-1 ">
              <AccountAddress
                clickable={false}
                address={txn.owner}
                truncate={4}
                mono
              />
            </span>
          </div>
        )
      case 'poc_receipts_v1':
        return (
          <span className="flex items-center">
            <img
              alt=""
              src="/images/challenger-icon.svg"
              className="h-3 w-auto"
            />
            <span className="ml-1.5 whitespace-nowrap text-sm font-sans">
              {animalHash(txn.challenger)}
            </span>
            <span className="ml-3 flex flex-row items-center justify-start">
              <img
                alt=""
                src="/images/witness-yellow-mini.svg"
                className="h-3 w-auto"
              />
              <span className="ml-1.5 text-sm font-sans">
                {txn.path[0].witnesses.length}
              </span>
            </span>
          </span>
        )
      case 'assert_location_v1':
      case 'assert_location_v2':
        return (
          <span className="flex items-center space-x-1">
            <img
              alt=""
              src="/images/location-hex.svg"
              className="h-3 w-auto mr-1"
            />
            {txn.location}
          </span>
        )
      case 'payment_v1':
        return (
          <span className="flex items-center space-x-2">
            <div className="flex items-center justify-end text-gray-600">
              <AccountIcon size={12} address={txn.payer} />
              <span className="pl-1 ">
                <AccountAddress
                  clickable={false}
                  address={txn.payer}
                  truncate={4}
                  mono
                />
              </span>
            </div>
            <ChevronIcon className="text-gray-600 rotate-90 transform h-3 w-auto" />
            <div className="flex items-center justify-end text-gray-600">
              <AccountIcon size={12} address={txn.payee} />
              <span className="pl-1 ">
                <AccountAddress
                  clickable={false}
                  address={txn.payee}
                  truncate={4}
                  mono
                />
              </span>
            </div>
          </span>
        )
      case 'payment_v2':
        return (
          <span className="flex items-center space-x-2">
            <div className="flex items-center justify-end text-gray-600">
              <AccountIcon size={12} address={txn.payer} />
              <span className="pl-1 ">
                <AccountAddress
                  clickable={false}
                  address={txn.payer}
                  truncate={4}
                  mono
                />
              </span>
            </div>
            <ChevronIcon className="text-gray-600 rotate-90 transform h-3 w-auto" />
            {txn.payments.length === 1 ? (
              <div className="flex items-center justify-end text-gray-600">
                <AccountIcon size={12} address={txn.payments[0].payee} />
                <span className="pl-1 ">
                  <AccountAddress
                    clickable={false}
                    address={txn.payments[0].payee}
                    truncate={4}
                    mono
                  />
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end text-gray-600">
                {txn.payments.length} payees
              </div>
            )}
          </span>
        )
      case 'stake_validator_v1':
        return (
          <span className="flex items-center space-x-1 md:space-x-3">
            <div className="flex items-center justify-end text-gray-600">
              <AccountIcon size={12} address={txn.owner} />
              <span className="pl-1 ">
                <AccountAddress
                  clickable={false}
                  address={txn.owner}
                  truncate={4}
                  mono
                />
              </span>
            </div>
            <span className="flex items-center justify-start space-x-1">
              <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
              {txn.stake.toString(2)}
            </span>
          </span>
        )
      case 'validator_heartbeat_v1':
        return (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-txn-heartbeat"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1">{txn.version}</span>
          </span>
        )
      default:
        return timestamp
    }
  }, [])

  const renderDetails = useCallback((t) => {
    return null
  }, [])

  const renderItem = useCallback(
    (txn) => {
      return (
        <>
          <ActivityColorSlice highlightColor={getTxnTypeColor(txn.type)} />
          <div className="w-full px-4 py-2">
            <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans whitespace-nowrap">
              {renderTxnType(txn)}
            </div>
            <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans whitespace-nowrap">
              {renderTitle(txn)}
            </div>
            <div className="flex items-center space-x-4 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
              {renderSubtitle(txn)}
            </div>
          </div>
          <div className="flex items-center px-4 text-xs md:text-sm font-sans text-gray-525">
            {renderDetails(txn)}
          </div>
          {linkExtractor && (
            <div className="flex items-center px-4">
              <img alt="" src="/images/details-arrow.svg" />
            </div>
          )}
        </>
      )
    },
    [linkExtractor, renderDetails, renderSubtitle, renderTitle, renderTxnType],
  )

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <BaseList
        items={txns}
        keyExtractor={keyExtractor}
        linkExtractor={linkExtractor}
        isLoading={!txns || isLoadingInitial}
        fetchMore={fetchMore}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        renderDetails={renderDetails}
        blankTitle="No Transactions"
        renderItem={renderItem}
        render
        itemPadding={false}
      />
    </div>
  )
}

export default memo(BlockTransactionsList)
