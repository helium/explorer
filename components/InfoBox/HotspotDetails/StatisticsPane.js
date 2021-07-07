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
import useToggle from '../../../utils/useToggle'
import classNames from 'classnames'
import ChevronIcon from '../../Icons/Chevron'

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
  const [showChecklist, toggleShowChecklist] = useToggle()
  return (
    <InfoBoxPaneContainer>
      <RelayedWarningWidget
        isVisible={isRelay(hotspot.status.listenAddrs)}
        warningText={'Hotspot is being Relayed.'}
        link={'https://docs.helium.com/troubleshooting/network-troubleshooting'}
        linkText={'Get help'}
      />
      {!showChecklist ? (
        <div
          className="bg-gray-200 p-3 rounded-lg col-span-2 cursor-pointer hover:bg-gray-300"
          onClick={toggleShowChecklist}
        >
          <div
            className={classNames(
              'flex items-center justify-between',
              'text-gray-600 mx-auto text-md px-4 py-3',
            )}
          >
            Load checklist
            <ChevronIcon
              className={classNames(
                'h-4 w-4',
                'ml-1',
                'transform duration-500 transition-all',
                { 'rotate-180': !showChecklist },
              )}
            />
          </div>
        </div>
      ) : (
        <ChecklistWidget hotspot={hotspot} witnesses={witnessesData} />
      )}
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
