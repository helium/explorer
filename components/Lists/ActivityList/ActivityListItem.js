import classNames from 'classnames'
import ActivityPill from './ActivityPill'

const ActivityListItem = ({
  title,
  subtitle,
  details,
  pillClasses,
  pillSymbolClasses,
  pillColor,
}) => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between">
        <div className="w-full">
          <div className="text-sm md:text-base font-medium text-darkgray-800 font-sans">
            {title}
          </div>
          <div className="flex items-center space-x-1 md:space-x-4 h-6 text-gray-525 text-xs md:text-sm whitespace-nowrap">
            {subtitle}
          </div>
        </div>
        <ActivityPill
          className={classNames(
            'flex flex-row pl-2 pr-1 py-0.5 font-sans rounded-l-full',
            pillClasses,
          )}
          pillColor={pillColor}
          pillSymbolClasses={pillSymbolClasses}
          details={details}
        />
      </div>
    </div>
  )
}
export default ActivityListItem
