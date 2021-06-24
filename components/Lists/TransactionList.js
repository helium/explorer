import { useCallback } from 'react'
import Timestamp from 'react-timestamp'
import BaseList from './BaseList'
import { getTxnTypeName } from '../../utils/txns'
import animalHash from 'angry-purple-tiger'
import AccountIcon from '../AccountIcon'
import AccountAddress from '../AccountAddress'
import ChevronIcon from '../Icons/Chevron'

const TransactionList = ({
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  // const { selectTxn } = useSelectedTxn()

  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
    // if (txn.type === 'poc_receipts_v1') selectTxn(txn.hash)
  }, [])

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => `/txns/${txn.hash}`, [])

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
          <span className="flex items-center">
            <span className="flex items-center text-black font-sans font-medium">
              {txn.amount.toString(2)}
            </span>
          </span>
        )
      case 'payment_v2':
        return (
          <span className="flex items-center">
            <span className="flex items-center text-black font-sans font-medium">
              {txn.totalAmount.toString(2)}
            </span>
          </span>
        )
      case 'stake_validator_v1':
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
        <Timestamp date={txn.time} className="tracking-tight" />
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
      default:
        return timestamp
    }
  }, [])

  const renderDetails = useCallback((txn) => {
    return <span></span>
  }, [])

  return (
    <BaseList
      items={transactions}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectTxn}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No activity"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

export default TransactionList
