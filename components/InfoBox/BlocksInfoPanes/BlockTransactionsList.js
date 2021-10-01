import classNames from 'classnames'
import { memo, useCallback } from 'react'
import { useFetchBlockTxns } from '../../../data/blocks'
import BaseList from '../../Lists/BaseList'
import InfoBoxPaneContainer from '../Common/InfoBoxPaneContainer'

const BlockTransactionsList = ({ height }) => {
  const {
    results: txns,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useFetchBlockTxns(height)

  // console.log(txns)

  const keyExtractor = useCallback((txn) => txn.hash, [])

  const linkExtractor = useCallback((txn) => `/txns/${txn.hash}`, [])

  // const renderItem = useCallback((txn) => {
  //   return (
  //     <div className="flex w-full">
  //       <div className="w-full">
  //         <div className="flex flex-row items-center justify-start">
  //           <span className="text-navy-400 font-bold text-base pr-1">
  //             {txn?.type}
  //           </span>
  //           <span className="text-black text-base font-semibold">
  //             {txn?.hash}
  //           </span>
  //         </div>
  //       </div>
  //       <div className="flex items-center">
  //         <img alt="" src="/images/details-arrow.svg" />
  //       </div>
  //     </div>
  //   )
  // }, [])

  const renderTitle = useCallback((t) => {
    return t.type
  }, [])

  const renderSubtitle = useCallback((t) => {
    return t.hash
  }, [])

  const renderDetails = useCallback((t) => {
    return t.time
  }, [])

  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1 no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <BaseList
        items={txns}
        keyExtractor={keyExtractor}
        linkExtractor={linkExtractor}
        isLoading={!txns || isLoadingInitial}
        fetchMore={fetchMore}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        renderTitle={renderTitle}
        renderSubtitle={renderSubtitle}
        renderDetails={renderDetails}
        blankTitle="No Transactions"
        // renderItem={renderItem}
        // render
      />
    </div>
  )
}

export default memo(BlockTransactionsList)
