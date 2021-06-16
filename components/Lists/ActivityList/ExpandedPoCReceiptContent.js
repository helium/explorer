import { getPocReceiptRole } from '../../../utils/txns'
import animalHash from 'angry-purple-tiger'
import classNames from 'classnames'

const RoleParticipant = ({
  className,
  roleTitle,
  activeCondition,
  participantText,
  participantDetails,
  inactiveParticipantClasses,
  activeParticipantClasses,
  iconPath,
}) => (
  <div className={classNames('flex-col items-center justify-start', className)}>
    <span className="flex items-center font-sans text-xs font-thin text-darkgray-800">
      {roleTitle}
    </span>
    <span className="flex items-center font-medium">
      <img src={iconPath} className="h-3 w-auto" />
      <span
        className={classNames(
          'ml-1.5 flex items-center text-sm font-sans font-medium',
          {
            [`${activeParticipantClasses} px-2 py-0.5 rounded-md`]: activeCondition,
            [`${inactiveParticipantClasses}`]: !activeCondition,
          },
        )}
      >
        {participantText}
      </span>
    </span>
    {participantDetails && participantDetails}
  </div>
)

const ExpandedPoCReceiptContent = ({ txn, address }) => {
  const role = getPocReceiptRole(txn, address)

  return (
    <div className="bg-gray-300 w-full rounded-md px-2 py-2">
      <RoleParticipant
        roleTitle="Challenger"
        activeCondition={role === 'poc_challengers'}
        participantText={animalHash(txn.challenger)}
        activeParticipantClasses="bg-purple-500 text-white"
        inactiveParticipantClasses="text-black"
        iconPath="/images/challenger-icon.svg"
      />
      <RoleParticipant
        className="mt-2"
        roleTitle="Beaconer"
        activeCondition={role === 'poc_challengees'}
        participantText={animalHash(txn.path[0].challengee)}
        activeParticipantClasses="bg-blue-500 text-white"
        inactiveParticipantClasses="text-black"
        iconPath="/images/poc_receipt_icon.svg"
      />
      <RoleParticipant
        className="mt-2"
        roleTitle="Witnesses"
        activeCondition={
          role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid'
        }
        participantText={
          !(role === 'poc_witnesses_valid' || role === 'poc_witnesses_invalid')
            ? `${txn.path[0].witnesses.length} hotspots`
            : animalHash(address)
        }
        activeParticipantClasses={
          role === 'poc_witnesses_valid'
            ? 'bg-yellow-500 text-black'
            : 'bg-gray-800 text-white'
        }
        inactiveParticipantClasses="text-black"
        iconPath="/images/witness-yellow-mini.svg"
        participantDetails={
          <div className="flex flex-col">
            {/* if this hotspot is a witness and is invalid, display the reason why */}
            {role === 'poc_witnesses_invalid' && (
              <span className="text-xs font-sans font-thin text-darkgray-800 mt-1.5">
                (Invalid:{' '}
                {
                  txn.path[0].witnesses.find((w) => w.gateway === address)
                    .invalidReason
                }
                )
              </span>
            )}
            {/* if this hotspot is in the witnesses list for this PoC Receipt */}
            {(role === 'poc_witnesses_invalid' ||
              role === 'poc_witnesses_valid') &&
              // and there are other witnesses in the list with it
              txn.path[0].witnesses.length > 1 && (
                <span className="whitespace-nowrap text-xs font-sans font-thin text-gray-800 mt-0.5">
                  {`and ${txn.path[0].witnesses.length - 1} other hotspots`}
                </span>
              )}
          </div>
        }
      />
    </div>
  )
}

export default ExpandedPoCReceiptContent
