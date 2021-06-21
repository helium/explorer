import classNames from 'classnames'
import useToggle from '../../../utils/useToggle'
import ChevronIcon from '../../Icons/Chevron'

const InfoBoxPaneTitleSection = ({
  listHeaderTitle,
  listHeaderDescription,
}) => {
  const [showDescription, toggleDescription] = useToggle()

  return (
    <div
      className={classNames(
        'w-full px-4 py-2 bg-gray-200 border-b border-solid border-gray-400',
        { 'pb-4': showDescription },
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-800 font-medium text-sm md:text-base">
          {listHeaderTitle}
        </span>
        {listHeaderDescription && listHeaderTitle && (
          <button
            className="px-2 py-1 bg-gray-300 shadow-sm rounded-full border-transparent border-solid border outline-none focus:border-gray-400"
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
      {(showDescription || (listHeaderDescription && !listHeaderTitle)) && (
        <span className="font-sans text-gray-600 text-xs md:text-sm pt-1">
          {listHeaderDescription}
        </span>
      )}
    </div>
  )
}

export default InfoBoxPaneTitleSection
