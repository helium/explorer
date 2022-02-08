import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchWitnessed } from '../../../data/hotspots'
import WitnessedList from '../../Lists/WitnessedList'
import animalHash from 'angry-purple-tiger'

const WitnessedPane = ({ hotspot }) => {
  const { result: witnessed, loading } = useAsync(fetchWitnessed, [
    hotspot.address,
  ])

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
            <div>
              Hotspots on the Helium network whose beacons{' '}
              {animalHash(hotspot.address)} has successfully witnessed. There
              are many reasons a Hotspot may not be a valid witness.
            </div>
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
