import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import LatestBlocksPane from './BlocksInfoPanes/LatestBlocks'
import BlockStatisticsPane from './BlocksInfoPanes/BlockStatisticsPane'

const BlocksInfoBox = () => {
  return (
    <InfoBox title={<I18n t="blocks.title" />}>
      <TabNavbar basePath="blocks">
        <TabPane title="Statistics" key="statistics">
          <BlockStatisticsPane />
        </TabPane>
        <TabPane title="Latest Blocks" key="latest" path="latest">
          <LatestBlocksPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default BlocksInfoBox
