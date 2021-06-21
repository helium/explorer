import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import BeaconsPane from './Beacons/BeaconsPane'

const BeaconsInfoBox = () => {
  return (
    <InfoBox title="Beacons" metaTitle="Beacons">
      <TabNavbar>
        <TabPane title="All Beacons">
          <BeaconsPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default BeaconsInfoBox
