import { useState, useEffect } from 'react'
import animalHash from 'angry-purple-tiger'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'
import Widget from '../../Widgets/Widget'
import AccountWidget from '../../Widgets/AccountWidget'
import classNames from 'classnames'
import { Pagination } from 'antd'
import { Link } from 'react-router-i18n'
import AccountIcon from '../../AccountIcon'
import AccountAddress from '../../AccountAddress'

const StateChannelCloseV1 = ({ txn }) => {
  const [totalPackets, setTotalPackets] = useState(0)
  const [totalHotspots, setTotalHotspots] = useState(0)
  const [totalDcs, setTotalDcs] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)

  const [data, setData] = useState([])

  useEffect(() => {
    const parsedData = []
    let packetTally = 0
    let dcTally = 0
    let byteTally = 0
    txn.stateChannel.summaries.forEach((s) => {
      packetTally += s.num_packets
      dcTally += s.num_dcs
      byteTally += s.num_dcs * 24
      parsedData.push({
        client: s.client,
        owner: s.owner,
        num_packets: s.num_packets,
        num_dcs: s.num_dcs,
        num_bytes: s.num_dcs * 24,
      })
    })
    parsedData.sort((b, a) =>
      a.num_dcs > b.num_dcs ? 1 : b.num_dcs > a.num_dcs ? -1 : 0,
    )
    const hotspotTally = txn.stateChannel.summaries.length
    setTotalPackets(packetTally)
    setTotalDcs(dcTally)
    setTotalBytes(byteTally)
    setTotalHotspots(hotspotTally)
    setData(parsedData)
  }, [txn])

  const PAGE_SIZE_DEFAULT = 20
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT)
  const [currentPage, setCurrentPage] = useState(1)

  const indexOfLast = currentPage * pageSize
  const indexOfFirst = indexOfLast - pageSize

  const currentPageOfStateChannelParticipants = data.slice(
    indexOfFirst,
    indexOfLast,
  )

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const StateChannelParticipantsWidget = ({ participants }) => {
    return (
      <>
        <div className={classNames(`bg-gray-200 p-3 rounded-lg col-span-2`)}>
          <div className="text-gray-600 text-sm leading-loose">
            {participants.length.toLocaleString()} Participating Hotspots
          </div>
          <div className="space-y-4">
            {currentPageOfStateChannelParticipants.map((p) => {
              return (
                <div
                  key={p.client}
                  className="flex items-start justify-between w-full"
                >
                  <div className="flex flex-col items-start justify-start">
                    <Link
                      to={`/hotspots/${p.client}`}
                      className="text-base leading-tight tracking-tight text-navy-1000 hover:text-navy-400 transition-all duration-150"
                    >
                      {animalHash(p.client)}
                    </Link>
                    <Link
                      to={`/accounts/${p.owner}`}
                      className="flex items-center justify-start text-sm leading-tight tracking-tighter text-gray-600 hover:text-navy-400 pt-1"
                    >
                      <AccountIcon
                        address={p.owner}
                        size={14}
                        className="mr-1"
                      />
                      <AccountAddress mono address={p.owner} truncate={5} />
                    </Link>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className="text-sm leading-tight tracking-tighter text-navy-400 font-medium">
                      <span className="pl-1.5">
                        {p.num_dcs.toLocaleString()} DC
                      </span>
                    </div>
                    <div className="text-sm leading-tight tracking-tighter text-gray-600 pt-1">
                      {p.num_packets.toLocaleString()} packets{' '}
                      <span className="text-navy-600 pl-1.5">
                        {formatBytes(p.num_bytes)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-gray-300 col-span-2 w-full -mt-3 md:-mt-4 border-t border-navy-500 rounded-b-lg py-2">
          <Pagination
            current={currentPage}
            showSizeChanger
            showLessItems
            size="small"
            total={data.length}
            pageSize={pageSize}
            onChange={(page, pageSize) => {
              setCurrentPage(page)
              setPageSize(pageSize)
            }}
          />
        </div>
      </>
    )
  }

  return (
    <InfoBoxPaneContainer>
      <Widget title="Total Packets" value={totalPackets.toLocaleString()} />
      <Widget title="Total Data" value={formatBytes(totalBytes)} />
      <Widget title="Total DC Spent" value={totalDcs.toLocaleString()} />
      <Widget
        title="Number of Hotspots"
        value={totalHotspots.toLocaleString()}
      />
      <Widget title="State Channel ID" value={txn.stateChannel.id} span={2} />
      <AccountWidget title="State Channel Closer" address={txn.closer} />
      <AccountWidget
        title="State Channel Owner"
        address={txn.stateChannel.owner}
      />
      <StateChannelParticipantsWidget participants={data} />
    </InfoBoxPaneContainer>
  )
}

export default StateChannelCloseV1
