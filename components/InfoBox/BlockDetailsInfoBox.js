import InfoBox from './InfoBox'
import { useAsync } from 'react-async-hooks'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { fetchBlock, fetchBlockTxns } from '../../data/blocks'
import {
  getTxnTypeName,
  getTxnTypeColor,
  splitTransactionsByTypes,
  formattedTxnHash,
} from '../../utils/txns'
import TransactionList from '../Lists/TransactionList'
import TabNavbar, { TabPane } from '../Nav/TabNavbar'
import classNames from 'classnames'
import TransactionTypesWidget from '../Widgets/TransactionTypesWidget'
import SkeletonList from '../Lists/SkeletonList'
import { useHistory } from 'react-router-dom'
import { useBlockHeight } from '../../data/blocks'
import PreviousIcon from '../Icons/Previous'
import NextIcon from '../Icons/Next'
import InfoBoxTitleButton from './Common/InfoBoxTitleButton'
import Skeleton from '../Common/Skeleton'
import BlockTimestamp from '../Common/BlockTimestamp'

const BlockDetailsInfoBox = () => {
  const { height: currentHeight } = useBlockHeight()
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

  const title = useMemo(() => {
    const blockHeight = parseInt(height)
    return (
      <span className="flex items-end justify-start">
        Block {blockHeight.toLocaleString()}
        <span className="ml-2 flex items-end justify-start mb-1">
          <InfoBoxTitleButton
            classes="opacity-75"
            linkPath={`/blocks/${blockHeight - 1}`}
            icon={<PreviousIcon classes="h-4 w-4 text-white" />}
          />
          {currentHeight > blockHeight && (
            <InfoBoxTitleButton
              classes="ml-0.5 opacity-75"
              linkPath={`/blocks/${blockHeight + 1}`}
              icon={<NextIcon classes="h-4 w-4 text-white" />}
            />
          )}
        </span>
      </span>
    )
  }, [height, currentHeight])

  const generateSubtitles = (block) => {
    if (blockLoading)
      return [
        [
          {
            iconPath: '/images/clock.svg',
            loading: true,
            skeletonClasses: 'w-32',
          },
          {
            iconPath: '/images/txn.svg',
            loading: true,
            skeletonClasses: 'w-32',
          },
        ],
        [
          {
            iconPath: '/images/block-purple.svg',
            loading: true,
            // newRow: true,
            skeletonClasses: 'w-32',
          },
        ],
      ]
    return [
      [
        {
          iconPath: '/images/clock.svg',
          title: (
            <BlockTimestamp blockHash={block.hash} blockTime={block.time} />
          ),
        },
        {
          iconPath: '/images/txn.svg',
          title: `${block.transactionCount} transactions`,
        },
      ],
      [
        {
          iconPath: '/images/block-purple.svg',
          title: `${formattedTxnHash(block.hash)}`,
          textToCopy: block.hash,
          newRow: true,
        },
      ],
    ]
  }

  if (blockLoading) {
    return (
      <InfoBox title={title} subtitles={generateSubtitles(block)}>
        <div
          className="bg-white px-5 pt-3 rounded-lg col-span-2"
          style={{ width: '100%', minHeight: 60 + 76 }}
        >
          <Skeleton className="h-6 w-full my-3 rounded-lg flex overflow-hidden" />
          <div className="flex items-center justify-start pt-5 space-x-4">
            <Skeleton className="w-1/4 h-10" />
            <Skeleton className="w-1/4 h-10" />
            <Skeleton className="w-1/4 h-10" />
            <Skeleton className="w-1/4 h-10" />
          </div>
        </div>
        <SkeletonList />
      </InfoBox>
    )
  }

  return (
    <InfoBox
      title={title}
      metaTitle={`Block ${parseInt(height).toLocaleString()}`}
      subtitles={generateSubtitles(block)}
      breadcrumbs={[{ title: 'Blocks', path: '/blocks/latest' }]}
    >
      {block.txns?.length > 0 ? (
        <>
          <TransactionTypesWidget txns={block.txns} />
          <TabNavbar
            centered={false}
            className="w-full border-b border-gray-400 border-solid mt-0 px-2 md:px-4 flex overflow-x-scroll no-scrollbar"
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
      ) : (
        <div className="py-10 px-3 flex flex-col items-center justify-center">
          <p className="font-sans text-gray-600 text-lg">No transactions</p>
        </div>
      )}
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
