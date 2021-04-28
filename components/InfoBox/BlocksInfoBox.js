import useSWR from 'swr'
import InfoBox from './InfoBox'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import LatestBlocksPane from './BlocksInfoPanes/LatestBlocks'
import BlockStatisticsPane from './BlocksInfoPanes/BlockStatisticsPane'

const HotspotsInfoBox = () => {
  let { data: blocks } = useSWR('/api/metrics/blocks')

  blocks = { ...blocks, longFiData: [{ value: 2000 }, { value: 2010 }] }

  return (
    <InfoBox title={<I18n t="blocks.title" />}>
      <TabNavbar basePath="blocks">
        <TabPane title="Statistics" key="1">
          <BlockStatisticsPane blocks={blocks} />
        </TabPane>
        <TabPane title="Lastest Blocks" key="2" path="latest">
          <LatestBlocksPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotsInfoBox
