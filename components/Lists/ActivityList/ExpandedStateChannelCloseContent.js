const ExpandedStateChannelCloseContent = ({ txn }) => {
  // TODO: redesign to nice looking summary
  return (
    <div className="flex flex-col items-start w-full space-y-1 my-0.5">
      {txn.stateChannel.summaries.map((s, i) => (
        <span
          key={i}
          className="mr-1 bg-gray-300 w-full px-2 py-1 flex rounded-md justify-between items-center"
        >
          <div className="flex items-start justify-start flex-col">
            <span className="text-black font-sans text-sm">{s.numDcs} DC</span>
            <span className="text-black font-sans text-sm">
              {s.numPackets} packets
            </span>
          </div>
        </span>
      ))}
    </div>
  )
}

export default ExpandedStateChannelCloseContent
