import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import StatisticsPane from './Hotspots/StatisticsPane'
import LatestHotspotsPane from './Hotspots/LatestHotspotsPane'
import MakersPane from './Hotspots/MakersPane'
import TopCitiesPane from './Hotspots/TopCitiesPane'

const HotspotsInfoBox = () => {
  return (
    <InfoBox title={<I18n t="hotspots.title" />} metaTitle="Hotspots">
      <TabNavbar htmlTitleRoot={'Hotspots'}>
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
        <TabPane title="Latest Hotspots" key="latest" path="latest">
          <LatestHotspotsPane />
        </TabPane>
        <TabPane title="Makers" key="makers" path="makers">
          <MakersPane />
        </TabPane>
        <TabPane title="Cities" key="latest" path="cities">
          <TopCitiesPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotsInfoBox
