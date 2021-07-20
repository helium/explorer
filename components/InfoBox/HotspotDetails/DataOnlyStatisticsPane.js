import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import ChecklistWidget from '../../Widgets/ChecklistWidget'
import classNames from 'classnames'
import ChevronIcon from '../../Icons/Chevron'
import PeriodizedRewardsWidget from '../../Widgets/PeriodizedRewardsWidget'
import ExternalLinkIcon from '../../Icons/ExternalLink'
import InfoBoxPaneTitleSection from '../Common/InfoBoxPaneTitleSection'

const DataOnlyStatisticsPane = ({
  hotspot,
  showChecklist,
  toggleShowChecklist,
  witnessesData,
}) => {
  return (
    <>
      <InfoBoxPaneTitleSection
        title="Data-Only Hotspot"
        description={
          <div className="space-y-2.5">
            <div>
              This Hotspot transfers data packets only and does not participate
              in Beacons, Witnessing, and Proof-of-Coverage.
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
      <InfoBoxPaneContainer>
        <PeriodizedRewardsWidget
          address={hotspot.address}
          title="Earnings"
          type="hotspot"
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
          <ChecklistWidget
            hotspot={hotspot}
            witnesses={witnessesData}
            isDataOnly
          />
        )}
      </InfoBoxPaneContainer>
    </>
  )
}

export default DataOnlyStatisticsPane
