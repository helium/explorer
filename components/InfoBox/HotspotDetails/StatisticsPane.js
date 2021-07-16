import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
import RelayedWarningWidget from '../../Widgets/WarningWidget'
import StatusWidget from '../../Widgets/StatusWidget'
import StatWidget from '../../Widgets/StatWidget'
import { useHotspotBeaconSums } from '../../../data/beacons'
import { useHotspotWitnessSums } from '../../../data/witnesses'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ChecklistWidget from '../../Widgets/ChecklistWidget'
import { isRelay } from '../../Hotspots/utils'
import Widget from '../../Widgets/Widget'
import { fetchWitnesses } from '../../../data/hotspots'
import { useAsync } from 'react-async-hook'
import RewardsWidgetCustomPeriods from '../../Widgets/RewardsWidgetCustomPeriods'

const StatisticsPane = ({ hotspot }) => {
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
      <RewardsWidgetCustomPeriods
        address={hotspot.address}
        title="Earnings"
        type={'hotspot'}
        periods={[
          { number: 24, type: 'hour' },
          { number: 7, type: 'day' },
          { number: 30, type: 'day' },
        ]}
      />
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
      <ChecklistWidget hotspot={hotspot} witnesses={witnessesData} />
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
