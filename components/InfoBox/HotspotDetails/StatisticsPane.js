import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
import RewardsTrendWidget from '../../Widgets/RewardsTrendWidget'
import RelayedWarningWidget from '../../Widgets/WarningWidget'
import StatusWidget from '../../Widgets/StatusWidget'
import StatWidget from '../../Widgets/StatWidget'
import { useHotspotBeaconSums } from '../../../data/beacons'
import { useHotspotRewards } from '../../../data/rewards'
import { useHotspotWitnessSums } from '../../../data/witnesses'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ChecklistWidget from '../../Widgets/ChecklistWidget'
import { isRelay } from '../../Hotspots/utils'
import Widget from '../../Widgets/Widget'
import { fetchWitnesses } from '../../../data/hotspots'
import { useAsync } from 'react-async-hook'

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

  const { result: witnessesData } = useAsync(fetchWitnesses, [hotspot.address])

  return (
    <InfoBoxPaneContainer>
      <RelayedWarningWidget
        isVisible={isRelay(hotspot.status.listenAddrs)}
        warningText={'Hotspot is being Relayed.'}
        link={'https://docs.helium.com/troubleshooting/network-troubleshooting'}
        linkText={'Get help'}
      />
      <ChecklistWidget hotspot={hotspot} witnesses={witnessesData} />
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
      <Widget
        title="Gain"
        value={hotspot?.gain / 10}
        valueSuffix={<span className="text-xl ml-1">dBi</span>}
      />
      <Widget
        title="Elevation"
        value={hotspot?.elevation}
        valueSuffix={<span className="text-xl ml-1">m</span>}
      />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
