import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import StatisticsPane from './Hotspots/StatisticsPane'
import MakersPane from './Hotspots/MakersPane'
import TopCitiesPane from './Hotspots/TopCitiesPane'
import CellStatisticsPane from './Hotspots/CellStatisticsPane'

const HotspotsInfoBox = () => {
  return (
    <InfoBox title={<I18n t="hotspots.title" />} metaTitle="Hotspots">
      <TabNavbar htmlTitleRoot={'Hotspots'}>
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
        <TabPane title="5G Statistics" key="5g_statistics" path="5g_statistics">
          <CellStatisticsPane />
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
