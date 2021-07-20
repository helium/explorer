import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchWitnesses } from '../../../data/hotspots'
import WitnessesList from '../../Lists/WitnessesList'
import animalHash from 'angry-purple-tiger'

const WitnessesPane = ({ hotspot }) => {
  const { result: witnesses, loading } = useAsync(fetchWitnesses, [
    hotspot.address,
  ])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !loading,
        'overflow-y-hidden': loading,
      })}
    >
      <WitnessesList
        hotspot={hotspot}
        witnesses={witnesses || []}
        isLoading={loading}
        title="Witnesses"
        description={
          <>
            <div>
              Hotspots on the Helium network that have successfully witnessed
              beacons sent by {animalHash(hotspot.address)}. There are many
              reasons a nearby Hotspot may not be a valid witness.
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

export default WitnessesPane
