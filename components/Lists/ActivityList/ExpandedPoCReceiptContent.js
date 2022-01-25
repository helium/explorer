import {
  getPocReceiptRole,
  getPocReceiptRoleFromFullTxn,
  getTxnTypeColor,
} from '../../../utils/txns'
import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'
import { h3ToGeo } from 'h3-js'
import { calculateDistance, formatHexDistance } from '../../../utils/distance'

const RoleParticipant = ({
  className,
  roleTitle,
  isActive,
  participantText,
  participantDetails,
  inactiveParticipantStyles,
  activeParticipantStyles,
  activeParticipantDetails,
  iconPath,
}) => (
  <div className={classNames('flex-col items-center justify-start', className)}>
    <span className="flex items-center font-sans text-xs font-thin text-darkgray-800">
      {roleTitle}
    </span>
    <span className="flex items-center font-medium">
      <img alt="" src={iconPath} className="h-3 w-auto" />
      <span
        className={classNames(
          'ml-1.5 flex items-center text-sm font-sans font-medium',
          {
            'px-2 py-0.5 rounded-md': isActive,
          },
        )}
        style={isActive ? activeParticipantStyles : inactiveParticipantStyles}
      >
        {participantText}
      </span>
      {activeParticipantDetails && activeParticipantDetails}
    </span>
    {participantDetails && participantDetails}
  </div>
)

const ActiveWitnessInfo = ({
  activeWitness,
  path: { challengeeLocationHex },
}) => {
  const [challengeeLat, challengeeLng] = h3ToGeo(challengeeLocationHex)
  const [witnessLat, witnessLng] = h3ToGeo(activeWitness.locationHex)

  return (
    <div className="grid grid-cols-5 text-xs font-sans font-thin text-gray-800 ml-7 mb-2 mt-1.5 whitespace-nowrap">
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
        <>
          {/* show the distance, RSSI, and SNR */}
          <ActiveWitnessInfo activeWitness={activeWitness} path={txn.path[0]} />
          {/* as well as the number of other witnesses there were */}
          {txn.path[0].witnesses.length > 1 && (
            <span className="whitespace-nowrap text-xs font-sans font-thin text-gray-800 mt-0.5">
              {`and ${txn.path[0].witnesses.length - 1} other hotspot${
                txn.path[0].witnesses.length - 1 === 1 ? '' : 's'
              }`}
            </span>
          )}
        </>
      )}
    </div>
  )
}

const ExpandedPoCReceiptContent = ({ txn, role: initialRole, address }) => {
  const role = getPocReceiptRoleFromFullTxn(txn, address)

  const isWitness =
    role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'

  return (
    <div className="">
      <RoleParticipant
        roleTitle="Challenger"
        isActive={role === 'poc_challengers'}
        participantText={animalHash(txn.challenger)}
        activeParticipantStyles={{
          backgroundColor: getTxnTypeColor(role),
          color: 'white',
        }}
        inactiveParticipantStyles={{
          color: 'black',
        }}
        iconPath="/images/challenger-icon.svg"
      />
      <RoleParticipant
        className="mt-2"
        roleTitle="Beaconer"
        isActive={role === 'poc_challengees'}
        participantText={animalHash(txn.path[0].challengee)}
        activeParticipantStyles={{
          backgroundColor: getTxnTypeColor(role),
          color: 'white',
        }}
        inactiveParticipantStyles={{
          color: 'black',
        }}
        iconPath="/images/poc_receipt_icon.svg"
      />
      <RoleParticipant
        className="mt-2"
        roleTitle="Witnesses"
        isActive={isWitness}
        participantText={
          isWitness
            ? animalHash(address)
            : `${txn.path[0].witnesses.length} hotspots`
        }
        activeParticipantStyles={{
          backgroundColor: getTxnTypeColor(role),
          color: role === 'poc_witnesses_invalid' ? 'white' : 'black',
        }}
        inactiveParticipantStyles={{
          color: 'black',
        }}
        iconPath="/images/witness-yellow-mini.svg"
        participantDetails={
          <WitnessesDetails
            txn={txn}
            role={role}
            address={address}
            isWitness={isWitness}
          />
        }
      />
    </div>
  )
}

export default ExpandedPoCReceiptContent
