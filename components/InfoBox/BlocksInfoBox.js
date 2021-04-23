import useSWR from 'swr'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import Widget from '../Widgets/Widget'
import FlagLocation from '../Common/FlagLocation'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import { Link } from 'react-router-i18n'
import { useLatestHotspots } from '../../data/hotspots'
import { useMemo } from 'react'
import { formatHotspotName } from '../Hotspots/utils'
import useSelectedHotspot from '../../hooks/useSelectedHotspot'
import Image from 'next/image'
import classNames from 'classnames'
import Timestamp from 'react-timestamp'
import LatestBlocksPane from './BlocksInfoPanes/LatestBlocks'

// TODO: fix data fetching and delete
import { blocks } from './temp_block_dummy_data'

const HotspotsInfoBox = () => {
  // const { data: blocks } = useSWR('/api/metrics/blocks')

  return (
    <InfoBox title={<I18n t="blocks.title" />}>
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
          {/* <div className="flex flex-col overflow-y-scroll p-2">
            {!blocks ? (
              <div>Loading...</div>
            ) : (
              <div>
                <div
                  className={classNames(
                    'hover:bg-gray-100',
                    'bg-white',
                    'relative',
                    'flex',
                    'flex-col',
                    'border-t',
                    'border-b',
                    'border-l',
                    'border-r',
                    'border-solid',
                    'border-gray-500',
                    'rounded-lg',
                    'mb-5',
                  )}
                >
                  <div
                    className={classNames(
                      'absolute',
                      'top-0',
                      'bottom-0',
                      'w-14',
                      'flex',
                      'items-center',
                      'justify-center',
                      'bg-purple-700',
                      'p-2',
                      'rounded-tl-lg',
                      'rounded-bl-lg',
                    )}
                  >
                    <Image
                      src="/images/consensus_c.svg"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="pl-14 py-2">
                    <p className="pl-2 m-0 text-black font-medium">
                      {(blocks.latestBlocks[0].height + 1).toLocaleString()}
                    </p>
                    <p className="pl-2 m-0 text-gray-650 font-medium">
                      In Consensus...
                    </p>
                  </div>
                </div>
                {blocks.latestBlocks.map((b, i, { length }) => {
                  return (
                    <Link to={`/blocks/${b.height}`}>
                      <div
                        className={classNames(
                          'hover:bg-gray-100',
                          'bg-white',
                          'relative',
                          'flex',
                          'flex-col',
                          'border-t',
                          'border-0',
                          'border-l',
                          'border-r',
                          'border-solid',
                          'border-gray-500',
                          {
                            'rounded-t-lg': i === 0,
                            'rounded-b-lg border-b': i === length - 1,
                            'border-b-0': i !== 0 && i !== length - 1,
                          },
                        )}
                      >
                        <div className="p-2">
                          <div className="flex items-center justify-start">
                            <span className="mr-2" />
                            <p className="text-black text-md font-semibold m-0 p-0">
                              {b.height.toLocaleString()}
                              <span className="font-normal text-gray-600 flex flex-row items-center justify-between">
                                <span className="flex items-center">
                                  <Image
                                    src="/images/clock.svg"
                                    width={14}
                                    height={14}
                                  />
                                  <Timestamp
                                    date={b.time}
                                    className="tracking-tighter text-gray-525 text-sm font-sans"
                                  />
                                </span>
                                <span className="flex items-center justify-start">
                                  <Image
                                    src="/images/txn.svg"
                                    width={14}
                                    height={14}
                                  />
                                  <p className="tracking-tighter text-gray-525 text-sm font-sans">
                                    {b.transaction_count} transactions
                                  </p>
                                </span>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
            <div className="col-span-2 pb-1" />
          </div> */}
        </TabPane>
      </TabNavbar>
    </InfoBox>
  )
}

const LatestHotspotWidget = ({ hotspot }) => {
  const { selectHotspot } = useSelectedHotspot()
  if (!hotspot) return null

  return (
    <Widget
      title="Latest Hotspot"
      value={formatHotspotName(hotspot.name)}
      subtitle={<FlagLocation geocode={hotspot.geocode} />}
      span={2}
      onClick={() => selectHotspot(hotspot.address)}
      isLoading={!hotspot}
    />
  )
}

export default HotspotsInfoBox
