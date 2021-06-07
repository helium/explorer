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
    </div>
  )
}
export default InfoBoxPaneContainer
