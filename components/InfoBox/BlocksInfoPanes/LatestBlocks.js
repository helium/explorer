import classNames from 'classnames'
import { useFetchList } from '../../../data/activity'
import BlocksList from '../../Lists/BlocksList'
import Image from 'next/image'
import { Link } from 'react-router-i18n'

const LatestBlocksPane = () => {
  const {
    results: blocks,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useFetchList('', 'blocks')
  return (
    <div
      className={classNames('grid grid-flow-row grid-cols-1', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      {!isLoadingInitial && !isLoadingMore && (
        <Link
          to="/validators/consensus"
          className={classNames(
            'hover:bg-gray-100',
            'bg-white',
            'relative',
            'flex',
            'flex-col',
            'border',
            'border-solid',
            'border-gray-500',
            'rounded-lg',
            'mt-3 mx-3',
          )}
        >
          <div
            className={classNames(
              'absolute',
              'top-0',
              'bottom-0',
              'w-12',
              'flex',
              'items-center',
              'justify-center',
              'bg-purple-700',
              'p-2',
              'rounded-tl-lg',
              'rounded-bl-lg',
            )}
          >
            <Image src="/images/consensus_c.svg" width={30} height={30} />
          </div>
          <div className="pl-12 py-2">
            <p className="pl-2 mb-1 text-black font-medium">
              {(blocks[0].height + 1).toLocaleString()}
            </p>
            <p className="pl-2 text-gray-650 font-medium m-0">
              In Consensus...
            </p>
          </div>
        </Link>
      )}
      <BlocksList
        blocks={blocks}
        isLoading={isLoadingInitial}
        isLoadingMore={isLoadingMore}
        fetchMore={fetchMore}
        hasMore={hasMore}
      />
    </div>
  )
}

export default LatestBlocksPane
