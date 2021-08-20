import classNames from 'classnames'
import { useRef } from 'react'
import { useScrollIndicators } from '../../../hooks/useScrollIndicators'
import ScrollIndicator from '../../../hooks/useScrollIndicators'

const InfoBoxPaneContainer = ({
  children,
  className,
  span = 2,
  padding = true,
}) => {
  const scrollContainer = useRef(null)

  const { autoScroll, isScrollable, isScrolledToEnd, updateScrollIndicators } =
    useScrollIndicators(scrollContainer, 'vertical')

  return (
    <>
      <div
        className={classNames(
          'grid grid-flow-row relative overflow-y-scroll no-scrollbar',
          className,
          {
            'grid-cols-1': span === 1,
            'grid-cols-2 gap-3 md:gap-4': span === 2,
            // no bottom padding, because we have a spacer at the end of the list
            'pt-4 px-4 md:pt-8 md:px-8': padding,
          },
        )}
        onScroll={updateScrollIndicators}
        ref={scrollContainer}
      >
        {children}
        {/* spacer for end of list */}
        <div className="pt-1.5 md:pt-4 px-1 col-span-2" />
      </div>
      <ScrollIndicator
        direction="down"
        onClick={() => autoScroll({ direction: 'down' })}
        shown={isScrollable && !isScrolledToEnd}
      />
      {/* hard to position the scroll up indicator in the right spot with the way tab nav / subtitles effect the height of the container */}
      {/* TODO: fix scroll up positioning so it never floats in wrong place */}
      {/* <ScrollIndicator
        direction="up"
        wrapperClasses="pt-14"
        className="pt-1"
        onClick={() => autoScroll({ direction: 'up' })}
        shown={isScrollable && !isScrolledToStart}
      /> */}
    </>
  )
}
export default InfoBoxPaneContainer
