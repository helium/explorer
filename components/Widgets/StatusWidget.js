import { memo, useMemo, useState } from 'react'
import classNames from 'classnames'
import TimeAgo from 'react-time-ago'
import Widget from './Widget'
import { useAsync } from 'react-async-hook'
import { fetchHeightByTimestamp } from '../../data/blocks'
import { SYNC_BUFFER_BLOCKS } from '../Hotspots/utils'
import useChallengeIssuer from '../../hooks/useChallengeIssuer'
import client from '../../data/client'

const StatusWidget = ({ hotspot }) => {
  const status = hotspot?.status?.online
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState()
  const [loadingActivityTimestamp, setLoadingActivityTimestamp] = useState(true)
  const { challengeIssuer, challengeIssuerLoading } = useChallengeIssuer()

  useAsync(async () => {
    setLoadingActivityTimestamp(true)
    const transactionList = await (await client.hotspot(hotspot.address).roles.list()).take(1)
    if (transactionList && transactionList[0] && transactionList[0].time) {
      setLastActivityTimestamp(transactionList[0].time * 1000)
    }
    setLoadingActivityTimestamp(false)
  }, [])

  const liteHotspotsActive = useMemo(() => {
    return challengeIssuer === 'validator'
  }, [challengeIssuer])

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
      title="Status"
      value={value}
      subtitle={
        lastActivityTimestamp && (
          <span className="text-gray-550 text-sm font-sans">
            Last Updated <TimeAgo date={lastActivityTimestamp} />
          </span>
        )
      }
      isLoading={syncHeightLoading || challengeIssuerLoading || loadingActivityTimestamp}
      tooltip="A Hotspot is online and synced if it has any blockchain activity in the last 36 hours (including Proof-of-Coverage, transferring packets, or receiving mining rewards)."
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
