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
import Timestamp from 'react-timestamp'
import { Link } from 'react-router-i18n'
import { useBlockHeight } from '../../data/blocks'
import Skeleton from '../Common/Skeleton'

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
    const BlockNavButton = ({ linkPath, icon, classes }) => (
      <Link
        className={classNames(
          'bg-gray-700 hover:bg-gray-650 transition-all duration-150 rounded-md h-6 w-6 flex items-center justify-center',
          classes,
        )}
        to={linkPath}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {icon}
        </svg>
      </Link>
    )
    return (
      <span className="flex items-end justify-start">
        Block {parseInt(height).toLocaleString()}
        <span className="ml-2 flex items-end justify-start mb-1">
          <BlockNavButton
            linkPath={`/blocks/${parseInt(height) - 1}`}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            }
          />
          {currentHeight > parseInt(height) && (
            <BlockNavButton
              classes="ml-0.5"
              linkPath={`/blocks/${parseInt(height) + 1}`}
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              }
            />
          )}
        </span>
      </span>
    )
  }, [block])

  const generateSubtitles = (block) => {
    if (blockLoading)
      return [
        {
          iconPath: '/images/clock.svg',
          loading: true,
        },
        {
          iconPath: '/images/txn.svg',
          loading: true,
        },
        {
          iconPath: '/images/block-purple.svg',
          loading: true,
        },
      ]
    return [
      {
        iconPath: '/images/clock.svg',
        title: <Timestamp date={block.time} />,
      },
      {
        iconPath: '/images/txn.svg',
        title: `${block.transactionCount} transactions`,
      },
      {
        iconPath: '/images/block-purple.svg',
        title: `${formattedTxnHash(block.hash)}`,
        textToCopy: block.hash,
      },
    ]
  }

  return (
    <InfoBox title={title} subtitles={generateSubtitles(block)}>
      {!blockLoading ? (
        <>
          {block.txns?.length > 0 ? (
            <>
              <TransactionTypesWidget txns={block.txns} />
              <TabNavbar
                centered={false}
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
              <Skeleton w="w-full" my="my-2" />
              <p className="font-sans text-gray-600 text-lg">No transactions</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ width: '100%', minHeight: 60 + 76 }}></div>
          <SkeletonList />
        </>
      )}
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
