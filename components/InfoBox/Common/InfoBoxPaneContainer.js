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
          'p-4 md:p-8': padding,
        },
      )}
    >
      {children}
      {/* Spacer for end of list */}
      <div className="py-1 md:py-2 px-2 col-span-2" />
    </div>
  )
}
export default InfoBoxPaneContainer
