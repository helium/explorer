import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import ElectionsPane from './Common/ElectionsPane'
import AllValidatorsPane from './Validators/AllValidatorsPane'
import ConsensusGroupPane from './Validators/ConsensusGroupPane'
import StatisticsPane from './Validators/StatisticsPane'

const ValidatorsInfoBox = () => {
  return (
    <InfoBox title="Validators" metaTitle="Validators">
      <TabNavbar basePath="validators" htmlTitleRoot="Validators">
        <TabPane title="Statistics" key="statistics">
          <StatisticsPane />
        </TabPane>
        <TabPane title="Elections" key="elections" path="elections">
          <ElectionsPane />
        </TabPane>
        <TabPane title="Consensus Group" key="consensus" path="consensus">
          <ConsensusGroupPane />
        </TabPane>
        <TabPane title="All Validators" key="all" path="all">
          <AllValidatorsPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorsInfoBox
