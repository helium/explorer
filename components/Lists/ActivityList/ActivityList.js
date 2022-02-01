import { useCallback } from 'react'
import BaseList from '../BaseList'
import {
  getPocReceiptRole,
  getTxnTypeColor,
  getTxnTypeName,
} from '../../../utils/txns'
import ExpandableListItem from './ExpandableActivityListItem'

const isExpandable = (txn) => {
  return (
    txn.type === 'rewards_v1' ||
    txn.type === 'rewards_v2' ||
    txn.type === 'rewards_v3' ||
    txn.type === 'poc_receipts_v1'
  )
}

const ActivityList = ({
  title,
  description,
  address,
  context,
  transactions,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const handleSelectTxn = useCallback((txn) => {
    console.log('selected txn', txn)
  }, [])

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => {
    if (isExpandable(txn)) return false
    return `/txns/${txn.hash}`
  }, [])

  const generateTitle = useCallback(
    (txn) => {
      switch (txn.type) {
        case 'poc_receipts_v1':
          return getTxnTypeName(getPocReceiptRole(txn.role), 'hotspot')
        case 'transfer_validator_stake_v1':
          return (
            <span>
              Stake Transfer
              {/* TODO: rewrite getStakeTransferRole for /roles */}
              {/* {getTxnTypeName(
                  getStakeTransferRole(txn, address),
                  'validator',
                )} */}
            </span>
          )
        case 'payment_v1':
        case 'payment_v2':
          return (
            <span>{txn.role === 'payer' ? 'Sent HNT' : 'Received HNT'}</span>
          )

        default:
          return getTxnTypeName(txn.type, context)
      }
    },
    [context],
  )

  const renderItem = useCallback(
    (txn) => {
      return (
        <ExpandableListItem
          txn={txn}
          address={address}
          context={context}
          title={generateTitle(txn)}
          linkTo={`/txns/${txn.hash}`}
          highlightColor={
            txn.type === 'poc_receipts_v1'
              ? getTxnTypeColor(getPocReceiptRole(txn.role))
              : getTxnTypeColor(txn.type)
          }
        />
      )
    },
    [address, context, generateTitle],
  )

  return (
    <BaseList
      isActivityList
      defaultBaseItem={false}
      listHeaderTitle={title}
      listHeaderDescription={description}
      items={transactions}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      expandableItem={() => true}
      onSelectItem={handleSelectTxn}
      isLoading={isLoading}
      renderItem={renderItem}
      blankTitle="No activity"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
      itemPadding={false}
    />
  )
}

export default ActivityList
