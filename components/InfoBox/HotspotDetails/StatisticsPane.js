import { useEffect } from 'react'
import RewardScaleWidget from '../../Widgets/RewardScaleWidget'
import StatusWidget from '../../Widgets/StatusWidget'
import StatWidget from '../../Widgets/StatWidget'
import { useHotspotBeaconSums } from '../../../data/beacons'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import { isRelay } from '../../Hotspots/utils'
import Widget from '../../Widgets/Widget'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import WarningWidget from '../../Widgets/WarningWidget'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'
import ExternalLinkIcon from '../../Icons/ExternalLink'
import RecentActivityWidget from '../../Widgets/RecentActivityWidget'
import useSelectedTxn from '../../../hooks/useSelectedTxn'
import useSelectedHotspot from '../../../hooks/useSelectedHotspot'

const StatisticsPane = ({ hotspot, isDataOnly, liteHotspotsActive }) => {
  const { beaconSums, isLoading: isBeaconSumsLoading } = useHotspotBeaconSums(
    hotspot.address,
    2,
    'week',
  )

  const { selectedTxn, clearSelectedTxn } = useSelectedTxn()
  const { clearSelectedHotspot } = useSelectedHotspot()

  // the two useEffects below are to clear selected transactions when
  // navigating to or from a hotspot's /activity page, where a transaction
  // /and/ a hotspot may currently be "selected" (for snapping the map to
  // e.g. expanded beacon activity or expanded location assert)
  useEffect(() => {
    if (selectedTxn) {
      clearSelectedTxn()
    }
    return () => {
      clearSelectedTxn()
      clearSelectedHotspot()
    }
  }, [selectedTxn, clearSelectedTxn, clearSelectedHotspot])

  useEffect(() => {
    return () => {
      clearSelectedTxn()
    }
  }, [clearSelectedTxn])

  const errorFetchingWitnessed = hotspot?.errors?.length > 0

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
            {!liteHotspotsActive && (
              <WarningWidget
                isVisible={isRelay(hotspot.status.listenAddrs)}
                warningText={'Hotspot is relayed. Expect lower earnings.'}
                link={
                  'https://docs.helium.com/troubleshooting/network-troubleshooting'
                }
                linkText={'Fix it'}
              />
            )}
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
          title="Earnings (UTC)"
          type="hotspot"
        />
        <RecentActivityWidget context="hotspot" address={hotspot.address} />
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
              title="Total Witnessed"
              linkTo={`/hotspots/${hotspot?.address}/witnessed`}
              value={
                errorFetchingWitnessed
                  ? 'Error fetching'
                  : hotspot?.witnessed?.length
              }
              valueIsText={errorFetchingWitnessed}
              subtitle={
                <span className="text-gray-550 text-sm font-sans">
                  Within past 5 days
                </span>
              }
            />
          </>
        )}
      </InfoBoxPaneContainer>
    </>
  )
}

export default StatisticsPane
