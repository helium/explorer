import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
import RelayedWarningWidget from '../../Widgets/WarningWidget'
import StatusWidget from '../../Widgets/StatusWidget'
import StatWidget from '../../Widgets/StatWidget'
import { useHotspotBeaconSums } from '../../../data/beacons'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ChecklistWidget from '../../Widgets/ChecklistWidget'
import { isRelay } from '../../Hotspots/utils'
import Widget from '../../Widgets/Widget'
import { fetchWitnesses } from '../../../data/hotspots'
import { useAsync } from 'react-async-hook'
import useToggle from '../../../utils/useToggle'
import classNames from 'classnames'
import ChevronIcon from '../../Icons/Chevron'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import DataOnlyStatisticsPane from './DataOnlyStatisticsPane'

const StatisticsPane = ({ hotspot, isDataOnly }) => {
  const { beaconSums, isLoading: isBeaconSumsLoading } = useHotspotBeaconSums(
    hotspot.address,
    2,
    'week',
  )

  const { result: witnessesData } = useAsync(fetchWitnesses, [hotspot.address])
  const [showChecklist, toggleShowChecklist] = useToggle()

  if (isDataOnly) {
    return (
      <DataOnlyStatisticsPane
        hotspot={hotspot}
        witnessesData={witnessesData}
        showChecklist={showChecklist}
        toggleShowChecklist={toggleShowChecklist}
      />
    )
  }

  return (
    <InfoBoxPaneContainer>
      <RelayedWarningWidget
        isVisible={isRelay(hotspot.status.listenAddrs)}
        warningText={'Hotspot is being Relayed.'}
        link={'https://docs.helium.com/troubleshooting/network-troubleshooting'}
        linkText={'Get help'}
      />
      <RewardScaleWidget hotspot={hotspot} />
      <StatusWidget hotspot={hotspot} />
      <PeriodizedRewardsWidget
        address={hotspot?.address}
        title="Earnings"
        type="hotspot"
      />
      <StatWidget
        title="7D Avg Beacons"
        linkTo={`/hotspots/${hotspot?.address}/activity`}
        series={beaconSums}
        isLoading={isBeaconSumsLoading}
        dataKey="sum"
        changeType="percent"
      />
      <Widget
        title="Total Witnesses"
        linkTo={`/hotspots/${hotspot?.address}/witnesses`}
        value={hotspot?.witnesses?.length}
        subtitle={
          <span className="text-gray-550 text-sm font-sans">
            Within past 5 days
          </span>
        }
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
    </InfoBoxPaneContainer>
  )
}

export default StatisticsPane
