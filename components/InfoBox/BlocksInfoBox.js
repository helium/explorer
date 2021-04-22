import useSWR from 'swr'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import Widget from '../Widgets/Widget'
import FlagLocation from '../Common/FlagLocation'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import { useLatestHotspots } from '../../data/hotspots'
import { useMemo } from 'react'
import { formatHotspotName } from '../Hotspots/utils'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'

const HotspotsInfoBox = () => {
  // const { data: blocks } = useSWR('/api/metrics/blocks')

  const blocks = {
    txnRate: [
      { value: 100 },
      { value: 100 },
      { value: 90 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 110 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 2 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 120 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 100 },
      { value: 110 },
    ],
    electionTimeDay: [{ value: 35 }, { value: 30 }],
    longFiData: [
      { value: 1080 },
      {
        value: 1190,
      },
    ],
    height: [
      { value: 809010 },
      {
        value: 809000,
      },
    ],
    blockTimeDay: [{ value: 52.3 }],
    blockTimeWeek: [{ value: 52.3 }],
    blockTimeMonth: [{ value: 52.3 }],
    latestBlocks: [
      { height: 809010, transactionCount: 100 },
      { height: 809009, transactionCount: 100 },
      { height: 809008, transactionCount: 100 },
      { height: 809007, transactionCount: 100 },
      { height: 809006, transactionCount: 100 },
      { height: 809005, transactionCount: 100 },
      { height: 809004, transactionCount: 100 },
      { height: 809003, transactionCount: 100 },
    ],
  }

  return (
    <InfoBox title={<I18n t="blocks.title" />}>
      <TabNavbar basePath="blocks">
        <TabPane title="Statistics" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <TrendWidget
              title="Transaction Rate"
              series={blocks?.txnRate}
              isLoading={!blocks}
              periodLabel={'Last 100 Blocks'}
            />
            <StatWidget
              title="Election Time (24hr)"
              series={blocks?.electionTimeDay}
              isLoading={!blocks}
            />
            <StatWidget
              title="LongFi Data"
              series={blocks?.longFiData}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Height"
              series={blocks?.height}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (1hr)"
              series={blocks?.blockTimeDay}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (7D)"
              series={blocks?.blockTimeWeek}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (30D)"
              series={blocks?.blockTimeMonth}
              isLoading={!blocks}
            />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
        <TabPane title="Block List" key="2" path="list">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            {!blocks ? (
              <div>Loading...</div>
            ) : (
              <div>
                {blocks.latestBlocks.map((b) => {
                  return <div>block {b.height}</div>
                })}
              </div>
            )}
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

const LatestHotspotWidget = ({ hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return null

  return (
    <Widget
      title="Latest Hotspot"
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      onClick={() => selectHotspot(hotspot.address)}
      isLoading={!hotspot}
    />
  )
}

export default HotspotsInfoBox
