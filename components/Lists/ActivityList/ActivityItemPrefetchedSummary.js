import Skeleton from '../../Common/Skeleton'
import FlagLocation from '../../Common/FlagLocation'
import AccountIcon from '../../AccountIcon'
import AccountAddress from '../../AccountAddress'
import { memo } from 'react'

const SummaryContent = ({ txn, address, role }) => {
  if (txn.type === 'payment_v1') {
    const amount = txn.amount.toString(2)

    const isSender = role === 'payer'
    const sender = isSender ? address : txn.payer

    return (
      <span className="flex items-center">
        <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
        <span className="text-xs font-sans font-light tracking-tight flex items-center justify-start">
          {amount} {isSender ? 'to' : 'from'}
          <div className="ml-1">
            <span className="flex flex-row items-center justify-start space-x-0.5 ml-1">
              <AccountIcon address={sender} size={12} />
              <AccountAddress
                showSecondHalf={false}
                mono
                address={sender}
                truncate={4}
              />
            </span>
          </div>
        </span>
      </span>
    )
  } else if (txn.type === 'payment_v2') {
    if (role === 'payee') {
      const amount =
        txn.payments.length === 1
          ? txn.totalAmount.toString(2)
          : txn.payments
              .find((payment) => payment.payee === address)
              .amount.toString(2)

      return (
        <span className="flex items-center">
          <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
          <span className="text-xs font-sans font-light tracking-tight flex items-center justify-start">
            {amount} from
            <div className="ml-1">
              <span className="flex flex-row items-center justify-start space-x-0.5">
                <AccountIcon address={txn.payer} size={12} />
                <AccountAddress
                  showSecondHalf={false}
                  mono
                  address={txn.payer}
                  truncate={5}
                />
              </span>
            </div>
          </span>
        </span>
      )
    } else if (role === 'payer') {
      const amount = txn.totalAmount.toString(3)
      return (
        <span className="flex items-center">
          <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
          <span className="text-xs font-sans font-light tracking-tight flex items-center justify-start">
            {amount} to
            <div className="ml-1">
              {txn?.payments?.length === 1 ? (
                <span className="flex flex-row items-center justify-start space-x-0.5">
                  <AccountIcon address={txn.payments[0].payee} size={12} />
                  <AccountAddress
                    showSecondHalf={false}
                    mono
                    address={txn.payments[0].payee}
                    truncate={4}
                  />
                </span>
              ) : (
                'multiple recipients'
              )}
            </div>
          </span>
        </span>
      )
    }
  } else if (txn.type.startsWith('poc_receipts')) {
    if (role === 'witness' || role === 'challengee') {
      return (
        <div className="flex flex-row items-center justify-start space-x-2">
          <div className="flex items-center justify-center">
            <img
              src="/images/witness-yellow-mini.svg"
              className="w-3.5 h-auto"
              alt=""
            />
            <span className="text-xs font-sans font-light text-black ml-1">
              {txn?.numberOfValidWitnesses}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/images/witness-gray.svg"
              className="w-3.5 h-auto"
              alt=""
            />
            <span className="text-xs font-sans font-light text-black ml-1">
              {txn?.numberOfInvalidWitnesses}
            </span>
          </div>
          <span className="text-xs font-sans font-light text-black ml-1">
            <FlagLocation geocode={txn.path[0].geocode} condensedView />
          </span>
        </div>
      )
    } else if (role === 'challenger') {
      return (
        <div className="flex flex-row items-center justify-start space-x-2 text-xs">
          <FlagLocation geocode={txn.path[0].geocode} condensedView />
        </div>
      )
    }
  } else if (txn.type.startsWith('rewards')) {
    return (
      <span className="flex items-center">
        <img alt="" src="/images/hnt.svg" className="w-4 mr-1" />
        <span className="text-xs font-sans font-light tracking-tight">
          +{txn.totalAmount.toString(3)}
        </span>
      </span>
    )
  }

  // we can also return other types that won't be prefetched, but will show up as a
  // subtitle /after/ the item has been expanded and then re-collapsed
  return null
}

const ActivityItemPrefetchedSummary = ({
  txn,
  address,
  role,
  detailsLoading,
}) => {
  if (detailsLoading) {
    return <Skeleton className="w-1/2 opacity-80" />
  }
  return (
    <div className="opacity-80">
      <SummaryContent txn={txn} address={address} role={role} />
    </div>
  )
}

export default memo(ActivityItemPrefetchedSummary)
