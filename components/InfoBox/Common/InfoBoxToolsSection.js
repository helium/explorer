import classNames from 'classnames'

const InfoBoxToolsSection = ({ children }) => {
  return (
    <div
      className={classNames(
        'w-full px-4 py-2 bg-white border-b border-solid border-gray-300 ',
      )}
    >
      <div className={classNames('flex items-center justify-between')}>
        {children}
      </div>
    </div>
  )
}

export default InfoBoxToolsSection
