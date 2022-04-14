import { useCallback, useMemo } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import SkeletonList from './SkeletonList'
import classNames from 'classnames'
import { Link } from 'react-router-i18n'
import InfoBoxPaneTitleSection from '../InfoBox/Common/InfoBoxPaneTitleSection'
import SkeletonActivityList from './ActivityList/SkeletonActivityList'

const BaseList = ({
  items,
  listHeaderTitle,
  listHeaderDescription,
  listHeaderShowCount,
  listHeaderCount,
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
  itemPadding = true,
  expandableItem = () => false,
  defaultBaseItem = true,
  isActivityList = false,
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

  const baseRenderItem = useCallback(
    (item, i, { length }) => {
      const inner = renderItem ? (
        renderItem(item)
      ) : (
        <>
          <div className="w-full">
            <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans whitespace-nowrap">
              {renderTitle(item)}
            </div>
            <div className="flex items-center space-x-4 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
              {renderSubtitle(item)}
            </div>
          </div>
          <div className="flex items-center px-4 text-xs md:text-sm font-sans text-gray-525">
            {renderDetails(item)}
          </div>
          {linkExtractor && (
            <div className="flex items-center">
              <img alt="" src="/images/details-arrow.svg" />
            </div>
          )}
        </>
      )

      const defaultClasses = [
        'bg-white hover:bg-gray-200 focus:bg-gray-200 cursor-pointer transition-all duration-75 relative flex border-solid border-gray-500 border-b',
        {
          'px-4 py-2': itemPadding,
          'border-t-0': i !== 0 && i !== length - 1,
        },
      ]

      if (linkExtractor && !expandableItem(item)) {
        return (
          <Link
            to={linkExtractor(item)}
            onClick={handleSelectItem(item)}
            key={keyExtractor(item)}
            className={defaultBaseItem ? classNames(...defaultClasses) : ''}
          >
            {inner}
          </Link>
        )
      }

      return (
        <div
          key={keyExtractor(item)}
          className={defaultBaseItem ? classNames(...defaultClasses) : ''}
        >
          {inner}
        </div>
      )
    },
    [
      defaultBaseItem,
      expandableItem,
      handleSelectItem,
      itemPadding,
      keyExtractor,
      linkExtractor,
      renderDetails,
      renderItem,
      renderSubtitle,
      renderTitle,
    ],
  )

  const renderListHeaderTitle = useMemo(() => {
    if (listHeaderShowCount) {
      if (listHeaderCount !== undefined) {
        return `${listHeaderTitle} (${listHeaderCount.toLocaleString()})`
      } else {
        return `${listHeaderTitle} (${items.length.toLocaleString()})`
      }
    }

    return listHeaderTitle
  }, [items.length, listHeaderCount, listHeaderShowCount, listHeaderTitle])

  if (isLoading) {
    if (isActivityList) {
      return <SkeletonActivityList />
    } else {
      return <SkeletonList />
    }
  }

  if (items && items.length === 0) {
    return (
      <>
        {(listHeaderTitle || listHeaderDescription) && (
          <InfoBoxPaneTitleSection
            title={renderListHeaderTitle}
            description={listHeaderDescription}
          />
        )}
        <div className="flex items-center justify-center text-gray-600 py-6 text-base">
          {blankTitle}
        </div>
      </>
    )
  }

  return (
    <div
      className={classNames('w-full grid grid-cols-1', {
        'p-3': padding,
      })}
    >
      {(listHeaderTitle || listHeaderDescription) && (
        <InfoBoxPaneTitleSection
          title={renderListHeaderTitle}
          description={listHeaderDescription}
        />
      )}
      {(items || []).map((item, i, { length }) =>
        baseRenderItem(item, i, length),
      )}
      {fetchMore && hasMore && (
        <div
          ref={sentryRef}
          className="text-center text-base text-gray-700 py-2"
        >
          Loading more...
        </div>
      )}
    </div>
  )
}

export default BaseList
