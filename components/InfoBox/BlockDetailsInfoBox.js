import InfoBox from './InfoBox'
import { useAsync } from 'react-async-hooks'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import Timestamp from 'react-timestamp'
import Image from 'next/image'
import {
  fetchBlock,
  fetchBlockTxns,
  splitTransactionsByTypes,
} from '../../data/blocks'
import TransactionList from '../Lists/TransactionList'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import classNames from 'classnames'

const BlockDetailsInfoBox = () => {
  const { block: height } = useParams()

  const [block, setBlock] = useState({})
  const [blockLoading, setBlockLoading] = useState(true)

  useAsync(async () => {
    const getBlockDetails = async (height) => {
      setBlockLoading(true)
      const [block, txns] = await Promise.all([
        fetchBlock(height),
        fetchBlockTxns(height),
      ])

      setBlock({ ...block, txns: splitTransactionsByTypes(txns) })
      setBlockLoading(false)
    }
    getBlockDetails(height)
  }, [height])

  const title = useMemo(() => `Block ${parseInt(height).toLocaleString()}`, [
    block,
  ])

  return (
    <InfoBox title={title}>
      {!blockLoading && (
        <TabNavbar>
          {block.txns.map((type) => {
            return (
              <TabPane
                title={
                  <div className="">
                    <p
                      className={
                        // TODO: tidy up into util function
                        classNames({
                          'text-navy-400': type.type === 'poc_receipts_v1',
                          'text-green-400': type.type === 'poc_request_v1',
                          'text-gray-600': type.type === 'payment_v2',
                        })
                      }
                    >
                      {type.txns.length}
                    </p>
                    <p
                      className={classNames('text-gray-600 text-sm', {
                        'hover:text-navy-400': type.type === 'poc_receipts_v1',
                        'hover:text-green-400': type.type === 'poc_request_v1',
                        'hover:text-gray-600': type.type === 'payment_v2',
                      })}
                    >
                      {type.type}
                    </p>
                  </div>
                }
                key={type.type}
                customBorder
                path={type.type}
                activeClasses={classNames(
                  'text-black border-b-3 border-solid',
                  {
                    'border-navy-400': type.type === 'poc_receipts_v1',
                    'border-green-400': type.type === 'poc_request_v1',
                    'border-gray-600': type.type === 'payment_v2',
                  },
                )}
              >
                <TransactionList
                  transactions={type.txns}
                  isLoading={blockLoading}
                />
              </TabPane>
            )
          })}
        </TabNavbar>
      )}
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
