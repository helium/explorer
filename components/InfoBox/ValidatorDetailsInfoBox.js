import { useParams } from 'react-router'
import animalHash from 'angry-purple-tiger'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import OverviewPane from './ValidatorDetails/OverviewPane'
import PenaltiesPane from './ValidatorDetails/PenaltiesPane'

const ValidatorDetailsInfoBox = () => {
  const { address } = useParams()

  return (
    <InfoBox
      title={animalHash(address)}
      metaTitle={`Validator ${animalHash(address)}`}
    >
      <TabNavbar>
        <TabPane title="Overview" key="overview">
          <OverviewPane />
        </TabPane>
        <TabPane title="Penalties" key="penalties" path="penalties">
          <PenaltiesPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default ValidatorDetailsInfoBox
