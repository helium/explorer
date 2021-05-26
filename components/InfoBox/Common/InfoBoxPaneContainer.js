import classNames from 'classnames'

const InfoBoxPaneContainer = ({ children, classes }) => {
  return (
    <div
      className={classNames(
        'grid grid-flow-row grid-cols-2 gap-3 md:gap-4 p-4 md:p-8 overflow-y-scroll no-scrollbar',
        classes,
      )}
    >
      {children}
      {/* Spacer for end of list */}
      <div className="py-1 md:py-2 px-2 col-span-2" />
    </div>
  )
}
export default InfoBoxPaneContainer
