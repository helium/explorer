import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
import RewardsTrendWidget from '../../Widgets/RewardsTrendWidget'
import StatusWidget from '../../Widgets/StatusWidget'
import StatWidget from '../../Widgets/StatWidget'
import { useHotspotBeaconSums } from '../../../data/beacons'
import { useHotspotRewards } from '../../../data/rewards'
import { useHotspotWitnessSums } from '../../../data/witnesses'

const StatisticsPane = ({ hotspot }) => {
  const { rewards } = useHotspotRewards(hotspot.address, 60, 'day')
  const { witnesses, isLoading: isWitnessesLoading } = useHotspotWitnessSums(
    hotspot.address,
    2,
    'week',
  )
  const { beaconSums, isLoading: isBeaconSumsLoading } = useHotspotBeaconSums(
    hotspot.address,
    2,
    'week',
  )
  return (
    <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
      <RewardsTrendWidget title="30 Day Earnings" series={rewards} />
      <RewardScaleWidget hotspot={hotspot} />
      <StatusWidget hotspot={hotspot} />
      <StatWidget
        title="7D Avg Beacons"
        series={beaconSums}
        isLoading={isBeaconSumsLoading}
        dataKey="sum"
        changeType="percent"
      />
      <StatWidget
        title="7D Avg Witnesses"
        series={witnesses}
        isLoading={isWitnessesLoading}
        dataKey="avg"
        changeType="percent"
      />
    </div>
  )
}

export default StatisticsPane
