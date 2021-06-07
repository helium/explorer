import classNames from 'classnames'

const InfoBoxPaneContainer = ({
  children,
  className,
  span = 2,
  padding = true,
}) => {
  return (
    <div
      className={classNames(
        'grid grid-flow-row overflow-y-scroll no-scrollbar',
        className,
        {
          'grid-cols-1': span === 1,
          'grid-cols-2 gap-3 md:gap-4': span === 2,
          // no bottom padding, because we have a spacer at the end of the list
          'pt-4 px-4 md:pt-8 md:px-8': padding,
        },
      )}
    >
      {children}
      {/* spacer for end of list */}
      <div className="pt-1.5 md:pt-4 px-1 col-span-2" />
    </div>
  )
}
export default InfoBoxPaneContainer
