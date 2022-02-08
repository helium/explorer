import {
  getHumanReadableInvalidReason,
  getPocReceiptRoleFromFullTxn,
} from '../../../../utils/txns'
import { h3ToGeo } from 'h3-js'
import {
  calculateDistance,
  formatHexDistance,
} from '../../../../utils/distance'
import FlagLocation from '../../../Common/FlagLocation'

const PoCReceiptSummary = ({ txn, address, role }) => {
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
          Invalid Witness:{' '}
          {getHumanReadableInvalidReason(activeWitness?.invalidReason)}
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
          <img src="/images/witness-gray.svg" className="w-3.5 h-auto" alt="" />
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
}

export default PoCReceiptSummary
