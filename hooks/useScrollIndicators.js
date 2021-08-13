import { useState, useEffect, useCallback } from 'react'

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
