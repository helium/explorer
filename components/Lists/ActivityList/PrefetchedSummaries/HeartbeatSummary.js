import HeartbeatIcon from '../../../Icons/HeartbeatIcon'
import { formatVersion } from '../../../Validators/utils'

const HeartbeatSummary = ({ txn, role, address }) => {
  return (
    <span className="flex items-center justify-start">
      <HeartbeatIcon className="h-3.5 w-auto mb-0.5 text-txn-heartbeat" />
      <span className="ml-0.5 text-xs font-sans font-light tracking-tight flex items-center justify-start">
        {formatVersion(txn.version)}
      </span>
    </span>
  )
}

export default HeartbeatSummary
