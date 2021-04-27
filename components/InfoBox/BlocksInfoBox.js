import { useCallback } from 'react'
import useSWR from 'swr'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import LatestBlocksPane from './BlocksInfoPanes/LatestBlocks'

const HotspotsInfoBox = () => {
  let { data: blocks } = useSWR('/api/metrics/blocks')

  blocks = { ...blocks, longFiData: [{ value: 2000 }, { value: 2010 }] }

  // const renderBreadcrumbs = useCallback((txn) => {
  //   return (
  //     <span className="flex items-center space-x-1">
  //       <Image src="/images/clock.svg" width={14} height={14} />
  //       <Timestamp date={txn.time} className="tracking-tighter" />
  //     </span>
  //   )
  // }, [])

  return (
    <InfoBox
      title={<I18n t="blocks.title" />}
      // renderBreadcrumbs={renderBreadcrumbs}
    >
      <TabNavbar basePath="blocks">
        <TabPane title="Statistics" key="1">
          <div className="grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll">
            <TrendWidget
              title="Transaction Rate"
              series={blocks?.txnRate}
              isLoading={!blocks}
              periodLabel={'Last 100 Blocks'}
            />
            <StatWidget
              title="Election Time (24hr)"
              series={blocks?.electionTimeDay}
              isLoading={!blocks}
            />
            <StatWidget
              title="LongFi Data"
              series={blocks?.longFiData}
              suffix={'GB'}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Height"
              series={blocks?.height}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (1hr)"
              series={blocks?.blockTimeDay}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (7D)"
              series={blocks?.blockTimeWeek}
              isLoading={!blocks}
            />
            <StatWidget
              title="Block Time (30D)"
              series={blocks?.blockTimeMonth}
              isLoading={!blocks}
            />
            <div className="col-span-2 pb-1" />
          </div>
        </TabPane>
        <TabPane title="Lastest Blocks" key="2" path="latest">
          <LatestBlocksPane />
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

export default HotspotsInfoBox
