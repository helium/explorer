import { useParams } from 'react-router'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import AccountAddress from '../AccountAddress'
import OverviewPane from './AccountDetails/OverviewPane'
import ActivityPane from './Common/ActivityPane'
import HotspotsPane from './AccountDetails/HotspotsPane'

const AccountDetailsInfoBox = () => {
  const { address } = useParams()

  return (
    <InfoBox title={<AccountAddress address={address} truncate={7} />}>
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>

        <TabPane title="Activity" key="activity" path="activity">
          <ActivityPane context="account" address={address} />
        </TabPane>

        <TabPane title="Hotspots" key="hotspots" path="hotspots">
          <HotspotsPane address={address} />
        </TabPane>

        {/* <TabPane title="Validators" key="validators" path="validators">
          <OverviewPane />
        </TabPane> */}
      </TabNavbar>
    </InfoBox>
  )
}

export default AccountDetailsInfoBox
