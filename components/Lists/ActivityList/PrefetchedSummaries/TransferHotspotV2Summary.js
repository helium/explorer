import AccountAddress from '../../../AccountAddress'
import AccountIcon from '../../../AccountIcon'
import animalHash from 'angry-purple-tiger'

const HotspotTransferV2Summary = ({ txn, role, address }) => {
  const isSender = txn.owner === address
  const otherAddress = isSender ? txn.newOwner : txn.owner

  return (
    <span className="flex items-center">
      <span className="text-xs font-sans font-light tracking-tight flex items-center justify-start">
        {`${isSender ? 'Sent' : 'Received'} ${animalHash(txn.gateway)} ${
          isSender ? 'to' : 'from'
        }`}
        <div className="ml-1">
          <span className="flex flex-row items-center justify-start space-x-0.5 ml-1">
            <AccountIcon address={otherAddress} size={12} />
            <AccountAddress
              showSecondHalf={false}
              mono
              address={otherAddress}
              truncate={4}
            />
          </span>
        </div>
      </span>
    </span>
  )
}

export default HotspotTransferV2Summary
