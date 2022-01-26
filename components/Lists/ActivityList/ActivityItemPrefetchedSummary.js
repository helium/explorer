import Skeleton from '../../Common/Skeleton'
import FlagLocation from '../../Common/FlagLocation'
import AccountIcon from '../../AccountIcon'
import AccountAddress from '../../AccountAddress'
import { memo } from 'react'
import { getPocReceiptRoleFromFullTxn } from '../../../utils/txns'
import { h3ToGeo } from 'h3-js'
import { calculateDistance, formatHexDistance } from '../../../utils/distance'

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
    if (role === 'witness') {
      const witnessRole =
        // TODO: separate this logic by role === 'witness' vs role === 'witness_invalid'
        // instead once "witness_invalid" is added to the list of possible roles
        getPocReceiptRoleFromFullTxn(txn, address)

      const activeWitness = txn.path[0].witnesses.find(
        (w) => w.gateway === address,
      )
      if (witnessRole === 'poc_witnesses_invalid') {
        return (
          <span className="text-xs font-sans font-semibold text-red-500">
            invalid: {activeWitness?.invalidReason}
          </span>
        )
      } else if (witnessRole === 'poc_witnesses_valid') {
        const { challengeeLocationHex } = txn.path[0]
        const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
        const [witnessLat, witnessLng] = h3ToGeo(activeWitness.locationHex)

        return (
          <div className="flex flex-row items-center justify-start w-full">
            <p className="font-extralight text-xs whitespace-nowrap text-gray-700 tracking-tighter">
              <span className="text-gray-800 font-normal">
                {challengeeLng &&
                  formatHexDistance(
                    calculateDistance(
                      [challengeeLng, challengeeLat],
                      [witnessLng, witnessLat],
                    ),
                  )}
              </span>
              <span className="inline-flex mx-1 md:mx-1.5"> | </span>
              <span className="text-gray-800 font-normal">
                {activeWitness.signal &&
                  `${activeWitness.signal?.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                dBm`}{' '}
                RSSI
              </span>
              <span className="inline-flex mx-1 md:mx-1.5"> | </span>
              <span className="text-gray-800 font-normal">
                {activeWitness.snr &&
                  `${activeWitness.snr?.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
            dB`}{' '}
                SNR
              </span>
            </p>
          </div>
        )
      }
    } else if (role === 'challengee') {
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
