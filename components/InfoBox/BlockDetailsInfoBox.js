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

      setBlock({ ...block, splitTxns: splitTransactionsByTypes(txns), txns })
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
                        className={classNames('text-sm mb-0 whitespace-nowrap')}
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
      )}
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
