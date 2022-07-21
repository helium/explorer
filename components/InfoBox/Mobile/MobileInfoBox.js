import { useEffect } from 'react'
import InfoBox from '../InfoBox'
import TabNavbar, { TabPane } from '../../Nav/TabNavbar'
import StatisticsPane from './StatisticsPane'
import useMapLayer from '../../../hooks/useMapLayer'

const MobileInfoBox = () => {
  const { setMapLayer } = useMapLayer()

  useEffect(() => {
    setMapLayer('cbrs')
  }, [setMapLayer])

  return (
    <InfoBox title="MOBILE" metaTitle="MOBILE">
      <TabNavbar htmlTitleRoot="MOBILE">
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default MobileInfoBox
