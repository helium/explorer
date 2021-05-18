import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import StatisticsPane from './Hotspots/StatisticsPane'
import LatestHotspotsPane from './Hotspots/LatestHotspotsPane'
import MakersTabPane from './Hotspots/MakersTabPane'

const HotspotsInfoBox = () => {
  return (
    <InfoBox title={<I18n t="hotspots.title" />}>
      <TabNavbar>
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
        <TabPane title="Latest Hotspots" key="latest" path="latest">
          <LatestHotspotsPane />
        </TabPane>
        <TabPane title="Makers" key="all" path="makers">
          <MakersTabPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotsInfoBox
