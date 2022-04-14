import {
  getHumanReadableInvalidReason,
  // getPocReceiptRole,
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

const ActiveWitnessInfo = ({
  activeWitness,
  path: { challengeeLocationHex },
}) => {
  const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
  const [witnessLat, witnessLng] = h3ToGeo(activeWitness.locationHex)

  return (
    <div className="grid grid-cols-8 text-xs font-sans font-thin text-gray-800 px-4 py-2 whitespace-nowrap bg-bluegray-50 rounded-md mt-2">
      <span className="col-span-2">Distance</span>
      <span className="col-span-2 text-gray-800 font-medium ml-0.5">
        {challengeeLng &&
          formatHexDistance(
            calculateDistance(
              [challengeeLng, challengeeLat],
              [witnessLng, witnessLat],
            ),
          )}
      </span>
      <span className="col-span-2">RSSI</span>
      <span className="col-span-2 text-gray-800 font-medium ml-0.5">
        {activeWitness.signal &&
          `${activeWitness.signal?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dBm`}
      </span>
      <span className="col-span-2">SNR</span>
      <span className="col-span-2 text-gray-800 font-medium ml-0.5">
        {activeWitness.snr &&
          `${activeWitness.snr?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dB`}
      </span>
      <span className="col-span-2">Frequency</span>
      <span className="col-span-2 text-gray-800 font-medium ml-0.5">
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
    <div className="flex flex-col mr-4 w-full">
      {/* if this hotspot is a witness and is invalid, display the reason why */}
      {role === 'poc_witnesses_invalid' && (
        <span className="text-xs font-sans font-semibold text-red-500 mt-0 mb-2 ml-[22px]">
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

  const beaconerAddress = txn.path[0].challengee
  const challengerAddress = txn.challenger

  const isChallenger = address === challengerAddress
  const isBeaconer = address === beaconerAddress
  const isWitness =
    role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'

  const challengeIssuer =
    txn.type === 'poc_receipts_v1' ? 'hotspot' : 'validator'

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-px tracking-tight">
      <div className="bg-white w-full rounded-t-lg px-2 py-2 flex flex-row items-start justify-start">
        <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challenger' }} />
        <div className="ml-2 flex flex-col items-start justify-start">
          <span className="text-xs font-sans font-light">Challenger</span>
          {isChallenger ? (
            <span className="-mt-0.5 md:-mt-1 text-sm md:text-base flex flex-row items-center justify-start text-black font-medium">
              <ArrowIcon className="text-black w-4 h-auto mr-1 inline" />
              {animalHash(address)}
            </span>
          ) : (
            <Link
              to={`/${challengeIssuer}s/${challengerAddress}`}
              className="-mt-1 flex flex-row items-center justify-start text-sm md:text-base font-sans font-medium text-black hover:text-navy-400 outline-none border border-solid border-transparent focus:border-navy-400"
            >
              {animalHash(challengerAddress)}
            </Link>
          )}
        </div>
      </div>
      <div className="w-full flex flex-row items-stretch justify-center space-x-px h-full">
        <div className="bg-white px-2 py-2 w-full flex flex-row items-start justify-start">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challengee' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="flex flex-col items-start justify-start">
              <span className="text-xs font-sans font-light">Beaconer</span>
              {isBeaconer ? (
                <span className="-mt-0.5 md:-mt-1 text-sm md:text-base flex flex-row items-center justify-start text-black font-medium">
                  <ArrowIcon className="text-black w-4 h-auto mr-1 inline" />
                  {animalHash(address)}
                </span>
              ) : (
                <Link
                  to={`/hotspots/${beaconerAddress}`}
                  className="-mt-0.5 md:-mt-1 flex flex-row items-center justify-start text-sm md:text-base font-sans font-medium text-black hover:text-navy-400 outline-none border border-solid border-transparent focus:border-navy-400"
                >
                  {animalHash(beaconerAddress)}
                </Link>
              )}
            </span>
            <span className="text-xs md:text-sm font-sans font-light text-black ml-0.5 whitespace-nowrap">
              <FlagLocation geocode={txn.path[0].geocode} condensedView />
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white px-2 py-2 w-full flex flex-col items-start justify-start">
        <div className="flex flex-row items-start justify-start">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'witness' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="flex flex-col items-start justify-start">
              <span className="flex flex-row items-center justify-start">
                <span className="text-xs font-sans font-light">Witnesses</span>
                <div className="flex flex-row items-center justify-start space-x-1 ml-2">
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/witness-yellow-mini.svg"
                      className="w-3 h-auto"
                      alt=""
                    />
                    <span className="text-xs font-sans font-light text-black ml-0.5">
                      {txn?.numberOfValidWitnesses}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/witness-gray.svg"
                      className="w-3 h-auto"
                      alt=""
                    />
                    <span className="text-xs font-sans font-light text-black ml-0.5">
                      {txn?.numberOfInvalidWitnesses}
                    </span>
                  </div>
                </div>
              </span>

              {isWitness ? (
                <span className="-mt-0.5 md:-mt-1 flex flex-row space-x-1 align-center justify-start text-sm md:text-base font-sans font-medium">
                  <span className="flex flex-row items-center justify-start text-black">
                    <ArrowIcon className="text-black w-4 h-auto mr-1 inline" />
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
                <span className="-mt-0.5 md:-mt-1 text-sm md:text-base font-sans font-medium text-gray-550">
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
