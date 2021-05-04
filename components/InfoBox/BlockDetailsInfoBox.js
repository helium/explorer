import InfoBox from './InfoBox'
import { useAsync } from 'react-async-hooks'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { fetchBlock, fetchBlockTxns } from '../../data/blocks'
import {
  getTxnTypeName,
  getTxnTypeColor,
  splitTransactionsByTypes,
} from '../../utils/txns'
import TransactionList from '../Lists/TransactionList'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import classNames from 'classnames'
import TransactionTypesWidget from '../Widgets/TransactionTypesWidget'
import SkeletonList from '../Lists/SkeletonList'
import { useHistory } from 'react-router-dom'
import Timestamp from 'react-timestamp'

const BlockDetailsInfoBox = () => {
  const { block: height } = useParams()
  const history = useHistory()

  const [block, setBlock] = useState({})
  const [blockLoading, setBlockLoading] = useState(true)

  useAsync(async () => {
    const getBlockDetails = async (height) => {
      setBlockLoading(true)
      const [block, txns] = await Promise.all([
        fetchBlock(height),
        fetchBlockTxns(height),
      ])
      const splitTxns = splitTransactionsByTypes(txns)
      if (splitTxns.length > 0)
        history.push(`/blocks/${height}/${splitTxns[0].type}`)
      setBlock({ ...block, splitTxns, txns })
      setBlockLoading(false)
    }
    getBlockDetails(height)
  }, [height])

  const title = useMemo(() => `Block ${parseInt(height).toLocaleString()}`, [
    block,
  ])

  return (
    <InfoBox title={title}>
      {!blockLoading ? (
        <>
          <div className="flex flex-col items-start font-sans text-gray-800 p-5 pb-2">
            <span className="flex items-center justify-start">
              <img src="/images/clock.svg" className="w-4 h-auto" />
              <Timestamp
                date={block.time}
                className="tracking-tight text-gray-525 text-sm font-sans ml-2"
              />
            </span>
            <span className="flex flex-row items-center justify-start mt-2">
              <img src="/images/txn.svg" className="w-4 h-auto" />
              <p className="tracking-tight text-gray-525 text-sm font-sans m-0 ml-2">
                {block.transactionCount} transactions
              </p>
            </span>
          </div>
          {block.txns?.length > 0 ? (
            <>
              <TransactionTypesWidget txns={block.txns} />
              <TabNavbar
                centered={false}
                customStyles
                classes="w-full border-b border-gray-400 border-solid mt-0 px-2 md:px-4 flex overflow-x-scroll no-scrollbar"
              >
                {block.splitTxns.map((type) => {
                  return (
                    <TabPane
                      title={
                        <div className="">
                          <p
                            style={{ color: getTxnTypeColor(type.type) }}
                            className={'mb-0 text-xl'}
                          >
                            {type.txns.length}
                          </p>
                          <p
                            className={classNames(
                              'text-sm mb-0 whitespace-nowrap',
                            )}
                          >
                            {getTxnTypeName(type.type)}
                          </p>
                        </div>
                      }
                      key={type.type}
                      path={type.type}
                      customStyles
                      classes={'text-gray-600 hover:text-gray-800'}
                      activeClasses={'border-b-3 border-solid'}
                      activeStyles={{
                        borderColor: getTxnTypeColor(type.type),
                        color: 'black',
                      }}
                    >
                      <div
                        className={classNames(
                          'grid grid-flow-row grid-cols-1 no-scrollbar',
                          {
                            'overflow-y-scroll': !blockLoading,
                            'overflow-y-hidden': blockLoading,
                          },
                        )}
                      >
                        <TransactionList
                          transactions={type.txns}
                          isLoading={blockLoading}
                        />
                      </div>
                    </TabPane>
                  )
                })}
              </TabNavbar>
            </>
          ) : (
            <div className="py-10 px-3 flex items-center justify-center">
              <p className="font-sans text-gray-600 text-lg">No transactions</p>
            </div>
          )}
        </>
      ) : (
        <SkeletonList />
      )}
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
