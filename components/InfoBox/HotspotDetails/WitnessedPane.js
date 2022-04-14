import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchWitnessed } from '../../../data/hotspots'
import WitnessedList from '../../Lists/WitnessedList'
import Widget from '../../Widgets/Widget'
import { useMemo } from 'react'
import { generateRewardScaleColor } from '../../Hotspots/utils'
import Hex from '../../Hex'
import animalHash from 'angry-purple-tiger'

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
      className={classNames(
        'grid grid-flow-row grid-cols-1 no-scrollbar relative',
        {
          'overflow-y-scroll': !loading,
          'overflow-y-hidden': loading,
        },
      )}
    >
      <div className="w-full px-4 py-2 border-b border-solid border-gray-350 grid grid-flow-row grid-cols-2 gap-1 md:gap-2 sticky">
        <Widget
          title="Hotspots Witnessed"
          tooltip={
            <span>
              {`Hotspots on the Helium network whose beacons ${animalHash(
                hotspot.address,
              )} has successfully witnessed. There are many reasons a hotspot may not be a valid witness.`}{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.helium.com/troubleshooting/understanding-witnesses"
              >
                Learn more here.
              </a>
            </span>
          }
          span={1}
          value={
            witnessed?.length ? (
              <div className="flex flex-row items-center justify-start">
                <img
                  src="/images/witness.svg"
                  className="w-[16px] h-[16px] mr-1"
                  alt=""
                />
                {witnessed.length}
              </div>
            ) : (
              0
            )
          }
        />
        <Widget
          span={1}
          tooltip={
            <span>
              The average transmit scale of all the witnessed hotspots in the
              list below.{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.helium.com/troubleshooting/understanding-witnesses/#transmit-scale-and-witnessed-list"
              >
                Learn more here.
              </a>
            </span>
          }
          title="Avg Transmit Scale"
          value={
            avgTransmitScale ? (
              <span className="flex items-center">
                <Hex
                  width={16}
                  height={18}
                  fillColor={generateRewardScaleColor(avgTransmitScale)}
                />
                <span className="ml-1">{avgTransmitScale.toFixed(2)}</span>
              </span>
            ) : (
              'N/A'
            )
          }
        />
      </div>
      <WitnessedList
        hotspot={hotspot}
        witnessed={witnessed || []}
        isLoading={loading}
      />
    </div>
  )
}

export default WitnessedPane
