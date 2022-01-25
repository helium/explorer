import Skeleton from '../../Common/Skeleton'
import FlagLocation from '../../Common/FlagLocation'

const SummaryContent = ({ txn, address, role }) => {
  if (!txn) {
    return <Skeleton className="w-1/2" />
  }
  if (txn.type.startsWith('payment')) {
    return <div className="bg-gray-200">{role}</div>
  }
  if (txn.type.startsWith('poc_receipts')) {
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
  }
  if (txn.type.startsWith('rewards')) {
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

const ActivityItemPrefetchedSummary = ({ txn, address, role }) => {
  return (
    <div className="opacity-50">
      <SummaryContent txn={txn} address={address} role={role} />
    </div>
  )
}

export default ActivityItemPrefetchedSummary
