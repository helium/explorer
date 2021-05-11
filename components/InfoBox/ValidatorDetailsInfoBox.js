import { useParams } from 'react-router'
import animalHash from 'angry-purple-tiger'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import OverviewPane from './ValidatorDetails/OverviewPane'

const ValidatorDetailsInfoBox = () => {
  const { address } = useParams()

  return (
    <InfoBox title={animalHash(address)}>
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorDetailsInfoBox
