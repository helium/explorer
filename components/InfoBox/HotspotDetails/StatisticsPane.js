import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
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
import WarningWidget from '../../Widgets/WarningWidget'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import ExternalLinkIcon from '../../Icons/ExternalLink'
// import RecentActivityWidget from '../../Widgets/RecentActivityWidget'

const StatisticsPane = ({ hotspot, isDataOnly }) => {
  const { beaconSums, isLoading: isBeaconSumsLoading } = useHotspotBeaconSums(
    hotspot.address,
    2,
    'week',
  )

  const { result: witnessesData } = useAsync(fetchWitnesses, [hotspot.address])
  const [showChecklist, toggleShowChecklist] = useToggle()

  const errorFetchingWitnesses = hotspot?.errors?.length > 0

  return (
    <>
      {isDataOnly && (
        <InfoBoxPaneTitleSection
          title="Data-Only Hotspot"
          description={
            <div className="space-y-2.5">
              <div>
                This Hotspot transfers data packets only and does not
                participate in Beacons, Witnessing, and Proof-of-Coverage.
              </div>
              <div>It does not contribute to transmit scaling.</div>
              <div>
                <a
                  className="text-navy-400 hover:text-navy-300 flex items-center"
                  href="https://docs.helium.com/mine-hnt/data-only-hotspots"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Learn more
                  <ExternalLinkIcon className="h-3.5 ml-1" />
                </a>
              </div>
            </div>
          }
        />
      )}
      <InfoBoxPaneContainer>
        {!isDataOnly && (
          <>
            <WarningWidget
              isVisible={isRelay(hotspot.status.listenAddrs)}
              warningText={'Hotspot is being Relayed.'}
              link={
                'https://docs.helium.com/troubleshooting/network-troubleshooting'
              }
              linkText={'Get help'}
            />
            <RewardScaleWidget hotspot={hotspot} />
            <StatusWidget hotspot={hotspot} />
            <WarningWidget
              isVisible={hotspot.rewardScale && hotspot.rewardScale < 1}
              warningText="Suboptimal Transmit Scale"
              link={`https://app.hotspotty.net/hotspots/${hotspot.address}/reward-scaling`}
              linkText="Improve"
            />
          </>
        )}
        <PeriodizedRewardsWidget
          address={hotspot?.address}
          title="Rolling Earnings"
          type="hotspot"
        />
        {/* <RecentActivityWidget context="hotspot" address={hotspot.address} /> */}
        {!isDataOnly && (
          <>
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
              value={
                errorFetchingWitnesses
                  ? 'Error fetching'
                  : hotspot?.witnesses?.length
              }
              valueIsText={errorFetchingWitnesses}
              subtitle={
                <span className="text-gray-550 text-sm font-sans">
                  Within past 5 days
                </span>
              }
            />
          </>
        )}
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
          <ChecklistWidget
            hotspot={hotspot}
            witnesses={witnessesData}
            isDataOnly={isDataOnly}
          />
        )}
      </InfoBoxPaneContainer>
    </>
  )
}

export default StatisticsPane
