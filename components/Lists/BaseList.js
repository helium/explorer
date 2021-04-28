import { useCallback } from 'react'
import Image from 'next/image'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import SkeletonList from './SkeletonList'
import classNames from 'classnames'

const BaseList = ({
  items,
  keyExtractor,
  isLoading = true,
  onSelectItem,
  renderTitle,
  renderSubtitle,
  renderDetails,
  blankTitle,
  noPadding,
  fetchMore,
  isLoadingMore,
  hasMore,
}) => {
  const [sentryRef] = useInfiniteScroll({
    loading: isLoadingMore,
    hasNextPage: hasMore,
    onLoadMore: fetchMore,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    // disabled: !!error,
    disabled: false,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  })

  const handleSelectItem = useCallback(
    (item) => () => {
      onSelectItem(item)
    },
    [onSelectItem],
  )

  if (isLoading) {
    return <SkeletonList />
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-600 py-6 text-base">
        {blankTitle}
      </div>
    )
  }

  return (
    <div
      className={classNames('w-full grid grid-cols-1', {
        'p-3': !noPadding,
      })}
    >
      {items.map((item, i, { length }) => (
        <div
          key={keyExtractor(item)}
          className={classNames(
            'bg-white',
            'hover:bg-gray-200 cursor-pointer transition-all duration-75',
            'relative flex',
            'px-4 py-2',
            'border-solid border-gray-500 border-t border-l border-r',
            {
              'rounded-t-lg': i === 0,
              'rounded-b-lg border-b': i === length - 1,
              'border-b-0': i !== 0 && i !== length - 1,
            },
          )}
          onClick={handleSelectItem(item)}
        >
          <div className="w-full">
            <div className="text-base font-medium">{renderTitle(item)}</div>
            <div className="flex items-center space-x-4 h-8 text-gray-800">
              {renderSubtitle(item)}
            </div>
          </div>
          <div className="flex items-center px-4">{renderDetails(item)}</div>
          <div className="flex">
            <Image src="/images/details-arrow.svg" width={10} height={10} />
          </div>
        </div>
      ))}
      {fetchMore && hasMore && (
        <div
          ref={sentryRef}
          className="text-center text-base text-gray-700 pb-4"
        >
          Loading more...
        </div>
      )}
    </div>
  )
}

export default BaseList
