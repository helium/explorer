import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'

const InfoBoxPaneTitleSection = ({ title, description }) => {
  const [showDescription, toggleDescription] = useToggle()

  return (
    <div
      className={classNames(
        'w-full px-4 py-2 bg-gray-200 border-b border-solid border-gray-400',
        { 'pb-4': showDescription },
      )}
    >
      <div
        className={classNames('flex items-center justify-between', {
          'pb-2': showDescription,
        })}
      >
        <span className="font-sans text-800 font-medium text-sm md:text-base whitespace-nowrap">
          {title}
        </span>
        {description && title && (
          <button
            className="px-2 py-0.5 bg-gray-200 focus:bg-gray-300 rounded-md border-gray-400 border-solid border outline-none focus:border-gray-400"
            onClick={toggleDescription}
          >
            <span className="flex items-center justify-end">
              <span className="text-xs text-gray-650 mr-1">Details</span>
              <ChevronIcon
                className={classNames(
                  'text-gray-650 transform h-3 w-auto transition-all duration-200',
                  {
                    'rotate-0': showDescription,
                    'rotate-180': !showDescription,
                  },
                )}
              />
            </span>
          </button>
        )}
      </div>
      {/* if there's a description AND a title, hide the description behind the "Details button", otherwise if there's a description and NO title just show the description */}
      {(showDescription || (description && !title)) && (
        <span className="font-sans text-gray-600 text-xs md:text-sm pt-1">
          {description}
        </span>
      )}
    </div>
  )
}

export default InfoBoxPaneTitleSection
