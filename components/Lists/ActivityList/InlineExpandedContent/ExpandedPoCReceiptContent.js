import {
  // getPocReceiptRole,
  getPocReceiptRoleFromFullTxn,
} from '../../../../utils/txns'
import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'
import { h3ToGeo } from 'h3-js'
import {
  calculateDistance,
  formatHexDistance,
} from '../../../../utils/distance'
import ActivityIcon from '../ActivityIcon'
import FlagLocation from '../../../Common/FlagLocation'
import { Link } from 'react-router-i18n'

const ActiveWitnessInfo = ({
  activeWitness,
  path: { challengeeLocationHex },
}) => {
  const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
  const [witnessLat, witnessLng] = h3ToGeo(activeWitness.locationHex)

  return (
    <div className="bg-white grid grid-cols-5 text-xs font-sans font-thin text-gray-800 ml-7 mb-2 mt-1.5 whitespace-nowrap">
      <span className="col-span-1">Distance</span>
      <span className="col-span-4 text-gray-800 font-medium ml-0.5">
        {challengeeLng &&
          formatHexDistance(
            calculateDistance(
              [challengeeLng, challengeeLat],
              [witnessLng, witnessLat],
            ),
          )}
      </span>
      <span className="col-span-1">RSSI</span>
      <span className="col-span-4 text-gray-800 font-medium ml-0.5">
        {activeWitness.signal &&
          `${activeWitness.signal?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dBm`}
      </span>
      <span className="col-span-1">SNR</span>
      <span className="col-span-4 text-gray-800 font-medium ml-0.5">
        {activeWitness.snr &&
          `${activeWitness.snr?.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
            dB`}
      </span>
      <span className="col-span-1">Frequency</span>
      <span className="col-span-4 text-gray-800 font-medium ml-0.5">
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
    <div className="flex flex-col">
      {/* if this hotspot is a witness and is invalid, display the reason why */}
      {role === 'poc_witnesses_invalid' && (
        <span className="text-xs font-sans font-semibold text-red-500 mt-1 ml-6">
          invalid: {activeWitness?.invalidReason}
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

  const isWitness =
    role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'

  const beaconerAddress = txn.path[0].challengee

  const challengerAddress = txn.challenger

  return (
    // <div className="">
    //   <RoleParticipant
    //     roleTitle="Challenger"
    //     isActive={role === 'poc_challengers'}
    //     participantText={animalHash(txn.challenger)}
    //     activeParticipantStyles={{
    //       backgroundColor: getTxnTypeColor(role),
    //       color: 'white',
    //     }}
    //     inactiveParticipantStyles={{
    //       color: 'black',
    //     }}
    //     iconPath="/images/challenger-icon.svg"
    //   />
    //   <RoleParticipant
    //     className="mt-2"
    //     roleTitle="Beaconer"
    //     isActive={role === 'poc_challengees'}
    //     participantText={animalHash(txn.path[0].challengee)}
    //     activeParticipantStyles={{
    //       backgroundColor: getTxnTypeColor(role),
    //       color: 'white',
    //     }}
    //     inactiveParticipantStyles={{
    //       color: 'black',
    //     }}
    //     iconPath="/images/poc_receipt_icon.svg"
    //   />
    //   <RoleParticipant
    //     className="mt-2"
    //     roleTitle="Witnesses"
    //     isActive={isWitness}
    //     participantText={
    //       isWitness
    //         ? animalHash(address)
    //         : `${txn.path[0].witnesses.length} hotspots`
    //     }
    //     activeParticipantStyles={{
    //       backgroundColor: getTxnTypeColor(role),
    //       color: role === 'poc_witnesses_invalid' ? 'white' : 'black',
    //     }}
    //     inactiveParticipantStyles={{
    //       color: 'black',
    //     }}
    //     iconPath="/images/witness-yellow-mini.svg"
    //     participantDetails={
    //       <WitnessesDetails
    //         txn={txn}
    //         role={role}
    //         address={address}
    //         isWitness={isWitness}
    //       />
    //     }
    //   />
    // </div>
    <div className="w-full flex flex-col items-center justify-center space-y-px tracking-tight">
      <div className="bg-white w-full rounded-t-lg px-2 py-2 flex flex-row items-start justify-start">
        <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challenger' }} />
        <div className="ml-2 flex flex-col items-start justify-start">
          <span className="text-xs font-sans font-light">Challenger</span>
          <Link
            to={`/hotspots/${challengerAddress}`}
            className="text-base font-sans font-medium text-black hover:text-navy-400 outline-none border border-solid border-transparent focus:border-navy-400"
          >
            {animalHash(challengerAddress)}
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-row items-stretch justify-center space-x-px h-full">
        <div className="bg-white px-2 py-2 w-full flex flex-row items-start justify-start">
          <ActivityIcon txn={{ type: 'poc_receipts_v1', role: 'challengee' }} />
          <div className="ml-2 flex flex-col items-start justify-start">
            <span className="flex flex-col items-start justify-start">
              <span className="text-xs font-sans font-light">Beaconer</span>
              <Link
                to={`/hotspots/${beaconerAddress}`}
                className="text-base font-sans font-medium text-black hover:text-navy-400 outline-none border border-solid border-transparent focus:border-navy-400"
              >
                {animalHash(beaconerAddress)}
              </Link>
            </span>
            <span className="text-sm font-sans font-light text-black ml-1 whitespace-nowrap">
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
              <span className="text-xs font-sans font-light">Witnesses</span>
              {isWitness ? (
                <span className="flex flex-row space-x-1 align-center justify-start text-base font-sans font-medium">
                  <Link
                    to={`/hotspots/${address}`}
                    className="text-black hover:text-navy-400 outline-none border border-solid border-transparent focus:border-navy-400"
                  >
                    {animalHash(address)}
                  </Link>
                  {txn.path[0].witnesses.length > 1 && (
                    <span className="text-gray-550 border border-transparent border-solid">{`& ${
                      txn.path[0].witnesses.length - 1
                    } other${
                      txn.path[0].witnesses.length - 1 === 1 ? '' : 's'
                    }`}</span>
                  )}
                </span>
              ) : (
                <span className="text-base font-sans font-medium text-gray-550">
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
