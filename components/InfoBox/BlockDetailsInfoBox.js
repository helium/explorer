import InfoBox from './InfoBox'
import { useAsync } from 'react-async-hooks'
import { useState, useMemo } from 'react'
import { useParams } from 'react-router'
import { fetchBlock } from '../../data/blocks'
import {
  formattedTxnHash,
} from '../../utils/txns'
import SkeletonList from '../Lists/SkeletonList'
import { useBlockHeight } from '../../data/blocks'
import PreviousIcon from '../Icons/Previous'
import NextIcon from '../Icons/Next'
import InfoBoxTitleButton from './Common/InfoBoxTitleButton'
import BlockTimestamp from '../Common/BlockTimestamp'
import BlockTransactionsList from './BlocksInfoPanes/BlockTransactionsList'

const BlockDetailsInfoBox = () => {
  const { height: currentHeight } = useBlockHeight()
  const { block: height } = useParams()

  const [block, setBlock] = useState({})
  const [blockLoading, setBlockLoading] = useState(true)

  // const [txns, setTxns] = useState({})
  // const [txnsLoading, setTxnsLoading] = useState(true)

  useAsync(async () => {
    // get block metadata (for subtitles)
    setBlockLoading(true)
    const block = await fetchBlock(height)
    setBlock(block)
    setBlockLoading(false)
  }, [height])

  // useAsync(async () => {
  //   // get transactions (for the list and the tabs)
  //   setTxnsLoading(true)
  //   const txns = await fetchBlockTxns(height)
  //   const splitTxns = splitTransactionsByTypes(txns)
  //   setTxns({ splitTxns, txns })
  //   setTxnsLoading(false)
  // }, [height])

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
        },
      ],
    ]
  }

  if (blockLoading) {
    return (
      <InfoBox title={title} subtitles={generateSubtitles(block)}>
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
      <BlockTransactionsList height={height} />
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
