import { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import ChevronIcon from '../components/Icons/Chevron'

const ScrollIndicator = ({
  className,
  wrapperClasses,
  onClick,
  shown,
  direction = 'right',
}) => {
  return (
    <div
      className={classNames(
        wrapperClasses,
        'absolute cursor-pointer transform-gpu transition-all duration-200',
        {
          'opacity-100 pointer-events-auto': shown,
          'opacity-0 pointer-events-none': !shown,
          'right-0 top-0 h-full': direction === 'right',
          'left-0 top-0 h-full': direction === 'left',
          'left-0 right-0 bottom-0 w-full': direction === 'down',
          'left-0 right-0 top-0 w-full': direction === 'up',
        },
      )}
      onClick={onClick}
    >
      <div
        className={classNames(
          'flex items-center justify-center from-white via-white',
          {
            'w-8 h-full': direction === 'right' || direction === 'left',
            'w-full h-8': direction === 'up' || direction === 'down',
            'bg-gradient-to-l': direction === 'right',
            'bg-gradient-to-r': direction === 'left',
            'bg-gradient-to-t': direction === 'down',
            'bg-gradient-to-b': direction === 'up',
          },
          className,
        )}
      >
        <span
          className={classNames({
            'animate-bounce-right': direction === 'right',
            'animate-bounce-left ': direction === 'left',
            'animate-bounce': direction === 'down' || direction === 'up',
          })}
        >
          <ChevronIcon
            className={classNames('w-4 h-4 text-navy-400 opacity-75', {
              'rotate-90': direction === 'right',
              '-rotate-90': direction === 'left',
              'rotate-180': direction === 'down',
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

  const [scrollHeight, setScrollHeight] = useState()
  const [viewHeight, setViewHeight] = useState()
  const [scrollPositionY, setScrollPositionY] = useState()

  const updateScrollIndicators = useCallback(() => {
    const BUFFER_PIXELS = 20

    if (direction === 'horizontal') {
      setScrollWidth(scrollContainerRef?.current?.scrollWidth)
      setViewWidth(scrollContainerRef?.current?.clientWidth)
      setScrollPositionX(scrollContainerRef?.current?.scrollLeft)

      setIsScrollable(scrollWidth > viewWidth)
      setIsScrolledToEnd(
        scrollPositionX + BUFFER_PIXELS >= scrollWidth - viewWidth,
      )
      setIsScrolledToStart(scrollPositionX < BUFFER_PIXELS)
    } else {
      setScrollHeight(scrollContainerRef?.current?.scrollHeight)
      setViewHeight(scrollContainerRef?.current?.clientHeight)
      setScrollPositionY(scrollContainerRef?.current?.scrollTop)

      setIsScrollable(scrollHeight > viewHeight)
      setIsScrolledToEnd(
        scrollPositionY + BUFFER_PIXELS >= scrollHeight - viewHeight,
      )
      setIsScrolledToStart(scrollPositionY < BUFFER_PIXELS)
    }
  }, [
    direction,
    scrollContainerRef,
    scrollHeight,
    scrollPositionX,
    scrollPositionY,
    scrollWidth,
    viewHeight,
    viewWidth,
  ])

  const autoScroll = ({
    direction = 'right',
    distanceInPixels = 100,
    distanceInPercentOfContainer = 25,
  }) => {
    let distanceToScroll
    if (distanceInPercentOfContainer) {
      const relativeAmount =
        direction === 'left' || direction === 'right'
          ? scrollWidth * distanceInPercentOfContainer
          : scrollHeight * distanceInPercentOfContainer
      distanceToScroll = relativeAmount / 100
    } else {
      distanceToScroll = distanceInPixels
    }

    const scrollInstructions = {}
    if (direction === 'left') {
      scrollInstructions.left = -distanceToScroll
    } else if (direction === 'right') {
      scrollInstructions.left = distanceToScroll
    } else if (direction === 'up') {
      scrollInstructions.top = -distanceToScroll
    } else if (direction === 'down') {
      scrollInstructions.top = distanceToScroll
    }

    scrollContainerRef.current.scrollBy({
      ...scrollInstructions,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    // make sure it's relatively positioned (because the indicators will be absolutely positioned relative to it)
    if (scrollContainerRef?.current)
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

export default ScrollIndicator
