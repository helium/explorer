import { formatBytes, dcsToBytes } from '../../../../utils/units'
import { isCellularSCOwner } from '../../../../utils/txns'

const ExpandedStateChannelCloseContent = ({ txn }) => {
  // TODO: redesign to nice looking summary
  const isCellular = isCellularSCOwner(txn.stateChannel.owner)
  return (
    <div className="flex flex-col items-start w-full space-y-1 my-0.5">
      {txn.stateChannel.summaries.map((s, i) => (
        <span
          key={i}
          className="mr-1 w-full px-2 py-1 flex rounded-md justify-between items-center"
        >
          <div className="flex items-start justify-between flex-row w-full">
            {isCellular ? (
              <img alt="" src="/images/5g.svg" className="w-6 self-center" />
            ) : (
              <span className="text-black font-sans text-sm whitespace-nowrap">
                {s.numPackets} packets
              </span>
            )}
            <span className="text-black font-sans text-sm flex flex-row items-center justify-start space-x-2">
              <img src="/images/dc.svg" alt="" />
              <span className="text-sm text-black font-sans font-light">
                {s.numDcs} DC
              </span>
            </span>
            <span className="text-black font-sans text-sm whitespace-nowrap">
              {formatBytes(dcsToBytes(s.numDcs, isCellular))}
            </span>
          </div>
        </span>
      ))}
    </div>
  )
}

export default ExpandedStateChannelCloseContent
