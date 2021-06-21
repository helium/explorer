import classNames from 'classnames'
import { useAsync } from 'react-async-hook'
import { fetchWitnesses } from '../../../data/hotspots'
import WitnessesList from '../../Lists/WitnessesList'

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
        witnesses={witnesses || []}
        isLoading={loading}
        title="Witnesses"
        showCount
        // description="[Witnesses description text]"
      />
    </div>
  )
}

export default WitnessesPane
