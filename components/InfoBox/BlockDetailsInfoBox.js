import useSWR from 'swr'
import InfoBox from './InfoBox'
import TrendWidget from '../Widgets/TrendWidget'
import StatWidget from '../Widgets/StatWidget'
import Widget from '../Widgets/Widget'
import FlagLocation from '../Common/FlagLocation'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import I18n from '../../copy/I18n'
import { useLatestHotspots } from '../../data/hotspots'
import { useMemo } from 'react'
import { formatHotspotName } from '../Hotspots/utils'
import Timestamp from 'react-timestamp'
import Image from 'next/image'

const BlockDetailsInfoBox = () => {
  // const { data: blocks } = useSWR('/api/metrics/blocks')

  // const latestHotspot = useMemo(() => {
  //   if (!latestHotspots) return null
  //   return latestHotspots.find((h) => !!h.location)
  // }, [latestHotspots])

  const blocks = {
    count: 809192,
  }

  const block = {
    transactionCount: 141,
    time: 1618184215,
    snapshotHash: '',
    prevHash: 'TS5jgw28xQLBB-m80_eDKDPcj013OI4XDW3Q3kERT4o',
    height: 800000,
    hash: 'j7NYY-dn2CWuLYU08wA57Bkf1aJSfrp04ld_9I6n2qI',
  }

  return (
    <InfoBox title={`Block ${block.height.toLocaleString()}`}>
      <div className="overflow-y-scroll px-4 py-5">
        <div className="flex flex-col items-start text-gray-800">
          <span className="flex items-center justify-start">
            <Image src="/images/clock.svg" width={14} height={14} />
            <Timestamp
              date={block.time}
              className="tracking-tighter text-gray-525 text-sm font-sans ml-1"
            />
          </span>
          <span className="flex flex-row items-center justify-start">
            <Image src="/images/txn.svg" width={14} height={14} />
            <p className="tracking-tighter text-gray-525 text-sm font-sans m-0 ml-1">
              {block.transactionCount} transactions
            </p>
          </span>
        </div>

        <div className="col-span-2 pb-1" />
      </div>
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
