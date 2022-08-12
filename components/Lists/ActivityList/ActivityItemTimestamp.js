import TimeAgo from 'react-time-ago'
import BlockTimestamp from '../../Common/BlockTimestamp'

const ActivityItemTimestamp = ({ txn, expanded }) => (
  <span className="flex flex-auto items-center space-x-1 whitespace-nowrap px-4">
    <img alt="" src="/images/clock-outline.svg" className="h-3 w-3" />
    {expanded ? (
      <>
        <span className="ml-1 mt-px hidden font-sans text-xs font-extralight text-gray-600 md:mt-0.5 md:block">
          <BlockTimestamp blockTime={txn.time} />
        </span>
        <span className="ml-1 mt-px block font-sans text-xs font-extralight text-gray-600 md:mt-0.5 md:hidden">
          <TimeAgo date={txn.time * 1000} timeStyle="mini" />
        </span>
      </>
    ) : (
      <span className="ml-1 mt-px font-sans text-xs font-extralight text-gray-600 md:mt-0.5">
        <TimeAgo date={txn.time * 1000} timeStyle="mini" />
      </span>
    )}
  </span>
)

export default ActivityItemTimestamp
