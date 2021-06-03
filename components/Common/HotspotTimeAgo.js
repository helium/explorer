import TimeAgo from 'react-time-ago'

const API_GENESIS_TIMESTAMP = '1970-01-01T00:00:00.000000Z'
const GENESIS_TIME = 1564436673

const HotspotTimeAgo = ({ hotspot }) => {
  if (!hotspot?.timestampAdded) return null

  if (hotspot.timestampAdded === API_GENESIS_TIMESTAMP) {
    return <TimeAgo date={GENESIS_TIME * 1000} />
  }

  return <TimeAgo date={hotspot.timestampAdded} />
}

export default HotspotTimeAgo
