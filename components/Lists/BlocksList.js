import { useCallback } from 'react'
import Image from 'next/image'
import BaseList from './BaseList'
import BlockTimestamp from '../Common/BlockTimestamp'

const BlocksList = ({
  blocks,
  isLoading = true,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const handleSelectBlock = useCallback((block) => {
    // console.log('selected block', block)
  }, [])

  const keyExtractor = useCallback((block) => block.hash, [])

  const linkExtractor = useCallback((block) => `/blocks/${block.height}`, [])

  const renderTitle = useCallback((block) => {
    return (
      <p className="text-md m-0 p-0 font-semibold text-black">
        {block.height.toLocaleString()}
      </p>
    )
  }, [])

  const renderSubtitle = useCallback((block) => {
    return (
      <span className="flex flex-row items-center justify-between font-normal text-gray-600">
        <span className="flex items-center">
          <Image src="/images/clock.svg" width={14} height={14} />
          <BlockTimestamp
            blockTime={block.time}
            className="ml-1 font-sans text-sm tracking-tight text-gray-525"
          />
        </span>
        <span className="ml-5 flex items-center justify-start">
          <Image src="/images/txn.svg" width={14} height={14} />
          <p className="m-0 ml-1 font-sans text-sm tracking-tight text-gray-525">
            {block.transactionCount} transactions
          </p>
        </span>
      </span>
    )
  }, [])

  const renderDetails = useCallback((block) => {
    return <span></span>
  }, [])

  return (
    <BaseList
      items={blocks}
      keyExtractor={keyExtractor}
      linkExtractor={linkExtractor}
      onSelectItem={handleSelectBlock}
      isLoading={isLoading}
      renderTitle={renderTitle}
      renderSubtitle={renderSubtitle}
      renderDetails={renderDetails}
      blankTitle="No blocks"
      fetchMore={fetchMore}
      isLoadingMore={isLoadingMore}
      hasMore={hasMore}
    />
  )
}

export default BlocksList
