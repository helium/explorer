import useSWR from 'swr'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'

const OverviewInfoBox = () => {
  const { data: stats } = useSWR('/api/metrics/hotspots')

  return (
    <InfoBox title="Overview">
      <TabNavbar>
        <TabPane title="Overview" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <TrendWidget title="Hotspots" series={stats?.count} />
            <StatWidget title="% Online" series={stats?.onlinePct} />
            <StatWidget title="Hotspot Owners" series={stats?.ownersCount} />
            <StatWidget title="Cities" series={stats?.citiesCount} />
            <StatWidget title="Countries" series={stats?.countriesCount} />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default OverviewInfoBox
