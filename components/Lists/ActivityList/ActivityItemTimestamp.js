import TimeAgo from 'react-time-ago'
import Timestamp from 'react-timestamp'

const ActivityItemTimestamp = ({ txn, expanded }) => (
  <span className="flex flex-auto whitespace-nowrap items-center space-x-1 px-4">
    <img alt="" src="/images/clock-outline.svg" className="w-3 h-3" />
    {expanded ? (
      <>
        <span className="hidden md:block text-xs text-gray-600 font-sans font-extralight ml-1 mt-px md:mt-0.5">
          <Timestamp date={txn.time} />
        </span>
        <span className="block md:hidden text-xs text-gray-600 font-sans font-extralight ml-1 mt-px md:mt-0.5">
          <TimeAgo date={txn.time * 1000} timeStyle="mini" />
        </span>
      </>
    ) : (
      <span className="text-xs text-gray-600 font-sans font-extralight ml-1 mt-px md:mt-0.5">
        <TimeAgo date={txn.time * 1000} timeStyle="mini" />
      </span>
    )}
  </span>
)

export default ActivityItemTimestamp
