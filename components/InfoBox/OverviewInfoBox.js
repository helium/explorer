import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import HalveningCountdownWidget from '../Widgets/HalvingCountdownWidget'
import useApi from '../../hooks/useApi'
import InfoBoxPaneContainer from './Common/InfoBoxPaneContainer'

const OverviewInfoBox = () => {
  const { data: stats } = useApi('/metrics/hotspots')

  return (
    <InfoBox title="Helium Explorer">
      <TabNavbar>
        <TabPane title="Overview" key="1">
          <InfoBoxPaneContainer>
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
          </InfoBoxPaneContainer>
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default OverviewInfoBox
