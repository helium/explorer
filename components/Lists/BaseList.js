import { useCallback } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import SkeletonList from './SkeletonList'
import classNames from 'classnames'
import { Link } from 'react-router-i18n'

const BaseList = ({
  items,
  keyExtractor,
  linkExtractor,
  isLoading = true,
  onSelectItem,
  renderItem,
  renderTitle,
  renderSubtitle,
  renderDetails,
  blankTitle,
  padding,
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
      if (!onSelectItem) return
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
        'p-3': padding,
      })}
    >
      {items.map((item, i, { length }) => (
        <Link
          to={linkExtractor ? linkExtractor(item) : ''}
          onClick={handleSelectItem(item)}
          key={keyExtractor(item)}
          className={classNames(
            'bg-white',
            'hover:bg-gray-200 cursor-pointer transition-all duration-75',
            'relative flex',
            'px-4 py-2',
            'border-solid border-gray-500 border-t',
            {
              'border-t-0': i !== 0 && i !== length - 1,
            },
          )}
        >
          {renderItem ? (
            renderItem(item)
          ) : (
            <>
              <div className="w-full">
                <div className="text-base font-medium">{renderTitle(item)}</div>
                <div className="flex items-center space-x-4 h-6 text-gray-800">
                  {renderSubtitle(item)}
                </div>
              </div>
              <div className="flex items-center px-4">
                {renderDetails(item)}
              </div>
              <div className="flex items-center">
                <img src="/images/details-arrow.svg" />
              </div>
            </>
          )}
        </Link>
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
