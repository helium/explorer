import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import HalveningCountdownWidget from '../Widgets/HalvingCountdownWidget'
import useApi from '../../hooks/useApi'

const OverviewInfoBox = () => {
  const { data: stats } = useApi('/metrics/hotspots')

  return (
    <InfoBox title="Helium Explorer">
      <TabNavbar>
        <TabPane title="Overview" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar">
            <TrendWidget
              title="Hotspots"
              series={stats?.count}
              isLoading={!stats}
            />
            <StatWidget
              title="% Online"
              series={stats?.onlinePct}
              isLoading={!stats}
              valueType="percent"
              changeType="percent"
            />
            <StatWidget
              title="Hotspot Owners"
              series={stats?.ownersCount}
              isLoading={!stats}
            />
            <HalveningCountdownWidget />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default OverviewInfoBox
