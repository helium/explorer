import InfoBox from './InfoBox'
import { useAsync } from 'react-async-hooks'
import { useState } from 'react'
import { useParams } from 'react-router'
import Timestamp from 'react-timestamp'
import Image from 'next/image'
import { fetchBlock, fetchBlockTxns } from '../../data/blocks'
import SkeletonList from '../Lists/SkeletonList'

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

      setBlock({ ...block, txns })
      setBlockLoading(false)
    }
    getBlockDetails(height)
  }, [height])

  return (
    <InfoBox
      title={`Block ${
        blockLoading ? 'loading...' : block.height.toLocaleString()
      }`}
    >
      <div className="overflow-y-scroll px-4 py-5">
        {blockLoading ? (
          <SkeletonList />
        ) : (
          <>
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
          </>
        )}
      </div>
    </InfoBox>
  )
}

export default BlockDetailsInfoBox
