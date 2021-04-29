import { useCallback } from 'react'
import Image from 'next/image'
import Timestamp from 'react-timestamp'
import BaseList from './BaseList'

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
      <p className="text-black text-md font-semibold m-0 p-0">
        {block.height.toLocaleString()}
      </p>
    )
  }, [])

  const renderSubtitle = useCallback((block) => {
    return (
      <span className="font-normal text-gray-600 flex flex-row items-center justify-between">
        <span className="flex items-center">
          <Image src="/images/clock.svg" width={14} height={14} />
          <Timestamp
            date={block.time}
            className="tracking-tighter text-gray-525 text-sm font-sans ml-1"
          />
        </span>
        <span className="flex items-center justify-start ml-5">
          <Image src="/images/txn.svg" width={14} height={14} />
          <p className="tracking-tighter text-gray-525 text-sm font-sans m-0 ml-1">
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
