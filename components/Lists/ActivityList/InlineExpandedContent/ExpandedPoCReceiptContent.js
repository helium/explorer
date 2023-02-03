import {
  getHumanReadableInvalidReason,
  getPocReceiptRoleFromFullTxn,
} from '../../../../utils/txns'
import animalHash from 'angry-purple-tiger'
import { h3ToGeo } from 'h3-js'
import {
  calculateDistance,
  formatHexDistance,
} from '../../../../utils/distance'
import ActivityIcon from '../ActivityIcon'
import FlagLocation from '../../../Common/FlagLocation'
import { Link } from 'react-router-i18n'
import ArrowIcon from '../../../Icons/ArrowIcon'
import useChallengeIssuer from '../../../../hooks/useChallengeIssuer'

const ActiveWitnessInfo = ({
  activeWitness,
  path: { challengeeLocationHex },
}) => {
  const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
  const [witnessLat, witnessLng] = h3ToGeo(activeWitness.locationHex)

  return (
    <div className="mt-2 grid grid-cols-8 whitespace-nowrap rounded-md bg-bluegray-50 px-4 py-2 font-sans text-xs font-thin text-gray-800">
      <span className="col-span-2">Distance</span>
      <span className="col-span-2 ml-0.5 font-medium text-gray-800">
        {challengeeLng &&
          formatHexDistance(
            calculateDistance(
              [challengeeLng, challengeeLat],
              [witnessLng, witnessLat],
            ),
          )}
      </span>
      <span className="col-span-2">RSSI</span>
      <span className="col-span-2 ml-0.5 font-medium text-gray-800">
        {activeWitness.signal &&
          `${activeWitness.signal?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dBm`}
      </span>
      <span className="col-span-2">SNR</span>
      <span className="col-span-2 ml-0.5 font-medium text-gray-800">
        {activeWitness.snr &&
          `${activeWitness.snr?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dB`}
      </span>
      <span className="col-span-2">Frequency</span>
      <span className="col-span-2 ml-0.5 font-medium text-gray-800">
        {activeWitness.frequency &&
          `${activeWitness.frequency.toLocaleString(undefined, {
            maximumFractionDigits: 1,
          })} MHz`}
      </span>
    </div>
  )
}

const WitnessesDetails = ({ txn, role, address, isWitness }) => {
  const activeWitness = txn.path[0].witnesses.find((w) => w.gateway === address)
  return (
    <div className="mr-4 flex w-full flex-col">
      {/* if this hotspot is a witness and is invalid, display the reason why */}
      {role === 'poc_witnesses_invalid' && (
        <span className="mt-0 mb-2 ml-[22px] font-sans text-xs font-semibold text-red-500">
          Invalid Witness:{' '}
          {getHumanReadableInvalidReason(activeWitness?.invalidReason)}
        </span>
      )}
      {/* if this hotspot is in the witnesses list for this PoC Receipt... */}
      {isWitness && (
        <ActiveWitnessInfo activeWitness={activeWitness} path={txn.path[0]} />
      )}
    </div>
  )
}

const ExpandedPoCReceiptContent = ({ txn, role: initialRole, address }) => {
  const role =
    // TODO: change to:
    // getPocReceiptRole(initialRole)
    // once "witness_invalid" is added to the list of possible roles
    getPocReceiptRoleFromFullTxn(txn, address)
  const { challengeIssuer } = useChallengeIssuer()

  const beaconerAddress = txn.path[0].challengee
  const challengerAddress = txn.challenger

  const isChallenger = address === challengerAddress
  const isBeaconer = address === beaconerAddress
  const isWitness =
    role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-px tracking-tight">
      {challengeIssuer !== 'oracle' ? (
        <div className="flex w-full flex-row items-start justify-start rounded-t-lg bg-white px-2 py-2">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challenger' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="font-sans text-xs font-light">Challenger</span>
            {isChallenger ? (
              <span className="-mt-0.5 flex flex-row items-center justify-start text-sm font-medium text-black md:-mt-1 md:text-base">
                <ArrowIcon className="mr-1 inline h-auto w-4 text-black" />
                {animalHash(address)}
              </span>
            ) : (
              <Link
                to={`/${challengeIssuer}s/${challengerAddress}`}
                className="-mt-1 flex flex-row items-center justify-start border border-solid border-transparent font-sans text-sm font-medium text-black outline-none hover:text-navy-400 focus:border-navy-400 md:text-base"
              >
                {animalHash(challengerAddress)}
              </Link>
            )}
          </div>
        </div>
      ) : null}
      <div className="flex h-full w-full flex-row items-stretch justify-center space-x-px">
        <div className="flex w-full flex-row items-start justify-start bg-white px-2 py-2">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challengee' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="flex flex-col items-start justify-start">
              <span className="font-sans text-xs font-light">Beaconer</span>
              {isBeaconer ? (
                <span className="-mt-0.5 flex flex-row items-center justify-start text-sm font-medium text-black md:-mt-1 md:text-base">
                  <ArrowIcon className="mr-1 inline h-auto w-4 text-black" />
                  {animalHash(address)}
                </span>
              ) : (
                <Link
                  to={`/hotspots/${beaconerAddress}`}
                  className="-mt-0.5 flex flex-row items-center justify-start border border-solid border-transparent font-sans text-sm font-medium text-black outline-none hover:text-navy-400 focus:border-navy-400 md:-mt-1 md:text-base"
                >
                  {animalHash(beaconerAddress)}
                </Link>
              )}
            </span>
            <span className="ml-0.5 whitespace-nowrap font-sans text-xs font-light text-black md:text-sm">
              <FlagLocation geocode={txn.path[0].geocode} condensedView />
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start bg-white px-2 py-2">
        <div className="flex flex-row items-start justify-start">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'witness' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="flex flex-col items-start justify-start">
              <span className="flex flex-row items-center justify-start">
                <span className="font-sans text-xs font-light">Witnesses</span>
                <div className="ml-2 flex flex-row items-center justify-start space-x-1">
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/witness-yellow-mini.svg"
                      className="h-auto w-3"
                      alt=""
                    />
                    <span className="ml-0.5 font-sans text-xs font-light text-black">
                      {txn?.numberOfValidWitnesses}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/witness-gray.svg"
                      className="h-auto w-3"
                      alt=""
                    />
                    <span className="ml-0.5 font-sans text-xs font-light text-black">
                      {txn?.numberOfInvalidWitnesses}
                    </span>
                  </div>
                </div>
              </span>

              {isWitness ? (
                <span className="align-center -mt-0.5 flex flex-row justify-start space-x-1 font-sans text-sm font-medium md:-mt-1 md:text-base">
                  <span className="flex flex-row items-center justify-start text-black">
                    <ArrowIcon className="mr-1 inline h-auto w-4 text-black" />
                    {animalHash(address)}
                  </span>
                  {txn.path[0].witnesses.length > 1 && (
                    <span className="text-gray-550">{`& ${
                      txn.path[0].witnesses.length - 1
                    } other${
                      txn.path[0].witnesses.length - 1 === 1 ? '' : 's'
                    }`}</span>
                  )}
                </span>
              ) : (
                <span className="-mt-0.5 font-sans text-sm font-medium text-gray-550 md:-mt-1 md:text-base">
                  {txn.path[0].witnesses.length} hotspots
                </span>
              )}
            </span>

            <WitnessesDetails
              txn={txn}
              role={role}
              address={address}
              isWitness={isWitness}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandedPoCReceiptContent
