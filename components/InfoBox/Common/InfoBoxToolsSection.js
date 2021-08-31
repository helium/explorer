import classNames from 'classnames'

const InfoBoxToolsSection = ({
  children,
  className,
  defaultClasses = true,
}) => {
  return (
    <div
      className={classNames(
        {
          'bg-white w-full px-4 py-2 border-b border-solid border-gray-400':
            defaultClasses,
        },
        className,
      )}
    >
      <div className={classNames('flex items-center justify-between')}>
        {children}
      </div>
    </div>
  )
}

export default InfoBoxToolsSection
