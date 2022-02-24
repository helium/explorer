import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchWitnessed } from '../../../data/hotspots'
import WitnessedList from '../../Lists/WitnessedList'
import animalHash from 'angry-purple-tiger'
import Widget from '../../Widgets/Widget'
import { useMemo } from 'react'
import { generateRewardScaleColor } from '../../Hotspots/utils'

const WitnessedPane = ({ hotspot }) => {
  const { result: witnessed, loading } = useAsync(fetchWitnessed, [
    hotspot.address,
  ])

  const avgTransmitScale = useMemo(() => {
    if (!witnessed) {
      return 0
    }

    const totalTransmit = witnessed.reduce(
      (acc, { rewardScale }) => acc + rewardScale,
      0,
    )

    return totalTransmit / witnessed.length
  }, [witnessed])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !loading,
        'overflow-y-hidden': loading,
      })}
    >
      <WitnessedList
        hotspot={hotspot}
        witnessed={witnessed || []}
        isLoading={loading}
        title="Witnessed"
        description={
          <>
            {!loading && (
              <div>
                Over the last 5 days, {animalHash(hotspot.address)} has
                successfully witnessed beacons from{' '}
                <span className="font-bold text-navy-400">
                  {witnessed?.length} Hotspot
                  {witnessed?.length === 1 ? '' : 's'}
                </span>
                {', '}
                with an average transmit scale of{' '}
                <span
                  className="font-bold"
                  style={{
                    color: generateRewardScaleColor(avgTransmitScale),
                  }}
                >
                  {avgTransmitScale.toFixed(2)}
                </span>
                .
              </div>
            )}
            <div className="pt-1.5">
              Learn more{' '}
              <a
                className="text-navy-400"
                href="https://docs.helium.com/troubleshooting/understanding-witnesses/"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
              .
            </div>
          </>
        }
        showCount
      />
    </div>
  )
}

export default WitnessedPane
