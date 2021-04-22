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

  // const latestHotspot = useMemo(() => {
  //   if (!latestHotspots) return null
  //   return latestHotspots.find((h) => !!h.location)
  // }, [latestHotspots])

  const blocks = {
    count: 809192,
  }

  return (
    <InfoBox title={<I18n t="blocks.title" />}>
      <TabNavbar>
        <TabPane title="Overview" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <TrendWidget
              title="Blocks"
              series={blocks?.count}
              isLoading={!blocks}
            />
            {/* <StatWidget
              title="% Online"
              series={stats?.onlinePct}
              isLoading={!stats}
            />
            <StatWidget
              title="Hotspot Owners"
              series={stats?.ownersCount}
              isLoading={!stats}
            />
            <StatWidget
              title="Cities"
              series={stats?.citiesCount}
              isLoading={!stats}
            />
            <StatWidget
              title="Countries"
              series={stats?.countriesCount}
              isLoading={!stats}
            />
            <LatestHotspotWidget hotspot={latestHotspot} /> */}
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
        {/* <TabPane title="Statistics" key="2">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <TrendWidget
              title="Hotspots"
              series={stats?.count}
              isLoading={!stats}
            />
            <StatWidget
              title="% Online"
              series={stats?.onlinePct}
              isLoading={!stats}
            />
            <StatWidget
              title="Hotspot Owners"
              series={stats?.ownersCount}
              isLoading={!stats}
            />
            <StatWidget
              title="Cities"
              series={stats?.citiesCount}
              isLoading={!stats}
            />
            <StatWidget
              title="Countries"
              series={stats?.countriesCount}
              isLoading={!stats}
            />
            <LatestHotspotWidget hotspot={latestHotspot} />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane> */}
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
