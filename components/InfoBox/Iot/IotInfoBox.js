import { useEffect } from 'react'
import InfoBox from '../InfoBox'
import TabNavbar, { TabPane } from '../../Nav/TabNavbar'
import StatisticsPane from './StatisticsPane'
import MakersPane from '../Common/MakersPane'
import TopCitiesPane from './TopCitiesPane'
import useMapLayer from '../../../hooks/useMapLayer'

const IotInfoBox = () => {
  const { setMapLayer } = useMapLayer()

  useEffect(() => {
    setMapLayer('default')
  }, [setMapLayer])

  return (
    <InfoBox title="IOT" metaTitle="IOT">
      <TabNavbar htmlTitleRoot="IOT">
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
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

export default IotInfoBox
