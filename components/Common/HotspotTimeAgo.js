import TimeAgo from 'react-time-ago'

const API_GENESIS_TIMESTAMP = '1970-01-01T00:00:00.000000Z'
const GENESIS_TIME = 1564436673

const HotspotTimeAgo = ({ hotspot }) => {
  if (!hotspot?.timestampAdded) return null

  const time =
    hotspot.timestampAdded === API_GENESIS_TIMESTAMP
      ? GENESIS_TIME * 1000
      : hotspot.timestampAdded

  return (
    <>
      <span className="block md:hidden">
        {/* on mobile screens, the full text, e.g. "43 minutes ago" combined with longer hotspot names was making the list element wider than the list width, so timeStyle="mini" shortens it to "43m" */}
        <TimeAgo date={time} timeStyle="mini" /> ago
      </span>
      <span className="hidden md:block">
        <TimeAgo date={time} />
      </span>
    </>
  )
}

export default HotspotTimeAgo
