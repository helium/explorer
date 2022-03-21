import { memo, useMemo } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { useAsync } from 'react-async-hook'
import { fetchHeightByTimestamp } from '../../data/blocks'
import { SYNC_BUFFER_BLOCKS } from '../Hotspots/utils'
import useChallengeIssuer from '../../hooks/useChallengeIssuer'

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online

  const { challengeIssuer, challengeIssuerLoading } = useChallengeIssuer()

  const liteHotspotsActive = useMemo(() => {
    return challengeIssuer === 'validator'
  }, [challengeIssuer, challengeIssuerLoading])

  const { result: syncHeight, loading: syncHeightLoading } =
    useAsync(async () => {
      const timestamp = hotspot?.status?.timestamp

      if (!timestamp) {
        return 1
      }

      const height = await fetchHeightByTimestamp(timestamp)
      return height
    }, [hotspot.status.timestamp])

  const value = useMemo(() => {
    if (status === 'offline') {
      return 'Offline'
    }

    if (liteHotspotsActive) {
      return 'Connected'
    }

    if (
      !hotspot?.status?.height ||
      !syncHeight ||
      syncHeight - hotspot.status.height >= SYNC_BUFFER_BLOCKS
    ) {
      return 'Syncing'
    }

    return 'Synced'
  }, [hotspot.status.height, status, syncHeight, liteHotspotsActive])

  return (
    <Widget
      title="Sync Status"
      value={value}
      subtitle={
        hotspot?.status?.timestamp && (
          <span className="text-gray-550 text-sm font-sans">
            Last Updated <TimeAgo date={hotspot?.status?.timestamp} />
          </span>
        )
      }
      isLoading={syncHeightLoading || challengeIssuerLoading}
      tooltip="Hotspots gossip their sync status over the p2p network. Pair with a hotspot over Bluetooth to get the most up-to-date sync status."
      icon={
        <div
          className={classNames('rounded-full w-5 h-5', {
            'bg-green-400': status === 'online',
            'bg-red-400': status === 'offline',
          })}
        />
      }
    />
  )
}

export default memo(StatusWidget)
