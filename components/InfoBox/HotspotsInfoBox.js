import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import StatisticsPane from './Hotspots/StatisticsPane'
import LatestHotspotsPane from './Hotspots/LatestHotspotsPane'

const HotspotsInfoBox = () => {
  return (
    <InfoBox title={<I18n t="hotspots.title" />} metaTitle="Hotspots">
      <TabNavbar metaTitle="Hotspots">
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
        <TabPane title="Latest Hotspots" key="latest" path="latest">
          <LatestHotspotsPane />
        </TabPane>
        <TabPane title="All Hotspots" key="all" path="all">
          <LatestHotspotsPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotsInfoBox
