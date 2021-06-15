import classNames from 'classnames'
import debounce from 'lodash.debounce'
import { useEffect, useRef, useState, memo, useCallback } from 'react'
import { useActivity } from '../../../data/activity'
import ActivityList from '../../Lists/ActivityList/ActivityList'
import PillNavbar from '../../Nav/PillNavbar'

const hotspotFilters = {
  'All Activity': [],
  Rewards: ['rewards_v1', 'rewards_v2'],
  Beacons: ['poc_receipts_v1'],
  Data: ['state_channel_close_v1'],
  Consensus: ['consensus_group_v1'],
}

const accountFilters = {
  'All Activity': [],
  Payments: ['payment_v1', 'payment_v2'],
  'Hotspot Transfers': ['transfer_hotspot_v1'],
  'Token Burns': ['token_burn_v1'],
}

const ActivityPane = ({ context, address }) => {
  const scrollView = useRef()
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [filter, setFilter] = useState('All Activity')

  const filters = context === 'hotspot' ? hotspotFilters : accountFilters

  const {
    transactions,
    fetchMore,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
  } = useActivity(context, address, filters[filter])

  const setVisibility = useCallback(
    debounce(
      (currentPos, prevPos) => {
        setIsVisible(prevPos > currentPos)
        setPrevScrollPos(currentPos)
      },
      100,
      { leading: true, trailing: true },
    ),
    [],
  )

  const handleScroll = useCallback(
    ({ target: { scrollTop: currentScrollPos } }) => {
      setVisibility(currentScrollPos, prevScrollPos)
    },
    [prevScrollPos, setVisibility],
  )

  useEffect(() => {
    const currentScrollView = scrollView.current

    currentScrollView.addEventListener('scroll', handleScroll)

    return () => currentScrollView.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleUpdateFilter = useCallback((filterName) => {
    setFilter(filterName)
    scrollView.current.scrollTo(0, 0)
  }, [])

  return (
    <div
      ref={scrollView}
      className={classNames('no-scrollbar', {
        'overflow-y-scroll': !isLoadingInitial,
        'overflow-y-hidden': isLoadingInitial,
      })}
    >
      <div
        className={classNames(
          'sticky top-0 transform-gpu transition-transform duration-300 ease-in-out',
          { '-translate-y-16': !isVisible },
        )}
      >
        <PillNavbar
          navItems={Object.entries(filters).map(([key, value]) => ({
            key,
            value,
          }))}
          activeItem={filter}
          onClick={handleUpdateFilter}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1">
        <ActivityList
          context={context}
          address={address}
          transactions={transactions}
          isLoading={isLoadingInitial}
          isLoadingMore={isLoadingMore}
          fetchMore={fetchMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  )
}

export default memo(ActivityPane)
