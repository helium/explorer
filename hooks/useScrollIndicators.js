import classNames from 'classnames'
import { useState, useEffect, useCallback } from 'react'
import ChevronIcon from '../components/Icons/Chevron'

export const ScrollIndicator = ({
  className,
  wrapperClasses,
  onClick,
  shown,
  direction = 'right',
}) => {
  return (
    <div
      className={classNames('absolute cursor-pointer', wrapperClasses, {
        'right-0 top-0 h-full': direction === 'right',
        'left-0 top-0 h-full': direction === 'left',
        // TODO: direction === 'up', 'down'
      })}
      onClick={onClick}
    >
      <div
        className={classNames(
          'from-white via-white w-10 h-full flex items-center justify-center transition-all duration-500',
          {
            'opacity-100': shown,
            'opacity-0': !shown,
            'bg-gradient-to-l': direction === 'right',
            'bg-gradient-to-r': direction === 'left',
            // TODO: direction === 'up', 'down'
          },
          className,
        )}
      >
        <span
          className={classNames({
            'animate-bounce-right': direction === 'right',
            'animate-bounce-left': direction === 'left',
            // TODO: direction === 'up', 'down'
          })}
        >
          <ChevronIcon
            className={classNames('w-4 h-4 text-navy-400', {
              'rotate-90': direction === 'right',
              '-rotate-90': direction === 'left',
              // TODO: direction === 'up', 'down'
            })}
          />
        </span>
      </div>
    </div>
  )
}

export const useScrollIndicators = (
  scrollContainerRef,
  direction = 'horizontal',
) => {
  const [isScrollable, setIsScrollable] = useState(false)
  const [isScrolledToStart, setIsScrolledToStart] = useState(true)
  const [isScrolledToEnd, setIsScrolledToEnd] = useState(true)

  const [scrollWidth, setScrollWidth] = useState()
  const [viewWidth, setViewWidth] = useState()
  const [scrollPositionX, setScrollPositionX] = useState()

  const updateScrollIndicators = useCallback(() => {
    const BUFFER_PIXELS = 20

    setScrollWidth(scrollContainerRef?.current?.scrollWidth)
    setViewWidth(scrollContainerRef?.current?.clientWidth)
    setScrollPositionX(scrollContainerRef?.current?.scrollLeft)

    setIsScrollable(scrollWidth > viewWidth)
    setIsScrolledToEnd(
      scrollPositionX + BUFFER_PIXELS >= scrollWidth - viewWidth,
    )
    setIsScrolledToStart(scrollPositionX < BUFFER_PIXELS)
  }, [scrollContainerRef, scrollPositionX, scrollWidth, viewWidth])

  const autoScroll = (options) => {
    const {
      direction = 'right',
      distanceInPixels = null,
      distanceInPercentOfContainer = 25,
    } = options

    let distanceToScroll
    if (distanceInPercentOfContainer) {
      distanceToScroll = (scrollWidth * distanceInPercentOfContainer) / 100
    } else {
      distanceToScroll = distanceInPixels
    }

    const scrollInstructions = {}
    if (direction === 'left') {
      scrollInstructions.left = -distanceToScroll
    } else if (direction === 'right') {
      scrollInstructions.left = distanceToScroll
    }

    scrollContainerRef.current.scrollBy({
      ...scrollInstructions,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    // make sure it's relatively positioned (because the indicators will be absolutely positioned relative to it)
    scrollContainerRef.current.style.position = 'relative'
    updateScrollIndicators()
  }, [scrollContainerRef, updateScrollIndicators])

  return {
    autoScroll,
    isScrollable,
    isScrolledToStart,
    updateScrollIndicators,
    isScrolledToEnd,
  }
}
